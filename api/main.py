"""
Product Catalog Management System - API
FastAPI + PyMongo (MongoDB) backend exposing catalog queries.
"""
import os
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel

MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:adminpassword@localhost:27017/product_catalog?authSource=admin")

client = MongoClient(MONGO_URI)
db = client["product_catalog"]

products_col = db["products"]
categories_col = db["categories"]
suppliers_col = db["suppliers"]
reviews_col = db["reviews"]
users_col = db["users"]

app = FastAPI(title="Product Catalog Management System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fix_id(doc):
    if isinstance(doc, list):
        return [fix_id(item) for item in doc]
    if isinstance(doc, dict):
        return {k: fix_id(v) for k, v in doc.items()}
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc


def fix_ids(docs):
    return [fix_id(d) for d in docs]


@app.get("/")
def root():
    return {"message": "Product Catalog Management System API is running"}


# ---------- 1. Recherche multi-critères ----------
@app.get("/products/search")
def search_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
):
    query = {}
    if category:
        query["category_name"] = category
    if brand:
        query["brand"] = brand
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if in_stock is not None:
        query["stock"] = {"$gt": 0} if in_stock else {"$lte": 0}
    results = list(products_col.find(query).limit(100))
    return fix_ids(results)


# ---------- 2. Produits en rupture de stock ----------
@app.get("/products/out-of-stock")
def out_of_stock():
    results = list(products_col.find({"stock": {"$lte": 0}}))
    return fix_ids(results)


# ---------- 3. Historique de prix d'un produit ----------
@app.get("/products/{product_id}/price-history")
def price_history(product_id: str):
    product = products_col.find_one({"_id": ObjectId(product_id)}, {"price_history": 1, "name": 1})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return fix_id(product)


# ---------- 4. Meilleurs produits notes par categorie ----------
@app.get("/products/top-rated")
def top_rated(category: Optional[str] = None, limit: int = 10):
    pipeline = []
    if category:
        pipeline.append({"$match": {"category_name": category}})
    pipeline += [
        {"$addFields": {"avg_rating": {"$avg": "$reviews.rating"}}},
        {"$sort": {"avg_rating": -1}},
        {"$limit": limit},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------- 5. Produits d'un fournisseur ----------
@app.get("/suppliers/{supplier_id}/products")
def supplier_products(supplier_id: str):
    supplier = suppliers_col.find_one({"_id": ObjectId(supplier_id)})
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    product_ids = supplier.get("products_supplied", [])
    results = list(products_col.find({"_id": {"$in": [ObjectId(pid) for pid in product_ids]}}))
    return fix_ids(results)


# ---------- 6. Categories sans produits actifs ----------
@app.get("/categories/empty")
def empty_categories():
    used_categories = products_col.distinct("category_name")
    results = list(categories_col.find({"name": {"$nin": used_categories}}))
    return fix_ids(results)


# ---------- 7. Produits similaires (meme categorie, prix proche) ----------
@app.get("/products/{product_id}/similar")
def similar_products(product_id: str, limit: int = 5):
    product = products_col.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    price = product.get("price", 0)
    results = list(products_col.find({
        "category_name": product.get("category_name"),
        "_id": {"$ne": product["_id"]},
        "price": {"$gte": price * 0.7, "$lte": price * 1.3},
    }).limit(limit))
    return fix_ids(results)


# ---------- 8. Marge moyenne par categorie ----------
@app.get("/categories/avg-margin")
def avg_margin_by_category():
    pipeline = [
        {"$group": {
            "_id": "$category_name",
            "avg_price": {"$avg": "$price"},
            "avg_cost": {"$avg": "$cost_price"},
            "count": {"$sum": 1},
        }},
        {"$addFields": {"avg_margin": {"$subtract": ["$avg_price", "$avg_cost"]}}},
        {"$sort": {"avg_margin": -1}},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------- 9. Avis suspects (note extreme sans commentaire) ----------
@app.get("/reviews/suspicious")
def suspicious_reviews():
    query = {
        "$or": [
            {"rating": {"$in": [1, 5]}, "comment": {"$in": ["", None]}},
        ]
    }
    results = list(reviews_col.find(query))
    return fix_ids(results)


# ---------- 10. Produits jamais commandes depuis X mois ----------
@app.get("/products/stale")
def stale_products(months: int = 6):
    cutoff = datetime.utcnow().timestamp() - months * 30 * 24 * 3600
    cutoff_date = datetime.utcfromtimestamp(cutoff)
    results = list(products_col.find({
        "$or": [
            {"last_ordered_at": {"$lt": cutoff_date}},
            {"last_ordered_at": {"$exists": False}},
        ]
    }))
    return fix_ids(results)


# ---------- 11. Wishlist d'un utilisateur ----------
@app.get("/users/{user_id}/wishlist")
def user_wishlist(user_id: str):
    user = users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    wishlist_ids = user.get("wishlist", [])
    results = list(products_col.find({"_id": {"$in": [ObjectId(pid) for pid in wishlist_ids]}}))
    return fix_ids(results)


# ---------- 12. Repartition des produits par categorie (count) ----------
@app.get("/categories/distribution")
def category_distribution():
    pipeline = [
        {"$group": {"_id": "$category_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------- 13. Recherche full-text sur nom/description ----------
@app.get("/products/text-search")
def text_search(q: str):
    results = list(products_col.find({"$text": {"$search": q}}).limit(50))
    return fix_ids(results)


# ---------- 14. Note moyenne d'un produit ----------
@app.get("/products/{product_id}/rating")
def product_rating(product_id: str):
    pipeline = [
        {"$match": {"product_id": product_id}},
        {"$group": {"_id": "$product_id", "avg_rating": {"$avg": "$rating"}, "count": {"$sum": 1}}},
    ]
    result = list(reviews_col.aggregate(pipeline))
    if not result:
        return {"product_id": product_id, "avg_rating": None, "count": 0}
    return fix_ids(result)[0]


# ---------- 15. Top marques par nombre de produits ----------
@app.get("/brands/top")
def top_brands(limit: int = 10):
    pipeline = [
        {"$group": {"_id": "$brand", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": limit},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------- CRUD basique (bonus) ----------
class Product(BaseModel):
    name: str
    description: str
    category_name: str
    brand: str
    price: float
    cost_price: float
    stock: int
    attributes: dict = {}


@app.post("/products")
def create_product(product: Product):
    result = products_col.insert_one(product.dict())
    return {"inserted_id": str(result.inserted_id)}


@app.get("/products")
def list_products(limit: int = 50):
    results = list(products_col.find().limit(limit))
    return fix_ids(results)
