## Endpoints principaux de l'API

Dans le cadre du sujet, nous avons conçu une API REST permettant d'exposer des requêtes métier liées à la gestion d'un catalogue produit.  
Chaque endpoint répond à un besoin utilisateur concret, conformément à la consigne qui demande de préparer 10 à 15 requêtes métier puis de les démontrer via une API et une interface web.

### Endpoints montrés pendant la soutenance

| Méthode | Endpoint | Besoin utilisateur | Utilité métier |
|---|---|---|---|
| GET | `/products/search` | Comment trouver rapidement un produit selon plusieurs critères ? | Permet de rechercher des produits par catégorie, marque, prix et disponibilité. |
| GET | `/products/out-of-stock` | Comment identifier les produits en rupture de stock ? | Permet d'afficher immédiatement les produits indisponibles. |
| GET | `/products/top-rated` | Comment identifier les produits les mieux notés ? | Permet d'analyser la satisfaction client à partir des avis. |
| GET | `/categories/avg-margin` | Comment calculer la marge moyenne par catégorie ? | Permet d'obtenir un indicateur business par famille de produits. |
| POST | `/products` | Comment ajouter un nouveau produit dans le catalogue ? | Permet d'insérer un nouveau document produit dans MongoDB depuis le frontend. |

### Liste complète des endpoints implémentés

#### Produits
- `GET /products` : récupérer la liste des produits
- `POST /products` : ajouter un nouveau produit
- `GET /products/search` : recherche multi-critères
- `GET /products/out-of-stock` : produits en rupture de stock
- `GET /products/top-rated` : produits les mieux notés
- `GET /products/{product_id}/price-history` : historique de prix d'un produit
- `GET /products/{product_id}/similar` : produits similaires
- `GET /products/text-search?q=...` : recherche full-text sur le nom et la description
- `GET /products/{product_id}/rating` : note moyenne d'un produit
- `GET /products/stale?months=6` : produits obsolètes ou jamais commandés récemment

#### Catégories
- `GET /categories/empty` : catégories sans produit actif
- `GET /categories/distribution` : répartition des produits par catégorie
- `GET /categories/avg-margin` : marge moyenne par catégorie

#### Fournisseurs
- `GET /suppliers/{supplier_id}/products` : liste des produits d'un fournisseur

#### Avis
- `GET /reviews/suspicious` : avis suspects (par exemple note extrême sans commentaire)

#### Marques
- `GET /brands/top` : marques les plus représentées dans le catalogue

#### Utilisateurs
- `GET /users/{user_id}/wishlist` : wishlist d'un utilisateur

### Pourquoi ces endpoints sont pertinents

Ces endpoints ont été choisis car ils répondent à de vrais besoins métier d'un système de gestion de catalogue produit, et pas uniquement à des opérations techniques de type CRUD [file:1].  
Ils permettent de démontrer à la fois la flexibilité de MongoDB, l'exploitation des documents NoSQL, et la capacité de l'application à exposer ces requêtes via une API puis à les afficher dans le frontend [file:1].

### Démonstration pendant la vidéo

Pendant la soutenance, nous pouvons montrer rapidement dans le backend quelques endpoints clés, par exemple :
- `GET /products/search`
- `GET /products/out-of-stock`
- `GET /products/top-rated`
- `GET /categories/avg-margin`
- `POST /products`

Ensuite, la démonstration complète se fait depuis le frontend, où chaque action utilisateur appelle un endpoint backend correspondant et affiche le résultat directement dans l'interface [file:1].