# Product Catalog Management System

> Projet académique YNOV B3 – Base de données NoSQL (MongoDB)  
> Stack : **FastAPI** · **PyMongo** · **Streamlit** · **Docker Compose**

---

## 📋 Présentation

Application complète de gestion d'un catalogue produit multi-catégories, reposant sur une base MongoDB avec 5 collections interconnectées.  
L'API REST expose **18 endpoints** couvrant recherche, agrégations, CRUD et statistiques. L'interface Streamlit permet d'interroger toutes ces données de façon visuelle.

---

## 🗂️ Structure du projet

```
projet/
├── api/
│   ├── main.py            # API FastAPI (18 endpoints)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app.py             # Interface Streamlit (16 pages)
│   ├── requirements.txt
│   └── Dockerfile
├── mongo-init/
│   └── init.js            # Dataset d'initialisation (55 produits)
├── docs/
│   └── erd.md             # Diagramme entité-relation (Mermaid)
├── docker-compose.yml
└── README.md
```

---

## 🗃️ Dataset

Le fichier [`mongo-init/init.js`](mongo-init/init.js) initialise automatiquement la base de données avec un **dataset réaliste** inspiré de catalogues e-commerce Kaggle.

### Contenu du dataset

| Collection | Quantité | Détail |
|---|---|---|
| `products` | **55 produits** | Répartis sur 5 catégories |
| `categories` | 5 | Electronique, Informatique, Mode, Alimentaire, Sport |
| `suppliers` | 4 | TechDistrib, ModeWholesale, FoodImport, SportEquip |
| `users` | 6 | Avec wishlist renseignée |
| `reviews` | 20 | Avis indépendants liés par `product_id` |

### Répartition des produits

| Catégorie | Nombre | Marques représentées |
|---|---|---|
| Electronique | 12 | Samsung, Apple, Sony, JBL, Xiaomi, DJI, Anker, Belkin |
| Informatique | 11 | Apple, Dell, NVIDIA, LG, Keychron, Samsung, Logitech, Corsair, Anker, ASUS |
| Mode | 12 | UrbanStyle, Nike, Elégance Paris, Levi's, Longchamp, Tissot, Zara, Ray-Ban, Patagonia, Carmina |
| Alimentaire | 10 | Terres de Café, Valrhona, Comvita, Palais des Thés, Rustichella, Kikkoman, Tilda, Leonardi, Terre Exotique |
| Sport | 10 | Gaiam, Trek, Rogue Fitness, Salomon, WOD Nation, Osprey, Castelli, Fit Simplify, Garmin, Cleto Reyes |

Chaque produit inclut : `price_history`, `reviews` embarquées, `attributes` variables, `last_ordered_at`, `created_at`.

---

## 🚀 Lancement

### Prérequis

- Docker Desktop installé et démarré
- Git

### Premier démarrage

```bash
# Cloner le projet
git clone https://github.com/QuentinOTT/Projet-NOSQL.git
cd Projet-NOSQL

# Démarrer tous les services
docker-compose up --build
```

| Service | URL |
|---|---|
| Interface Streamlit | http://localhost:8501 |
| API FastAPI (Swagger) | http://localhost:8000/docs |
| MongoDB | localhost:27017 |

### Réinitialiser la base de données

> ⚠️ Supprime toutes les données existantes.

```bash
docker-compose down -v
docker-compose up --build
```

---

## 🔌 API – Endpoints

### Endpoints publics (GET)

| Méthode | Route | Description |
|---|---|---|
| GET | `/products` | Liste paginée de tous les produits |
| GET | `/products/search` | Recherche multi-critères (catégorie, marque, prix, stock) |
| GET | `/products/out-of-stock` | Produits en rupture de stock |
| GET | `/products/stale` | Produits sans commande depuis N mois |
| GET | `/products/top-rated` | Meilleurs produits notés par catégorie |
| GET | `/products/text-search` | Recherche full-text (index MongoDB $text) |
| GET | `/products/{id}/price-history` | Historique de prix d'un produit |
| GET | `/products/{id}/rating` | Note moyenne depuis la collection reviews |
| GET | `/products/{id}/similar` | Produits similaires (même catégorie, prix ±30%) |
| GET | `/suppliers` | Liste de tous les fournisseurs |
| GET | `/suppliers/{id}/products` | Produits d'un fournisseur |
| GET | `/users` | Liste des utilisateurs |
| GET | `/users/{id}/wishlist` | Wishlist d'un utilisateur |
| GET | `/categories/empty` | Catégories sans produit |
| GET | `/categories/avg-margin` | Marge moyenne par catégorie |
| GET | `/categories/distribution` | Répartition des produits par catégorie |
| GET | `/reviews/suspicious` | Avis suspects (note extrême sans commentaire) |
| GET | `/brands/top` | Top marques par nombre de produits |

### Endpoints protégés (authentification requise)

| Méthode | Route | Description |
|---|---|---|
| POST | `/products` | Créer un nouveau produit |
| DELETE | `/products/{id}` | Supprimer un produit |
| PUT | `/products/{id}/stock` | Mettre à jour le stock |

### Pagination

Tous les endpoints de liste acceptent les paramètres :
- `skip` (int, défaut : 0) – nombre de documents à ignorer
- `limit` (int, défaut : 50, max : 200) – nombre maximum de résultats

Exemple :
```
GET /products?skip=50&limit=25
```

---

## 🔐 Authentification par clé API

Les routes POST, DELETE et PUT requièrent un header `X-API-Key` valide.

### Configuration

La clé API est définie dans `docker-compose.yml` via la variable d'environnement `API_KEY` (valeur par défaut : `secret-api-key`).

### Utilisation avec curl

```bash
# Créer un produit
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: secret-api-key" \
  -d '{
    "name": "Nouveau produit",
    "description": "Description",
    "category_name": "Electronique",
    "brand": "MaMarque",
    "price": 99.99,
    "cost_price": 45.0,
    "stock": 10,
    "attributes": {}
  }'

# Supprimer un produit
curl -X DELETE http://localhost:8000/products/<id> \
  -H "X-API-Key: secret-api-key"

# Mettre à jour le stock
curl -X PUT "http://localhost:8000/products/<id>/stock?stock=50" \
  -H "X-API-Key: secret-api-key"
```

### Utilisation via Swagger UI

1. Ouvrir http://localhost:8000/docs
2. Cliquer sur **Authorize** (cadenas)
3. Saisir la valeur du header `X-API-Key`

### Erreur d'authentification

```json
HTTP 401
{"detail": "Clé API invalide ou manquante."}
```

---

## 🖥️ Interface Streamlit – Pages disponibles

| Page | Description |
|---|---|
| 🔍 Recherche produits | Filtres multi-critères avec pagination |
| ⚠️ Rupture de stock | Produits avec stock ≤ 0 |
| ⭐ Top produits notés | Classement par note moyenne |
| 📂 Catégories vides | Catégories sans produit associé |
| 💰 Marge moyenne / catégorie | Graphique barres de la marge moyenne |
| 📊 Répartition par catégorie | Camembert + barres de répartition |
| 🏆 Top marques | Classement des marques |
| 🚨 Avis suspects | Détection d'avis sans commentaire et notes extrêmes |
| 🕰️ Produits obsolètes | Produits non commandés depuis N mois |
| 📈 Historique de prix | Courbe d'évolution du prix d'un produit |
| 🔗 Produits similaires | Produits de même catégorie et prix proche |
| 🏭 Produits par fournisseur | Catalogue d'un fournisseur sélectionné |
| ❤️ Wishlist utilisateur | Liste de souhaits d'un utilisateur |
| 🔎 Recherche full-text | Recherche libre dans nom et description |
| ⭐ Note moyenne produit | Note moyenne calculée depuis la collection reviews |
| ➕ Ajouter un produit | Formulaire de création (clé API requise) |

---

## 🗄️ Modèle de données (ERD)

Voir [docs/erd.md](docs/erd.md) pour le diagramme entité-relation complet en syntaxe Mermaid.

### Aperçu des relations

```
products  ──── categories  (category_id)
products  ──── suppliers   (supplier_id)
reviews   ──── products    (product_id)
reviews   ──── users       (user_id)
users     ──── products    (wishlist[])
suppliers ──── products    (products_supplied[])
```

---

## 🛠️ Technologies

| Composant | Technologie | Version |
|---|---|---|
| Base de données | MongoDB | 7 |
| Backend API | FastAPI + PyMongo | 0.111 / 4.7 |
| Serveur ASGI | Uvicorn | 0.30 |
| Frontend | Streamlit | 1.35 |
| Visualisations | Plotly Express | 5.22 |
| Conteneurisation | Docker Compose | – |

---

## 👥 Équipe

Projet YNOV B3 – Base de données NoSQL  
