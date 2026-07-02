"""
Product Catalog Management System - API
FastAPI + PyMongo (MongoDB) backend exposant les requêtes du catalogue produit.
"""
import os
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Query, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://admin:adminpassword@localhost:27017/product_catalog?authSource=admin"
)
API_KEY = os.getenv("API_KEY", "secret-api-key")

client = MongoClient(MONGO_URI)
db = client["product_catalog"]

products_col  = db["products"]
categories_col = db["categories"]
suppliers_col  = db["suppliers"]
reviews_col    = db["reviews"]
users_col      = db["users"]

app = FastAPI(title="Product Catalog Management System API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Utilitaires de sérialisation
# ---------------------------------------------------------------------------
def fix_id(doc):
    """Convertit récursivement tous les ObjectId en chaînes de caractères."""
    if isinstance(doc, list):
        return [fix_id(item) for item in doc]
    if isinstance(doc, dict):
        return {k: fix_id(v) for k, v in doc.items()}
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc


def fix_ids(docs):
    return [fix_id(d) for d in docs]


# ---------------------------------------------------------------------------
# Authentification par clé API (routes protégées)
# ---------------------------------------------------------------------------
def verify_api_key(x_api_key: str = Header(..., alias="X-API-Key")):
    """Vérifie que l'en-tête X-API-Key correspond à la clé configurée."""
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Clé API invalide ou manquante.")
    return x_api_key


# ---------------------------------------------------------------------------
# Route racine
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Product Catalog Management System API v2 est en ligne"}


# ---------------------------------------------------------------------------
# 1. Recherche multi-critères
# ---------------------------------------------------------------------------
@app.get("/products/search")
def search_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    skip: int = Query(0, ge=0, description="Nombre de documents à ignorer"),
    limit: int = Query(50, ge=1, le=200, description="Nombre maximum de résultats"),
):
    """Recherche de produits avec filtres multiples et pagination."""
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
    results = list(products_col.find(query).skip(skip).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 2. Produits en rupture de stock
# ---------------------------------------------------------------------------
@app.get("/products/out-of-stock")
def out_of_stock(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Liste des produits dont le stock est nul ou négatif."""
    results = list(products_col.find({"stock": {"$lte": 0}}).skip(skip).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 3. Produits jamais commandés depuis X mois
# ---------------------------------------------------------------------------
@app.get("/products/stale")
def stale_products(
    months: int = 6,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Produits sans commande depuis X mois."""
    cutoff = datetime.utcnow().timestamp() - months * 30 * 24 * 3600
    cutoff_date = datetime.utcfromtimestamp(cutoff)
    results = list(products_col.find({
        "$or": [
            {"last_ordered_at": {"$lt": cutoff_date}},
            {"last_ordered_at": {"$exists": False}},
        ]
    }).skip(skip).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 4. Meilleurs produits notés par catégorie
# ---------------------------------------------------------------------------
@app.get("/products/top-rated")
def top_rated(
    category: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    """Produits triés par note moyenne décroissante."""
    pipeline = []
    if category:
        pipeline.append({"$match": {"category_name": category}})
    pipeline += [
        {"$addFields": {"avg_rating": {"$avg": "$reviews.rating"}}},
        {"$sort": {"avg_rating": -1}},
        {"$skip": skip},
        {"$limit": limit},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 5. Recherche full-text sur nom/description
# ---------------------------------------------------------------------------
@app.get("/products/text-search")
def text_search(
    q: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Recherche full-text sur les champs indexés (name, description)."""
    results = list(products_col.find({"$text": {"$search": q}}).skip(skip).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 6. Liste de tous les produits (pagination)
# ---------------------------------------------------------------------------
@app.get("/products")
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Liste paginée de tous les produits."""
    results = list(products_col.find().skip(skip).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 7. Historique de prix d'un produit
# ---------------------------------------------------------------------------
@app.get("/products/{product_id}/price-history")
def price_history(product_id: str):
    """Retourne l'historique de prix d'un produit."""
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant produit invalide.")
    product = products_col.find_one({"_id": oid}, {"price_history": 1, "name": 1, "price": 1})
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable.")
    return fix_id(product)


# ---------------------------------------------------------------------------
# 8. Note moyenne d'un produit
# ---------------------------------------------------------------------------
@app.get("/products/{product_id}/rating")
def product_rating(product_id: str):
    """Calcule la note moyenne d'un produit depuis la collection reviews."""
    pipeline = [
        {"$match": {"product_id": product_id}},
        {"$group": {"_id": "$product_id", "avg_rating": {"$avg": "$rating"}, "count": {"$sum": 1}}},
    ]
    result = list(reviews_col.aggregate(pipeline))
    if not result:
        return {"product_id": product_id, "avg_rating": None, "count": 0}
    return fix_ids(result)[0]


# ---------------------------------------------------------------------------
# 9. Produits similaires (même catégorie, prix proche)
# ---------------------------------------------------------------------------
@app.get("/products/{product_id}/similar")
def similar_products(
    product_id: str,
    limit: int = Query(5, ge=1, le=20),
):
    """Produits similaires au produit donné (même catégorie, fourchette de prix ±30%)."""
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant produit invalide.")
    product = products_col.find_one({"_id": oid})
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable.")
    price = product.get("price", 0)
    results = list(products_col.find({
        "category_name": product.get("category_name"),
        "_id": {"$ne": product["_id"]},
        "price": {"$gte": price * 0.7, "$lte": price * 1.3},
    }).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 10. Produits d'un fournisseur
# ---------------------------------------------------------------------------
@app.get("/suppliers/{supplier_id}/products")
def supplier_products(supplier_id: str):
    """Retourne tous les produits fournis par un fournisseur donné."""
    try:
        oid = ObjectId(supplier_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant fournisseur invalide.")
    supplier = suppliers_col.find_one({"_id": oid})
    if not supplier:
        raise HTTPException(status_code=404, detail="Fournisseur introuvable.")
    product_ids = supplier.get("products_supplied", [])
    if not product_ids:
        return []
    results = list(products_col.find({
        "_id": {"$in": [ObjectId(pid) for pid in product_ids if len(pid) == 24]}
    }))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 11. Catégories sans produits actifs
# ---------------------------------------------------------------------------
@app.get("/categories/empty")
def empty_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Catégories ne contenant aucun produit."""
    used_categories = products_col.distinct("category_name")
    results = list(
        categories_col.find({"name": {"$nin": used_categories}}).skip(skip).limit(limit)
    )
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 12. Marge moyenne par catégorie
# ---------------------------------------------------------------------------
@app.get("/categories/avg-margin")
def avg_margin_by_category():
    """Calcule la marge moyenne (prix vente - prix achat) par catégorie."""
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


# ---------------------------------------------------------------------------
# 13. Répartition des produits par catégorie
# ---------------------------------------------------------------------------
@app.get("/categories/distribution")
def category_distribution():
    """Nombre de produits par catégorie."""
    pipeline = [
        {"$group": {"_id": "$category_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 14. Avis suspects (note extrême sans commentaire)
# ---------------------------------------------------------------------------
@app.get("/reviews/suspicious")
def suspicious_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """Détecte les avis suspects : note de 1 ou 5 sans commentaire."""
    query = {
        "$or": [
            {"rating": {"$in": [1, 5]}, "comment": {"$in": ["", None]}},
        ]
    }
    results = list(reviews_col.find(query).skip(skip).limit(limit))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 15. Wishlist d'un utilisateur
# ---------------------------------------------------------------------------
@app.get("/users/{user_id}/wishlist")
def user_wishlist(user_id: str):
    """Retourne les produits dans la wishlist d'un utilisateur."""
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant utilisateur invalide.")
    user = users_col.find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    wishlist_ids = user.get("wishlist", [])
    if not wishlist_ids:
        return []
    results = list(products_col.find({
        "_id": {"$in": [ObjectId(pid) for pid in wishlist_ids if len(pid) == 24]}
    }))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 16. Top marques par nombre de produits
# ---------------------------------------------------------------------------
@app.get("/brands/top")
def top_brands(
    limit: int = Query(10, ge=1, le=50),
    skip: int = Query(0, ge=0),
):
    """Classement des marques par nombre de produits décroissant."""
    pipeline = [
        {"$group": {"_id": "$brand", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$skip": skip},
        {"$limit": limit},
    ]
    results = list(products_col.aggregate(pipeline))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 16b. Liste de toutes les marques distinctes
# ---------------------------------------------------------------------------
@app.get("/brands")
def list_brands():
    """Retourne la liste de toutes les marques distinctes du catalogue."""
    brands = products_col.distinct("brand")
    return sorted([b for b in brands if b])


# ---------------------------------------------------------------------------
# 16c. Liste de toutes les catégories
# ---------------------------------------------------------------------------
@app.get("/categories")
def list_categories():
    """Retourne toutes les catégories du catalogue."""
    results = list(categories_col.find())
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 17. Liste des fournisseurs
# ---------------------------------------------------------------------------
@app.get("/suppliers")
def list_suppliers():
    """Retourne la liste de tous les fournisseurs."""
    results = list(suppliers_col.find())
    return fix_ids(results)


# ---------------------------------------------------------------------------
# 18. Liste des utilisateurs
# ---------------------------------------------------------------------------
@app.get("/users")
def list_users():
    """Retourne la liste de tous les utilisateurs."""
    results = list(users_col.find({}, {"email": 1, "name": 1, "wishlist": 1}))
    return fix_ids(results)


# ---------------------------------------------------------------------------
# CRUD protégé par clé API
# ---------------------------------------------------------------------------
class Product(BaseModel):
    name: str
    description: str
    category_name: str
    brand: str
    price: float
    cost_price: float
    stock: int
    attributes: dict = {}


@app.post("/products", dependencies=[Depends(verify_api_key)])
def create_product(product: Product):
    """Crée un nouveau produit (authentification requise via X-API-Key)."""
    doc = product.dict()
    doc["created_at"] = datetime.utcnow()
    doc["price_history"] = [{"price": product.price, "date": datetime.utcnow()}]
    doc["reviews"] = []
    result = products_col.insert_one(doc)
    return {"inserted_id": str(result.inserted_id)}


@app.delete("/products/{product_id}", dependencies=[Depends(verify_api_key)])
def delete_product(product_id: str):
    """Supprime un produit par son identifiant (authentification requise)."""
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant produit invalide.")
    result = products_col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit introuvable.")
    return {"deleted": True, "product_id": product_id}


@app.put("/products/{product_id}/stock", dependencies=[Depends(verify_api_key)])
def update_stock(product_id: str, stock: int):
    """Met à jour le stock d'un produit (authentification requise)."""
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant produit invalide.")
    result = products_col.update_one({"_id": oid}, {"$set": {"stock": stock}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produit introuvable.")
    return {"updated": True, "product_id": product_id, "new_stock": stock}
