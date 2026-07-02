"""
Product Catalog Management System - Frontend (Streamlit)
Interface web pour exposer les requetes de l'API sur le catalogue produit.
"""
import os
import requests
import pandas as pd
import streamlit as st
import plotly.express as px

API_URL = os.getenv("API_URL", "http://localhost:8000")

st.set_page_config(page_title="Product Catalog Management System", layout="wide")
st.title("Product Catalog Management System")
st.caption("Base de donnees NoSQL (MongoDB) - Projet groupe YNOV B3")

menu = st.sidebar.radio(
    "Navigation",
    [
        "Recherche produits",
        "Rupture de stock",
        "Top produits notes",
        "Categories vides",
        "Marge moyenne / categorie",
        "Repartition par categorie",
        "Top marques",
        "Avis suspects",
        "Produits obsoletes",
        "Ajouter un produit",
    ],
)


def get(endpoint, params=None):
    try:
        r = requests.get(f"{API_URL}{endpoint}", params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        st.error(f"Erreur API: {e}")
        return []


if menu == "Recherche produits":
    st.subheader("Recherche multi-criteres")
    col1, col2, col3 = st.columns(3)
    category = col1.text_input("Categorie")
    brand = col2.text_input("Marque")
    in_stock = col3.selectbox("Stock", ["Tous", "En stock", "Rupture"])
    min_price, max_price = st.slider("Fourchette de prix", 0, 5000, (0, 5000))
    if st.button("Rechercher"):
        params = {"min_price": min_price, "max_price": max_price}
        if category:
            params["category"] = category
        if brand:
            params["brand"] = brand
        if in_stock != "Tous":
            params["in_stock"] = in_stock == "En stock"
        data = get("/products/search", params)
        if data:
            st.dataframe(pd.DataFrame(data))

elif menu == "Rupture de stock":
    st.subheader("Produits en rupture de stock")
    data = get("/products/out-of-stock")
    if data:
        st.dataframe(pd.DataFrame(data))
    else:
        st.info("Aucun produit en rupture.")

elif menu == "Top produits notes":
    st.subheader("Meilleurs produits notes")
    category = st.text_input("Filtrer par categorie (optionnel)")
    limit = st.slider("Nombre de resultats", 1, 20, 10)
    params = {"limit": limit}
    if category:
        params["category"] = category
    data = get("/products/top-rated", params)
    if data:
        st.dataframe(pd.DataFrame(data))

elif menu == "Categories vides":
    st.subheader("Categories sans produit actif")
    data = get("/categories/empty")
    if data:
        st.dataframe(pd.DataFrame(data))
    else:
        st.info("Toutes les categories ont des produits.")

elif menu == "Marge moyenne / categorie":
    st.subheader("Marge moyenne par categorie")
    data = get("/categories/avg-margin")
    if data:
        df = pd.DataFrame(data)
        st.dataframe(df)
        fig = px.bar(df, x="_id", y="avg_margin", title="Marge moyenne par categorie")
        st.plotly_chart(fig, use_container_width=True)

elif menu == "Repartition par categorie":
    st.subheader("Repartition des produits par categorie")
    data = get("/categories/distribution")
    if data:
        df = pd.DataFrame(data)
        fig = px.pie(df, names="_id", values="count", title="Repartition par categorie")
        st.plotly_chart(fig, use_container_width=True)

elif menu == "Top marques":
    st.subheader("Top marques par nombre de produits")
    limit = st.slider("Nombre de marques", 1, 20, 10)
    data = get("/brands/top", {"limit": limit})
    if data:
        df = pd.DataFrame(data)
        fig = px.bar(df, x="_id", y="count", title="Top marques")
        st.plotly_chart(fig, use_container_width=True)

elif menu == "Avis suspects":
    st.subheader("Avis suspects (note extreme sans commentaire)")
    data = get("/reviews/suspicious")
    if data:
        st.dataframe(pd.DataFrame(data))
    else:
        st.info("Aucun avis suspect detecte.")

elif menu == "Produits obsoletes":
    st.subheader("Produits jamais commandes recemment")
    months = st.slider("Anciennete (mois)", 1, 24, 6)
    data = get("/products/stale", {"months": months})
    if data:
        st.dataframe(pd.DataFrame(data))

elif menu == "Ajouter un produit":
    st.subheader("Ajouter un nouveau produit")
    with st.form("add_product"):
        name = st.text_input("Nom")
        description = st.text_area("Description")
        category_name = st.text_input("Categorie")
        brand = st.text_input("Marque")
        price = st.number_input("Prix de vente", min_value=0.0, step=0.01)
        cost_price = st.number_input("Prix d achat", min_value=0.0, step=0.01)
        stock = st.number_input("Stock", min_value=0, step=1)
        submitted = st.form_submit_button("Creer")
        if submitted:
            payload = {
                "name": name,
                "description": description,
                "category_name": category_name,
                "brand": brand,
                "price": price,
                "cost_price": cost_price,
                "stock": int(stock),
                "attributes": {},
            }
            try:
                r = requests.post(f"{API_URL}/products", json=payload, timeout=10)
                r.raise_for_status()
                st.success(f"Produit cree: {r.json()}")
            except Exception as e:
                st.error(f"Erreur: {e}")
