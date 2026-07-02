"""
Product Catalog Management System - Frontend (Streamlit)
Interface web pour exposer les requêtes de l'API sur le catalogue produit.
"""
import os
import requests
import pandas as pd
import streamlit as st
import plotly.express as px

API_URL = os.getenv("API_URL", "http://localhost:8000")
API_KEY = os.getenv("API_KEY", "secret-api-key")

st.set_page_config(
    page_title="Product Catalog Management System",
    page_icon="📦",
    layout="wide",
)
st.title("📦 Product Catalog Management System")
st.caption("Base de données NoSQL (MongoDB) – Projet groupe YNOV B3")

# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------
menu = st.sidebar.radio(
    "🗂️ Navigation",
    [
        # Pages existantes
        "🔍 Recherche produits",
        "⚠️ Rupture de stock",
        "⭐ Top produits notés",
        "📂 Catégories vides",
        "💰 Marge moyenne / catégorie",
        "📊 Répartition par catégorie",
        "🏆 Top marques",
        "🚨 Avis suspects",
        "🕰️ Produits obsolètes",
        # Nouvelles pages
        "📈 Historique de prix",
        "🔗 Produits similaires",
        "🏭 Produits par fournisseur",
        "❤️ Wishlist utilisateur",
        "🔎 Recherche full-text",
        "⭐ Note moyenne produit",
        # CRUD
        "➕ Ajouter un produit",
    ],
)


# ---------------------------------------------------------------------------
# Fonctions utilitaires
# ---------------------------------------------------------------------------
def get(endpoint, params=None):
    """Effectue une requête GET sur l'API et retourne le JSON ou une liste vide."""
    try:
        r = requests.get(f"{API_URL}{endpoint}", params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        st.error(f"Erreur API : {e}")
        return []


def get_suppliers():
    """Retourne la liste des fournisseurs (pour les sélecteurs)."""
    return get("/suppliers")


def get_users():
    """Retourne la liste des utilisateurs (pour les sélecteurs)."""
    return get("/users")


def get_products_list(limit=200):
    """Retourne la liste des produits (pour les sélecteurs)."""
    return get("/products", params={"limit": limit})


def get_categories():
    """Retourne la liste de toutes les catégories."""
    return get("/categories")


def get_brands():
    """Retourne la liste de toutes les marques."""
    return get("/brands")


# ---------------------------------------------------------------------------
# Page : Recherche multi-critères
# ---------------------------------------------------------------------------
if menu == "🔍 Recherche produits":
    st.subheader("Recherche multi-critères")
    col1, col2, col3 = st.columns(3)
    
    # Récupération dynamique des catégories et marques pour les listes déroulantes
    categories_list = get_categories()
    brands_list = get_brands()
    
    category_options = ["Tous"] + [c["name"] for c in categories_list if "name" in c]
    brand_options = ["Tous"] + brands_list
    
    category = col1.selectbox("Catégorie", category_options)
    brand = col2.selectbox("Marque", brand_options)
    in_stock = col3.selectbox("Stock", ["Tous", "En stock", "Rupture"])
    min_price, max_price = st.slider("Fourchette de prix (€)", 0, 5000, (0, 5000))
    col_skip, col_limit = st.columns(2)
    skip  = col_skip.number_input("Ignorer les N premiers résultats", min_value=0, value=0, step=10)
    limit = col_limit.number_input("Nombre de résultats max", min_value=1, max_value=200, value=50, step=10)
    if st.button("Rechercher"):
        params = {"min_price": min_price, "max_price": max_price, "skip": skip, "limit": limit}
        if category != "Tous":
            params["category"] = category
        if brand != "Tous":
            params["brand"] = brand
        if in_stock != "Tous":
            params["in_stock"] = in_stock == "En stock"
        data = get("/products/search", params)
        if data:
            st.success(f"{len(data)} produit(s) trouvé(s)")
            st.dataframe(pd.DataFrame(data))
        else:
            st.info("Aucun produit trouvé.")

# ---------------------------------------------------------------------------
# Page : Rupture de stock
# ---------------------------------------------------------------------------
elif menu == "⚠️ Rupture de stock":
    st.subheader("Produits en rupture de stock")
    col_skip, col_limit = st.columns(2)
    skip  = col_skip.number_input("Sauter", min_value=0, value=0, step=10)
    limit = col_limit.number_input("Limite", min_value=1, max_value=200, value=50, step=10)
    data = get("/products/out-of-stock", {"skip": skip, "limit": limit})
    if data:
        st.warning(f"{len(data)} produit(s) en rupture de stock")
        st.dataframe(pd.DataFrame(data)[["name", "brand", "category_name", "price", "stock"]])
    else:
        st.success("Aucun produit en rupture de stock.")

# ---------------------------------------------------------------------------
# Page : Top produits notés
# ---------------------------------------------------------------------------
elif menu == "⭐ Top produits notés":
    st.subheader("Meilleurs produits notés")
    category = st.text_input("Filtrer par catégorie (optionnel)")
    col_lim, col_skip = st.columns(2)
    limit = col_lim.slider("Nombre de résultats", 1, 50, 10)
    skip  = col_skip.number_input("Sauter les N premiers", min_value=0, value=0, step=5)
    params = {"limit": limit, "skip": skip}
    if category:
        params["category"] = category
    data = get("/products/top-rated", params)
    if data:
        df = pd.DataFrame(data)
        st.dataframe(df[["name", "brand", "category_name", "price", "avg_rating"]] if "avg_rating" in df.columns else df)

# ---------------------------------------------------------------------------
# Page : Catégories vides
# ---------------------------------------------------------------------------
elif menu == "📂 Catégories vides":
    st.subheader("Catégories sans produit actif")
    data = get("/categories/empty")
    if data:
        st.dataframe(pd.DataFrame(data))
    else:
        st.info("Toutes les catégories ont des produits.")

# ---------------------------------------------------------------------------
# Page : Marge moyenne / catégorie
# ---------------------------------------------------------------------------
elif menu == "💰 Marge moyenne / catégorie":
    st.subheader("Marge moyenne par catégorie")
    data = get("/categories/avg-margin")
    if data:
        df = pd.DataFrame(data)
        st.dataframe(df)
        fig = px.bar(
            df, x="_id", y="avg_margin",
            title="Marge moyenne par catégorie (€)",
            labels={"_id": "Catégorie", "avg_margin": "Marge moyenne (€)"},
            color="avg_margin", color_continuous_scale="Viridis",
        )
        st.plotly_chart(fig, use_container_width=True)

# ---------------------------------------------------------------------------
# Page : Répartition par catégorie
# ---------------------------------------------------------------------------
elif menu == "📊 Répartition par catégorie":
    st.subheader("Répartition des produits par catégorie")
    data = get("/categories/distribution")
    if data:
        df = pd.DataFrame(data)
        col1, col2 = st.columns(2)
        with col1:
            fig = px.pie(df, names="_id", values="count", title="Part par catégorie")
            st.plotly_chart(fig, use_container_width=True)
        with col2:
            fig2 = px.bar(df, x="_id", y="count", title="Nombre de produits par catégorie",
                          labels={"_id": "Catégorie", "count": "Nombre"})
            st.plotly_chart(fig2, use_container_width=True)

# ---------------------------------------------------------------------------
# Page : Top marques
# ---------------------------------------------------------------------------
elif menu == "🏆 Top marques":
    st.subheader("Top marques par nombre de produits")
    limit = st.slider("Nombre de marques à afficher", 1, 30, 10)
    data = get("/brands/top", {"limit": limit})
    if data:
        df = pd.DataFrame(data)
        fig = px.bar(
            df, x="_id", y="count", title=f"Top {limit} marques",
            labels={"_id": "Marque", "count": "Nombre de produits"},
            color="count", color_continuous_scale="Blues",
        )
        st.plotly_chart(fig, use_container_width=True)
        st.dataframe(df)

# ---------------------------------------------------------------------------
# Page : Avis suspects
# ---------------------------------------------------------------------------
elif menu == "🚨 Avis suspects":
    st.subheader("Avis suspects (note extrême sans commentaire)")
    col_skip, col_limit = st.columns(2)
    skip  = col_skip.number_input("Sauter", min_value=0, value=0, step=10)
    limit = col_limit.number_input("Limite", min_value=1, max_value=200, value=50, step=10)
    data = get("/reviews/suspicious", {"skip": skip, "limit": limit})
    if data:
        st.warning(f"{len(data)} avis suspect(s) détecté(s)")
        st.dataframe(pd.DataFrame(data))
    else:
        st.success("Aucun avis suspect détecté.")

# ---------------------------------------------------------------------------
# Page : Produits obsolètes
# ---------------------------------------------------------------------------
elif menu == "🕰️ Produits obsolètes":
    st.subheader("Produits jamais commandés récemment")
    months = st.slider("Ancienneté minimum (mois)", 1, 24, 6)
    col_skip, col_limit = st.columns(2)
    skip  = col_skip.number_input("Sauter", min_value=0, value=0, step=10)
    limit = col_limit.number_input("Limite", min_value=1, max_value=200, value=50, step=10)
    data = get("/products/stale", {"months": months, "skip": skip, "limit": limit})
    if data:
        st.info(f"{len(data)} produit(s) sans commande depuis {months} mois")
        st.dataframe(pd.DataFrame(data)[["name", "brand", "category_name", "price", "stock"]])
    else:
        st.success("Aucun produit obsolète pour cette période.")

# ---------------------------------------------------------------------------
# Page : Historique de prix (NOUVEAU)
# ---------------------------------------------------------------------------
elif menu == "📈 Historique de prix":
    st.subheader("Historique de prix d'un produit")
    st.info("Sélectionnez un produit pour visualiser l'évolution de son prix.")

    produits = get_products_list()
    if produits:
        options = {f"{p['name']} ({p.get('brand', '')})": p["_id"] for p in produits}
        choix = st.selectbox("Produit", list(options.keys()))
        product_id = options[choix]

        if st.button("Afficher l'historique"):
            data = get(f"/products/{product_id}/price-history")
            if data:
                st.markdown(f"**{data.get('name', '')}** – Prix actuel : **{data.get('price', 'N/A')} €**")
                history = data.get("price_history", [])
                if history:
                    df_hist = pd.DataFrame(history)
                    # Conversion de la date si elle est en format dict MongoDB
                    if "date" in df_hist.columns:
                        df_hist["date"] = pd.to_datetime(df_hist["date"], errors="coerce")
                        df_hist = df_hist.sort_values("date")
                    fig = px.line(
                        df_hist, x="date", y="price",
                        title="Évolution du prix",
                        labels={"date": "Date", "price": "Prix (€)"},
                        markers=True,
                    )
                    fig.update_traces(line_color="#FF6B35", line_width=2)
                    st.plotly_chart(fig, use_container_width=True)
                    st.dataframe(df_hist)
                else:
                    st.info("Aucun historique de prix disponible pour ce produit.")
    else:
        st.warning("Impossible de charger la liste des produits.")

# ---------------------------------------------------------------------------
# Page : Produits similaires (NOUVEAU)
# ---------------------------------------------------------------------------
elif menu == "🔗 Produits similaires":
    st.subheader("Produits similaires")
    st.info("Trouve des produits de même catégorie et de prix proche (±30%).")

    produits = get_products_list()
    if produits:
        options = {f"{p['name']} ({p.get('brand', '')}) – {p.get('price', '')} €": p["_id"] for p in produits}
        choix = st.selectbox("Produit de référence", list(options.keys()))
        product_id = options[choix]
        limit = st.slider("Nombre de similaires à afficher", 1, 20, 5)

        if st.button("Trouver les similaires"):
            data = get(f"/products/{product_id}/similar", {"limit": limit})
            if data:
                st.success(f"{len(data)} produit(s) similaire(s) trouvé(s)")
                df = pd.DataFrame(data)
                cols_show = [c for c in ["name", "brand", "category_name", "price", "stock"] if c in df.columns]
                st.dataframe(df[cols_show])
            else:
                st.info("Aucun produit similaire trouvé dans la même catégorie.")
    else:
        st.warning("Impossible de charger la liste des produits.")

# ---------------------------------------------------------------------------
# Page : Produits par fournisseur (NOUVEAU)
# ---------------------------------------------------------------------------
elif menu == "🏭 Produits par fournisseur":
    st.subheader("Produits par fournisseur")

    suppliers = get_suppliers()
    if suppliers:
        options = {f"{s['name']} ({s.get('country', '')})": s["_id"] for s in suppliers}
        choix = st.selectbox("Fournisseur", list(options.keys()))
        supplier_id = options[choix]

        if st.button("Afficher les produits"):
            data = get(f"/suppliers/{supplier_id}/products")
            if data:
                df = pd.DataFrame(data)
                st.success(f"{len(data)} produit(s) fourni(s) par ce fournisseur")
                cols_show = [c for c in ["name", "brand", "category_name", "price", "stock"] if c in df.columns]
                st.dataframe(df[cols_show])

                # Graphique répartition par catégorie pour ce fournisseur
                if "category_name" in df.columns:
                    cat_counts = df["category_name"].value_counts().reset_index()
                    cat_counts.columns = ["Catégorie", "Nombre"]
                    fig = px.pie(cat_counts, names="Catégorie", values="Nombre",
                                 title=f"Répartition par catégorie – {choix.split(' (')[0]}")
                    st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("Ce fournisseur n'a aucun produit associé.")
    else:
        st.warning("Impossible de charger la liste des fournisseurs.")

# ---------------------------------------------------------------------------
# Page : Wishlist utilisateur (NOUVEAU)
# ---------------------------------------------------------------------------
elif menu == "❤️ Wishlist utilisateur":
    st.subheader("Wishlist d'un utilisateur")

    users = get_users()
    if users:
        options = {f"{u['name']} ({u.get('email', '')})": u["_id"] for u in users}
        choix = st.selectbox("Utilisateur", list(options.keys()))
        user_id = options[choix]

        if st.button("Afficher la wishlist"):
            data = get(f"/users/{user_id}/wishlist")
            if data:
                st.success(f"❤️ {len(data)} produit(s) dans la wishlist de {choix.split(' (')[0]}")
                df = pd.DataFrame(data)
                cols_show = [c for c in ["name", "brand", "category_name", "price", "stock"] if c in df.columns]
                st.dataframe(df[cols_show])

                # Valeur totale de la wishlist
                if "price" in df.columns:
                    total = df["price"].sum()
                    st.metric("💶 Valeur totale de la wishlist", f"{total:.2f} €")
            else:
                st.info("La wishlist de cet utilisateur est vide.")
    else:
        st.warning("Impossible de charger la liste des utilisateurs.")

# ---------------------------------------------------------------------------
# Page : Recherche full-text (NOUVEAU)
# ---------------------------------------------------------------------------
elif menu == "🔎 Recherche full-text":
    st.subheader("Recherche full-text")
    st.info("Recherche dans les champs **nom** et **description** des produits (index MongoDB $text).")

    q = st.text_input("Entrez votre recherche", placeholder="Ex : casque bluetooth, yoga, chocolat...")
    col_skip, col_limit = st.columns(2)
    skip  = col_skip.number_input("Sauter", min_value=0, value=0, step=10)
    limit = col_limit.number_input("Limite", min_value=1, max_value=200, value=20, step=10)

    if st.button("Rechercher"):
        if q.strip():
            data = get("/products/text-search", {"q": q, "skip": skip, "limit": limit})
            if data:
                st.success(f"{len(data)} résultat(s) pour « {q} »")
                df = pd.DataFrame(data)
                cols_show = [c for c in ["name", "brand", "category_name", "description", "price", "stock"] if c in df.columns]
                st.dataframe(df[cols_show])
            else:
                st.info(f"Aucun résultat pour « {q} ».")
        else:
            st.warning("Veuillez saisir un terme de recherche.")

# ---------------------------------------------------------------------------
# Page : Note moyenne produit (NOUVEAU)
# ---------------------------------------------------------------------------
elif menu == "⭐ Note moyenne produit":
    st.subheader("Note moyenne d'un produit")
    st.info("Calcule la note moyenne à partir de la collection **reviews** indépendante.")

    produits = get_products_list()
    if produits:
        options = {f"{p['name']} ({p.get('brand', '')})": p["_id"] for p in produits}
        choix = st.selectbox("Produit", list(options.keys()))
        product_id = options[choix]

        if st.button("Calculer la note"):
            data = get(f"/products/{product_id}/rating")
            if data:
                avg = data.get("avg_rating")
                count = data.get("count", 0)
                col1, col2 = st.columns(2)
                if avg is not None:
                    col1.metric("⭐ Note moyenne", f"{avg:.2f} / 5")
                    col2.metric("💬 Nombre d'avis", count)
                    # Barre visuelle
                    st.progress(avg / 5.0)
                else:
                    st.info("Aucun avis dans la collection reviews pour ce produit.")
    else:
        st.warning("Impossible de charger la liste des produits.")

# ---------------------------------------------------------------------------
# Page : Ajouter un produit (CRUD protégé)
# ---------------------------------------------------------------------------
elif menu == "➕ Ajouter un produit":
    st.subheader("Ajouter un nouveau produit")
    st.info("Cette action nécessite une clé API valide (header `X-API-Key`).")

    with st.form("add_product"):
        name          = st.text_input("Nom du produit")
        description   = st.text_area("Description")
        category_name = st.text_input("Catégorie")
        brand         = st.text_input("Marque")
        price         = st.number_input("Prix de vente (€)", min_value=0.0, step=0.01)
        cost_price    = st.number_input("Prix d'achat (€)", min_value=0.0, step=0.01)
        stock         = st.number_input("Quantité en stock", min_value=0, step=1)
        api_key_input = st.text_input("Clé API (X-API-Key)", type="password")
        submitted     = st.form_submit_button("Créer le produit")

        if submitted:
            if not api_key_input:
                st.error("La clé API est requise pour ajouter un produit.")
            elif not name or not category_name:
                st.error("Le nom et la catégorie sont obligatoires.")
            else:
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
                    r = requests.post(
                        f"{API_URL}/products",
                        json=payload,
                        headers={"X-API-Key": api_key_input},
                        timeout=10,
                    )
                    r.raise_for_status()
                    st.success(f"✅ Produit créé avec succès ! ID : {r.json().get('inserted_id')}")
                except requests.HTTPError as e:
                    if e.response is not None and e.response.status_code == 401:
                        st.error("❌ Clé API invalide.")
                    else:
                        st.error(f"Erreur API : {e}")
                except Exception as e:
                    st.error(f"Erreur : {e}")
