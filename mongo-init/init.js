// =============================================================================
// Script d'initialisation MongoDB - Product Catalog Management System
// Inspiré de datasets Kaggle (e-commerce product catalog)
// Exécuté automatiquement au premier démarrage du conteneur MongoDB
// =============================================================================

db = db.getSiblingDB('product_catalog');

// --- Collections ---
db.createCollection('categories');
db.createCollection('suppliers');
db.createCollection('products');
db.createCollection('reviews');
db.createCollection('users');

// --- Index pour les performances ---
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category_name: 1 });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ stock: 1 });
db.products.createIndex({ price: 1 });
db.reviews.createIndex({ product_id: 1 });
db.reviews.createIndex({ user_id: 1 });

// =============================================================================
// CATEGORIES (5 catégories principales)
// =============================================================================
var catElectronique = db.categories.insertOne({
  name: "Electronique",
  parent_category_id: null,
  description: "Appareils électroniques grand public : smartphones, écouteurs, montres connectées"
}).insertedId;

var catInformatique = db.categories.insertOne({
  name: "Informatique",
  parent_category_id: null,
  description: "Matériel informatique : ordinateurs portables, composants, périphériques"
}).insertedId;

var catMode = db.categories.insertOne({
  name: "Mode",
  parent_category_id: null,
  description: "Vêtements et accessoires de mode pour hommes et femmes"
}).insertedId;

var catAlimentaire = db.categories.insertOne({
  name: "Alimentaire",
  parent_category_id: null,
  description: "Produits alimentaires : boissons, snacks, épicerie fine"
}).insertedId;

var catSport = db.categories.insertOne({
  name: "Sport",
  parent_category_id: null,
  description: "Équipements sportifs et vêtements de sport"
}).insertedId;

// =============================================================================
// FOURNISSEURS (4 fournisseurs)
// =============================================================================
var sup1 = db.suppliers.insertOne({
  name: "TechDistrib Europe",
  contact: "contact@techdistrib.eu",
  country: "Allemagne",
  products_supplied: []
}).insertedId;

var sup2 = db.suppliers.insertOne({
  name: "ModeWholesale Paris",
  contact: "orders@modewholesale.fr",
  country: "France",
  products_supplied: []
}).insertedId;

var sup3 = db.suppliers.insertOne({
  name: "FoodImport SAS",
  contact: "import@foodimport.fr",
  country: "France",
  products_supplied: []
}).insertedId;

var sup4 = db.suppliers.insertOne({
  name: "SportEquip Ltd",
  contact: "sales@sportequip.co.uk",
  country: "Royaume-Uni",
  products_supplied: []
}).insertedId;

// =============================================================================
// UTILISATEURS (6 utilisateurs)
// =============================================================================
var user1 = db.users.insertOne({
  name: "Alice Martin",
  email: "alice.martin@example.com",
  wishlist: [],
  order_history: [],
  created_at: new Date("2024-03-15")
}).insertedId;

var user2 = db.users.insertOne({
  name: "Bob Durand",
  email: "bob.durand@example.com",
  wishlist: [],
  order_history: [],
  created_at: new Date("2024-04-20")
}).insertedId;

var user3 = db.users.insertOne({
  name: "Claire Petit",
  email: "claire.petit@example.com",
  wishlist: [],
  order_history: [],
  created_at: new Date("2024-05-10")
}).insertedId;

var user4 = db.users.insertOne({
  name: "David Leroy",
  email: "david.leroy@example.com",
  wishlist: [],
  order_history: [],
  created_at: new Date("2024-06-01")
}).insertedId;

var user5 = db.users.insertOne({
  name: "Emma Rousseau",
  email: "emma.rousseau@example.com",
  wishlist: [],
  order_history: [],
  created_at: new Date("2024-07-22")
}).insertedId;

var user6 = db.users.insertOne({
  name: "François Bernard",
  email: "francois.bernard@example.com",
  wishlist: [],
  order_history: [],
  created_at: new Date("2024-09-05")
}).insertedId;

// =============================================================================
// PRODUITS - ELECTRONIQUE (12 produits)
// =============================================================================
var p1 = db.products.insertOne({
  name: "Smartphone Galaxy S24",
  description: "Smartphone Android haut de gamme, écran AMOLED 6.7 pouces, 256 Go, appareil photo 200MP",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Samsung", price: 1099.99, cost_price: 780.0, stock: 45,
  supplier_id: sup1,
  attributes: { couleur: "Noir Phantom", stockage: "256GB", ram: "12GB", garantie: "2 ans" },
  price_history: [
    { price: 1249.99, date: new Date("2024-01-15") },
    { price: 1149.99, date: new Date("2024-04-01") },
    { price: 1099.99, date: new Date("2024-07-01") }
  ],
  reviews: [
    { rating: 5, comment: "Excellent smartphone, photos magnifiques" },
    { rating: 4, comment: "Très bon rapport qualité-prix" },
    { rating: 5, comment: "Batterie impressionnante" }
  ],
  last_ordered_at: new Date("2026-06-28"), created_at: new Date("2024-01-15")
}).insertedId;

var p2 = db.products.insertOne({
  name: "iPhone 15 Pro",
  description: "Smartphone Apple avec puce A17 Pro, écran Super Retina XDR 6.1 pouces, titanium",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Apple", price: 1299.0, cost_price: 950.0, stock: 30,
  supplier_id: sup1,
  attributes: { couleur: "Titane naturel", stockage: "128GB", garantie: "1 an" },
  price_history: [
    { price: 1329.0, date: new Date("2023-09-15") },
    { price: 1299.0, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Parfait, comme toujours" },
    { rating: 4, comment: "Cher mais excellent" }
  ],
  last_ordered_at: new Date("2026-06-25"), created_at: new Date("2023-09-15")
}).insertedId;

var p3 = db.products.insertOne({
  name: "Écouteurs Sony WH-1000XM5",
  description: "Casque sans fil à réduction de bruit active, 30h d'autonomie, qualité audio Hi-Res",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Sony", price: 329.99, cost_price: 190.0, stock: 60,
  supplier_id: sup1,
  attributes: { couleur: "Noir", connexion: "Bluetooth 5.2", autonomie: "30h" },
  price_history: [
    { price: 379.99, date: new Date("2023-06-01") },
    { price: 349.99, date: new Date("2024-01-01") },
    { price: 329.99, date: new Date("2024-06-01") }
  ],
  reviews: [
    { rating: 5, comment: "Meilleure réduction de bruit du marché" },
    { rating: 5, comment: "Superbe qualité audio" },
    { rating: 4, comment: "Confortable pour de longues sessions" }
  ],
  last_ordered_at: new Date("2026-06-30"), created_at: new Date("2023-06-01")
}).insertedId;

var p4 = db.products.insertOne({
  name: "Montre connectée Apple Watch Series 9",
  description: "Smartwatch avec capteur cardiaque, GPS, écran Retina toujours actif, étanche 50m",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Apple", price: 449.0, cost_price: 290.0, stock: 25,
  supplier_id: sup1,
  attributes: { couleur: "Minuit", taille: "45mm", garantie: "1 an" },
  price_history: [
    { price: 499.0, date: new Date("2023-09-20") },
    { price: 449.0, date: new Date("2024-02-01") }
  ],
  reviews: [
    { rating: 5, comment: "Indispensable au quotidien" },
    { rating: 4, comment: "Excellent pour le sport" }
  ],
  last_ordered_at: new Date("2026-06-20"), created_at: new Date("2023-09-20")
}).insertedId;

var p5 = db.products.insertOne({
  name: "Tablette Samsung Galaxy Tab S9",
  description: "Tablette Android 11 pouces, AMOLED, S-Pen inclus, 128 Go, WiFi 6",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Samsung", price: 799.0, cost_price: 540.0, stock: 0,
  supplier_id: sup1,
  attributes: { couleur: "Graphite", stockage: "128GB", ecran: "11 pouces AMOLED" },
  price_history: [
    { price: 899.0, date: new Date("2023-08-01") },
    { price: 849.0, date: new Date("2024-01-01") },
    { price: 799.0, date: new Date("2024-05-01") }
  ],
  reviews: [
    { rating: 4, comment: "Excellente tablette pour le travail" },
    { rating: 5, comment: "S-Pen très pratique" }
  ],
  last_ordered_at: new Date("2026-03-10"), created_at: new Date("2023-08-01")
}).insertedId;

var p6 = db.products.insertOne({
  name: "Enceinte Bluetooth JBL Charge 5",
  description: "Enceinte portable étanche IP67, 20h d'autonomie, son puissant 360°, charge USB-C",
  category_name: "Electronique", category_id: catElectronique,
  brand: "JBL", price: 189.99, cost_price: 95.0, stock: 80,
  supplier_id: sup1,
  attributes: { couleur: "Rouge", autonomie: "20h", resistance: "IP67" },
  price_history: [
    { price: 209.99, date: new Date("2023-04-01") },
    { price: 189.99, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Son incroyable pour la taille" },
    { rating: 4, comment: "Parfaite pour les sorties" }
  ],
  last_ordered_at: new Date("2026-06-29"), created_at: new Date("2023-04-01")
}).insertedId;

var p7 = db.products.insertOne({
  name: "Smartphone Xiaomi 14",
  description: "Smartphone avec objectif Leica, Snapdragon 8 Gen 3, charge rapide 90W, 5G",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Xiaomi", price: 799.99, cost_price: 520.0, stock: 35,
  supplier_id: sup1,
  attributes: { couleur: "Blanc", stockage: "512GB", ram: "12GB" },
  price_history: [
    { price: 849.99, date: new Date("2024-02-01") },
    { price: 799.99, date: new Date("2024-05-01") }
  ],
  reviews: [
    { rating: 4, comment: "Excellent rapport qualité-prix face aux flagships" },
    { rating: 5, comment: "Photos Leica bluffantes" }
  ],
  last_ordered_at: new Date("2026-06-15"), created_at: new Date("2024-02-01")
}).insertedId;

var p8 = db.products.insertOne({
  name: "AirPods Pro 2ème génération",
  description: "Écouteurs intra-auriculaires Apple, ANC adaptatif, audio spatial, boîtier MagSafe",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Apple", price: 279.0, cost_price: 160.0, stock: 50,
  supplier_id: sup1,
  attributes: { couleur: "Blanc", connexion: "Bluetooth 5.3", autonomie: "30h avec boîtier" },
  price_history: [
    { price: 299.0, date: new Date("2022-09-15") },
    { price: 279.0, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "ANC fantastique, son cristallin" },
    { rating: 4, comment: "Petit inconfort après 2h" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2022-09-15")
}).insertedId;

var p9 = db.products.insertOne({
  name: "Drone DJI Mini 4 Pro",
  description: "Drone compact 4K/60fps, stabilisation 3 axes, obstacle avoidance, autonomie 34 min",
  category_name: "Electronique", category_id: catElectronique,
  brand: "DJI", price: 759.0, cost_price: 490.0, stock: 12,
  supplier_id: sup1,
  attributes: { poids: "249g", video: "4K/60fps", autonomie: "34 min" },
  price_history: [
    { price: 799.0, date: new Date("2023-11-01") },
    { price: 759.0, date: new Date("2024-04-01") }
  ],
  reviews: [
    { rating: 5, comment: "Photos aériennes époustouflantes" },
    { rating: 4, comment: "Facile à piloter, très stable" }
  ],
  last_ordered_at: new Date("2026-05-20"), created_at: new Date("2023-11-01")
}).insertedId;

var p10 = db.products.insertOne({
  name: "Câble USB-C vers Lightning 2m",
  description: "Câble de charge rapide certifié MFi, tressé nylon, compatible iPhone/iPad",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Anker", price: 19.99, cost_price: 6.0, stock: 200,
  supplier_id: sup1,
  attributes: { longueur: "2m", certification: "MFi", materiau: "Nylon tressé" },
  price_history: [
    { price: 24.99, date: new Date("2023-01-01") },
    { price: 19.99, date: new Date("2023-09-01") }
  ],
  reviews: [
    { rating: 4, comment: "Solide et rapide" },
    { rating: 5, comment: "Parfait, rien à redire" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p11 = db.products.insertOne({
  name: "Appareil photo Sony A7 IV",
  description: "Hybride plein format 33 MP, vidéo 4K, autofocus avancé, double slot SD",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Sony", price: 2899.0, cost_price: 2100.0, stock: 8,
  supplier_id: sup1,
  attributes: { resolution: "33 MP", video: "4K/60fps", monture: "Sony E" },
  price_history: [
    { price: 3099.0, date: new Date("2021-12-01") },
    { price: 2999.0, date: new Date("2023-01-01") },
    { price: 2899.0, date: new Date("2024-06-01") }
  ],
  reviews: [
    { rating: 5, comment: "Le meilleur hybride plein format du marché" },
    { rating: 5, comment: "Images de qualité professionnelle" }
  ],
  last_ordered_at: new Date("2026-04-10"), created_at: new Date("2021-12-01")
}).insertedId;

var p12 = db.products.insertOne({
  name: "Chargeur sans fil Qi 15W",
  description: "Chargeur à induction rapide 15W, compatible MagSafe, plateau en aluminium",
  category_name: "Electronique", category_id: catElectronique,
  brand: "Belkin", price: 39.99, cost_price: 14.0, stock: 0,
  supplier_id: sup1,
  attributes: { puissance: "15W", compatibilite: "Qi / MagSafe", couleur: "Noir" },
  price_history: [
    { price: 49.99, date: new Date("2023-03-01") },
    { price: 39.99, date: new Date("2024-02-01") }
  ],
  reviews: [
    { rating: 3, comment: "Chauffe un peu trop le téléphone" },
    { rating: 4, comment: "Charge rapide, design soigné" }
  ],
  last_ordered_at: new Date("2025-11-05"), created_at: new Date("2023-03-01")
}).insertedId;

// =============================================================================
// PRODUITS - INFORMATIQUE (11 produits)
// =============================================================================
var p13 = db.products.insertOne({
  name: "MacBook Air M3 13 pouces",
  description: "Ordinateur portable Apple puce M3, 8 Go RAM, 256 Go SSD, autonomie 18h, sans ventilateur",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Apple", price: 1299.0, cost_price: 920.0, stock: 22,
  supplier_id: sup1,
  attributes: { processeur: "Apple M3", ram: "8GB", stockage: "256GB SSD", ecran: "13.6 pouces Liquid Retina" },
  price_history: [
    { price: 1399.0, date: new Date("2024-03-08") },
    { price: 1299.0, date: new Date("2024-06-01") }
  ],
  reviews: [
    { rating: 5, comment: "Léger, silencieux, performances excellentes" },
    { rating: 5, comment: "Le meilleur ultraportable du marché" },
    { rating: 4, comment: "RAM soudée limitante à long terme" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2024-03-08")
}).insertedId;

var p14 = db.products.insertOne({
  name: "Dell XPS 15 OLED",
  description: "Laptop premium Intel Core i9, RTX 4070, écran OLED 3.5K tactile, 32 Go RAM, 1 To SSD",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Dell", price: 2499.0, cost_price: 1750.0, stock: 10,
  supplier_id: sup1,
  attributes: { processeur: "Intel Core i9-13900H", ram: "32GB", gpu: "RTX 4070", stockage: "1TB SSD" },
  price_history: [
    { price: 2699.0, date: new Date("2023-05-01") },
    { price: 2499.0, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Écran OLED sublime pour la création" },
    { rating: 4, comment: "Chauffe un peu sous charge" }
  ],
  last_ordered_at: new Date("2026-06-10"), created_at: new Date("2023-05-01")
}).insertedId;

var p15 = db.products.insertOne({
  name: "Carte graphique NVIDIA RTX 4080",
  description: "GPU haut de gamme NVIDIA Ada Lovelace, 16 Go GDDR6X, ray tracing, DLSS 3",
  category_name: "Informatique", category_id: catInformatique,
  brand: "NVIDIA", price: 1199.0, cost_price: 820.0, stock: 15,
  supplier_id: sup1,
  attributes: { vram: "16GB GDDR6X", bus: "PCIe 4.0 x16", tdp: "320W" },
  price_history: [
    { price: 1399.0, date: new Date("2022-11-01") },
    { price: 1299.0, date: new Date("2023-06-01") },
    { price: 1199.0, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Performances en 4K irréprochables" },
    { rating: 4, comment: "Très chère mais la meilleure" }
  ],
  last_ordered_at: new Date("2026-05-25"), created_at: new Date("2022-11-01")
}).insertedId;

var p16 = db.products.insertOne({
  name: "Écran LG 27\" UltraWide 4K",
  description: "Moniteur 27 pouces IPS 4K HDR600, 144Hz, USB-C 96W, compatible VESA",
  category_name: "Informatique", category_id: catInformatique,
  brand: "LG", price: 699.0, cost_price: 430.0, stock: 18,
  supplier_id: sup1,
  attributes: { resolution: "3840x2160", dalle: "IPS", frequence: "144Hz", hdr: "HDR600" },
  price_history: [
    { price: 799.0, date: new Date("2023-02-01") },
    { price: 699.0, date: new Date("2024-04-01") }
  ],
  reviews: [
    { rating: 5, comment: "Couleurs parfaites pour la photo et la vidéo" },
    { rating: 4, comment: "Excellent moniteur, livraison rapide" }
  ],
  last_ordered_at: new Date("2026-06-18"), created_at: new Date("2023-02-01")
}).insertedId;

var p17 = db.products.insertOne({
  name: "Clavier mécanique Keychron Q1",
  description: "Clavier 75% aluminium anodisé, switches Gateron Pro, RGB, programmable QMK/VIA",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Keychron", price: 199.0, cost_price: 90.0, stock: 40,
  supplier_id: sup1,
  attributes: { disposition: "75%", switches: "Gateron Pro Brown", materiau: "Aluminium", retroeclairage: "RGB" },
  price_history: [
    { price: 219.0, date: new Date("2023-01-01") },
    { price: 199.0, date: new Date("2024-02-01") }
  ],
  reviews: [
    { rating: 5, comment: "Frappe exceptionnelle, build premium" },
    { rating: 5, comment: "Le meilleur clavier que j'ai jamais utilisé" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p18 = db.products.insertOne({
  name: "SSD Samsung 990 Pro 2 To",
  description: "SSD NVMe PCIe 4.0, vitesse lecture 7450 Mo/s, format M.2 2280, garantie 5 ans",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Samsung", price: 179.99, cost_price: 90.0, stock: 75,
  supplier_id: sup1,
  attributes: { capacite: "2TB", interface: "NVMe PCIe 4.0", lecture: "7450 Mo/s", format: "M.2 2280" },
  price_history: [
    { price: 229.99, date: new Date("2023-01-01") },
    { price: 199.99, date: new Date("2023-09-01") },
    { price: 179.99, date: new Date("2024-05-01") }
  ],
  reviews: [
    { rating: 5, comment: "Ultra rapide, fiable, indispensable" },
    { rating: 4, comment: "Bon produit, léger pour le budget" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p19 = db.products.insertOne({
  name: "Souris Logitech MX Master 3S",
  description: "Souris ergonomique sans fil Bluetooth, 8K DPI, scroll MagSpeed silencieux, 70j batterie",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Logitech", price: 109.99, cost_price: 55.0, stock: 60,
  supplier_id: sup1,
  attributes: { connexion: "Bluetooth / USB Receiver", dpi: "8000", autonomie: "70 jours" },
  price_history: [
    { price: 119.99, date: new Date("2022-06-01") },
    { price: 109.99, date: new Date("2023-11-01") }
  ],
  reviews: [
    { rating: 5, comment: "La souris parfaite pour le travail" },
    { rating: 4, comment: "Ergonomie exceptionnelle" }
  ],
  last_ordered_at: new Date("2026-06-28"), created_at: new Date("2022-06-01")
}).insertedId;

var p20 = db.products.insertOne({
  name: "RAM DDR5 Corsair Vengeance 32 Go",
  description: "Kit 2x16 Go DDR5 5600MHz CL36, compatible Intel et AMD, dissipateur aluminium",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Corsair", price: 119.99, cost_price: 60.0, stock: 30,
  supplier_id: sup1,
  attributes: { capacite: "32GB (2x16GB)", vitesse: "5600MHz", latence: "CL36", type: "DDR5" },
  price_history: [
    { price: 159.99, date: new Date("2023-01-01") },
    { price: 119.99, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Fonctionne parfaitement en XMP" },
    { rating: 4, comment: "Bonnes performances, prix raisonnable" }
  ],
  last_ordered_at: new Date("2026-05-30"), created_at: new Date("2023-01-01")
}).insertedId;

var p21 = db.products.insertOne({
  name: "Hub USB-C 7-en-1 Anker",
  description: "Adaptateur multiport : 4K HDMI, 2x USB-A 3.0, USB-C PD 100W, lecteur SD/microSD",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Anker", price: 49.99, cost_price: 20.0, stock: 100,
  supplier_id: sup1,
  attributes: { ports: "7 en 1", hdmi: "4K@30Hz", pd: "100W", compatibilite: "Mac/PC" },
  price_history: [
    { price: 59.99, date: new Date("2022-01-01") },
    { price: 49.99, date: new Date("2023-06-01") }
  ],
  reviews: [
    { rating: 4, comment: "Pratique, fonctionne bien" },
    { rating: 5, comment: "Essentiel avec le MacBook" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2022-01-01")
}).insertedId;

var p22 = db.products.insertOne({
  name: "Routeur WiFi 6 ASUS ROG Rapture",
  description: "Routeur gaming tri-bande WiFi 6, 11000 Mbps, couverture 250m², 8 antennes",
  category_name: "Informatique", category_id: catInformatique,
  brand: "ASUS", price: 299.0, cost_price: 170.0, stock: 20,
  supplier_id: sup1,
  attributes: { standard: "WiFi 6 (802.11ax)", debit: "11000 Mbps", couverture: "250m²" },
  price_history: [
    { price: 349.0, date: new Date("2022-06-01") },
    { price: 299.0, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Débit exceptionnel, latence minimale en gaming" },
    { rating: 4, comment: "Configuration avancée, impressionnant" }
  ],
  last_ordered_at: new Date("2026-04-20"), created_at: new Date("2022-06-01")
}).insertedId;

var p23 = db.products.insertOne({
  name: "Webcam Logitech Brio 4K",
  description: "Webcam 4K Ultra HD, HDR, autofocus, micro intégré, compatibilité Teams/Zoom",
  category_name: "Informatique", category_id: catInformatique,
  brand: "Logitech", price: 179.99, cost_price: 90.0, stock: 0,
  supplier_id: sup1,
  attributes: { resolution: "4K 30fps / 1080p 60fps", micro: "2 micros intégrés", connexion: "USB-C" },
  price_history: [
    { price: 219.99, date: new Date("2021-01-01") },
    { price: 179.99, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 4, comment: "Image excellente pour le télétravail" },
    { rating: 5, comment: "" }
  ],
  last_ordered_at: new Date("2025-12-15"), created_at: new Date("2021-01-01")
}).insertedId;

// =============================================================================
// PRODUITS - MODE (12 produits)
// =============================================================================
var p24 = db.products.insertOne({
  name: "Veste en cuir végétal homme",
  description: "Veste biker cuir végétal, doublure satin, coupe slim, fermetures éclair inox",
  category_name: "Mode", category_id: catMode,
  brand: "UrbanStyle", price: 189.99, cost_price: 70.0, stock: 35,
  supplier_id: sup2,
  attributes: { taille: "M", couleur: "Noir", matiere: "Cuir végétal", genre: "Homme" },
  price_history: [
    { price: 219.99, date: new Date("2023-09-01") },
    { price: 189.99, date: new Date("2024-01-15") }
  ],
  reviews: [
    { rating: 4, comment: "Belle finition, taille correctement" },
    { rating: 5, comment: "Parfaite, livraison rapide" },
    { rating: 1, comment: "" }
  ],
  last_ordered_at: new Date("2026-06-01"), created_at: new Date("2023-09-01")
}).insertedId;

var p25 = db.products.insertOne({
  name: "Sneakers Nike Air Max 270",
  description: "Baskets lifestyle Nike avec amorti Air Max 270, tige mesh respirante, semelle caoutchouc",
  category_name: "Mode", category_id: catMode,
  brand: "Nike", price: 149.99, cost_price: 65.0, stock: 55,
  supplier_id: sup2,
  attributes: { taille: "42", couleur: "Blanc/Noir", genre: "Unisexe", pointure: "EU 36-48" },
  price_history: [
    { price: 169.99, date: new Date("2022-06-01") },
    { price: 149.99, date: new Date("2023-11-01") }
  ],
  reviews: [
    { rating: 5, comment: "Très confortables au quotidien" },
    { rating: 4, comment: "Style intemporel, qualité Nike" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2022-06-01")
}).insertedId;

var p26 = db.products.insertOne({
  name: "Manteau laine cachemire femme",
  description: "Long manteau en laine et cachemire, coupe évasée, doublure soie, boutons nacre",
  category_name: "Mode", category_id: catMode,
  brand: "Elégance Paris", price: 349.0, cost_price: 120.0, stock: 15,
  supplier_id: sup2,
  attributes: { taille: "S", couleur: "Camel", matiere: "70% laine, 30% cachemire", genre: "Femme" },
  price_history: [
    { price: 399.0, date: new Date("2023-10-01") },
    { price: 349.0, date: new Date("2024-01-15") }
  ],
  reviews: [
    { rating: 5, comment: "Luxueux, chaud et élégant" },
    { rating: 5, comment: "La qualité se ressent immédiatement" }
  ],
  last_ordered_at: new Date("2026-03-20"), created_at: new Date("2023-10-01")
}).insertedId;

var p27 = db.products.insertOne({
  name: "Jean slim Levi's 511",
  description: "Jean slim fit 5 poches, denim stretch 11 oz, coupe étroite de la hanche à la cheville",
  category_name: "Mode", category_id: catMode,
  brand: "Levi's", price: 99.99, cost_price: 40.0, stock: 70,
  supplier_id: sup2,
  attributes: { taille: "32/32", couleur: "Indigo foncé", matiere: "98% coton, 2% élasthanne", genre: "Homme" },
  price_history: [
    { price: 109.99, date: new Date("2022-01-01") },
    { price: 99.99, date: new Date("2023-09-01") }
  ],
  reviews: [
    { rating: 4, comment: "Coupe parfaite, très confortable" },
    { rating: 5, comment: "Mon jean préféré depuis des années" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2022-01-01")
}).insertedId;

var p28 = db.products.insertOne({
  name: "Sac à main cuir Longchamp Le Pliage",
  description: "Sac cabas pliable en nylon et cuir, format M, anses longues, fermeture bouton pression",
  category_name: "Mode", category_id: catMode,
  brand: "Longchamp", price: 165.0, cost_price: 65.0, stock: 28,
  supplier_id: sup2,
  attributes: { couleur: "Marine", format: "M", matiere: "Nylon / Cuir", genre: "Femme" },
  price_history: [
    { price: 175.0, date: new Date("2022-06-01") },
    { price: 165.0, date: new Date("2024-02-01") }
  ],
  reviews: [
    { rating: 5, comment: "Iconique et pratique" },
    { rating: 4, comment: "Belle qualité, taille idéale" }
  ],
  last_ordered_at: new Date("2026-06-25"), created_at: new Date("2022-06-01")
}).insertedId;

var p29 = db.products.insertOne({
  name: "Montre Tissot PRX Powermatic 80",
  description: "Montre automatique bracelet acier, verre saphir, 80h réserve de marche, étanche 100m",
  category_name: "Mode", category_id: catMode,
  brand: "Tissot", price: 695.0, cost_price: 350.0, stock: 10,
  supplier_id: sup2,
  attributes: { mouvement: "Automatique ETA 2824", boitier: "40mm", etancheite: "100m", matiere: "Acier inoxydable" },
  price_history: [
    { price: 745.0, date: new Date("2023-01-01") },
    { price: 695.0, date: new Date("2024-05-01") }
  ],
  reviews: [
    { rating: 5, comment: "Rapport qualité-prix imbattable" },
    { rating: 5, comment: "Très belle montre, fini impeccable" }
  ],
  last_ordered_at: new Date("2026-05-15"), created_at: new Date("2023-01-01")
}).insertedId;

var p30 = db.products.insertOne({
  name: "Robe de soirée Zara Collection",
  description: "Robe longue satinée, bretelles fines, col en V, fermeture invisible dos, coupe ajustée",
  category_name: "Mode", category_id: catMode,
  brand: "Zara", price: 79.99, cost_price: 22.0, stock: 20,
  supplier_id: sup2,
  attributes: { taille: "S", couleur: "Bordeaux", matiere: "Polyester satiné", genre: "Femme" },
  price_history: [
    { price: 89.99, date: new Date("2023-11-01") },
    { price: 79.99, date: new Date("2024-01-15") }
  ],
  reviews: [
    { rating: 4, comment: "Très élégante, taille conformément à la description" },
    { rating: 3, comment: "Tissu un peu fin" }
  ],
  last_ordered_at: new Date("2026-04-10"), created_at: new Date("2023-11-01")
}).insertedId;

var p31 = db.products.insertOne({
  name: "Lunettes de soleil Ray-Ban Aviator",
  description: "Lunettes aviateur classiques, verres G-15, monture métal dorée, protection UV400",
  category_name: "Mode", category_id: catMode,
  brand: "Ray-Ban", price: 179.0, cost_price: 65.0, stock: 40,
  supplier_id: sup2,
  attributes: { modele: "RB3025", couleur: "Or / Vert G-15", protection: "UV400", taille: "58mm" },
  price_history: [
    { price: 199.0, date: new Date("2022-06-01") },
    { price: 179.0, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Un classique indémodable" },
    { rating: 4, comment: "Solide et stylé" }
  ],
  last_ordered_at: new Date("2026-06-20"), created_at: new Date("2022-06-01")
}).insertedId;

var p32 = db.products.insertOne({
  name: "T-shirt coton bio Patagonia",
  description: "T-shirt 100% coton biologique certifié GOTS, coupe relaxed, sérigraphie",
  category_name: "Mode", category_id: catMode,
  brand: "Patagonia", price: 49.99, cost_price: 18.0, stock: 90,
  supplier_id: sup2,
  attributes: { taille: "L", couleur: "Blanc cassé", matiere: "100% coton bio GOTS", genre: "Unisexe" },
  price_history: [
    { price: 54.99, date: new Date("2023-04-01") },
    { price: 49.99, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Super qualité, engagement éco appréciable" },
    { rating: 4, comment: "Confortable, coupe sympa" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-04-01")
}).insertedId;

var p33 = db.products.insertOne({
  name: "Chaussures de ville Oxford homme",
  description: "Derby cuir pleine fleur, semelle Goodyear welt, doublure cuir, fabriqué en Espagne",
  category_name: "Mode", category_id: catMode,
  brand: "Carmina", price: 299.0, cost_price: 120.0, stock: 12,
  supplier_id: sup2,
  attributes: { taille: "43", couleur: "Marron fauve", matiere: "Cuir pleine fleur", construction: "Goodyear welt" },
  price_history: [
    { price: 329.0, date: new Date("2023-09-01") },
    { price: 299.0, date: new Date("2024-06-01") }
  ],
  reviews: [
    { rating: 5, comment: "Exceptionnelle qualité, durables" },
    { rating: 5, comment: "Les meilleures chaussures que j'ai portées" }
  ],
  last_ordered_at: new Date("2026-05-01"), created_at: new Date("2023-09-01")
}).insertedId;

var p34 = db.products.insertOne({
  name: "Écharpe Merino 180x30cm",
  description: "Écharpe en pure laine mérinos, 180x30cm, ultra-douce, anti-peluche, lavable machine 30°",
  category_name: "Mode", category_id: catMode,
  brand: "Le Slip Français", price: 59.99, cost_price: 20.0, stock: 0,
  supplier_id: sup2,
  attributes: { couleur: "Bleu marine", matiere: "100% laine mérinos", dimensions: "180x30cm" },
  price_history: [
    { price: 69.99, date: new Date("2023-10-01") },
    { price: 59.99, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 4, comment: "Douce et chaude, parfaite pour l'hiver" },
    { rating: 5, comment: "" }
  ],
  last_ordered_at: new Date("2026-02-15"), created_at: new Date("2023-10-01")
}).insertedId;

var p35 = db.products.insertOne({
  name: "Ceinture cuir artisanale 3cm",
  description: "Ceinture tannage végétal, boucle laiton, 3cm de large, fabriquée à la main en France",
  category_name: "Mode", category_id: catMode,
  brand: "UrbanStyle", price: 79.0, cost_price: 28.0, stock: 25,
  supplier_id: sup2,
  attributes: { taille: "90cm", couleur: "Cognac", matiere: "Cuir tannage végétal", largeur: "3cm" },
  price_history: [
    { price: 89.0, date: new Date("2023-06-01") },
    { price: 79.0, date: new Date("2024-04-01") }
  ],
  reviews: [
    { rating: 5, comment: "Superbe artisanat, durée de vie inégalée" },
    { rating: 4, comment: "Belle qualité, bon look" }
  ],
  last_ordered_at: new Date("2026-06-10"), created_at: new Date("2023-06-01")
}).insertedId;

// =============================================================================
// PRODUITS - ALIMENTAIRE (10 produits)
// =============================================================================
var p36 = db.products.insertOne({
  name: "Café Colombia Supremo 1kg",
  description: "Café arabica 100% Colombie, torréfaction artisanale moyenne, notes de chocolat et caramel",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Terres de Café", price: 34.90, cost_price: 14.0, stock: 150,
  supplier_id: sup3,
  attributes: { origine: "Colombie", torrefaction: "Moyenne", notes: "Chocolat, caramel, noisette", poids: "1kg" },
  price_history: [
    { price: 38.90, date: new Date("2023-09-01") },
    { price: 34.90, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Arômes exceptionnels, café de qualité" },
    { rating: 5, comment: "Je ne bois plus que celui-ci" },
    { rating: 4, comment: "Très bon mais un peu cher" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-09-01")
}).insertedId;

var p37 = db.products.insertOne({
  name: "Huile d'olive extra vierge 750ml",
  description: "Huile première pression à froid, AOP Vallée des Baux-de-Provence, acide oléique <0.5%",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Moulin de la Villette", price: 22.50, cost_price: 9.0, stock: 80,
  supplier_id: sup3,
  attributes: { origine: "Provence, France", acidite: "<0.5%", contenance: "750ml", certification: "AOP" },
  price_history: [
    { price: 25.50, date: new Date("2023-11-01") },
    { price: 22.50, date: new Date("2024-04-01") }
  ],
  reviews: [
    { rating: 5, comment: "Fruité, équilibré, parfait pour la cuisine provençale" },
    { rating: 4, comment: "Très bonne huile, goût intense" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-11-01")
}).insertedId;

var p38 = db.products.insertOne({
  name: "Chocolat noir 72% Grand Cru",
  description: "Tablette chocolat noir 72% cacao, origine Pérou, notes de fruits rouges, sans huile palme",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Valrhona", price: 8.90, cost_price: 3.5, stock: 200,
  supplier_id: sup3,
  attributes: { cacao: "72%", origine: "Pérou", poids: "100g", certification: "Fair Trade" },
  price_history: [
    { price: 9.90, date: new Date("2023-01-01") },
    { price: 8.90, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Le meilleur chocolat que j'ai goûté" },
    { rating: 4, comment: "Intense, légèrement amer, parfait" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p39 = db.products.insertOne({
  name: "Miel de manuka MGO 400+ 250g",
  description: "Miel de manuka authentique Nouvelle-Zélande, certifié MGO 400+, pot en verre",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Comvita", price: 49.90, cost_price: 22.0, stock: 40,
  supplier_id: sup3,
  attributes: { origine: "Nouvelle-Zélande", certification: "MGO 400+", poids: "250g", contenant: "Verre" },
  price_history: [
    { price: 54.90, date: new Date("2023-06-01") },
    { price: 49.90, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Goût unique, bienfaits reconnus" },
    { rating: 4, comment: "Cher mais authentique" }
  ],
  last_ordered_at: new Date("2026-06-20"), created_at: new Date("2023-06-01")
}).insertedId;

var p40 = db.products.insertOne({
  name: "Thé vert Sencha Japon 100g",
  description: "Thé vert japonais premium, récolte 1ère flush, région de Shizuoka, saveur umami douce",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Palais des Thés", price: 18.50, cost_price: 7.0, stock: 0,
  supplier_id: sup3,
  attributes: { origine: "Shizuoka, Japon", type: "Sencha", recolte: "Première flush", poids: "100g" },
  price_history: [
    { price: 21.50, date: new Date("2023-05-01") },
    { price: 18.50, date: new Date("2024-02-01") }
  ],
  reviews: [
    { rating: 5, comment: "Saveur délicate et fraîche, excellent" },
    { rating: 4, comment: "Belle qualité, juste infusé" }
  ],
  last_ordered_at: new Date("2025-10-01"), created_at: new Date("2023-05-01")
}).insertedId;

var p41 = db.products.insertOne({
  name: "Pâtes artisanales Rustichella 500g",
  description: "Spaghetti artisanaux bronze-filés, blé dur sémoule fine, séchage lent 60h, Abruzzes",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Rustichella d'Abruzzo", price: 6.90, cost_price: 2.5, stock: 300,
  supplier_id: sup3,
  attributes: { type: "Spaghetti", origine: "Abruzzes, Italie", poids: "500g", sechage: "60h" },
  price_history: [
    { price: 7.90, date: new Date("2023-01-01") },
    { price: 6.90, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Cuisson parfaite, texture al dente incomparable" },
    { rating: 5, comment: "Les meilleures pâtes du marché" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p42 = db.products.insertOne({
  name: "Sauce soja Kikkoman 500ml",
  description: "Sauce soja naturellement fermentée, recette traditionnelle japonaise sans conservateurs",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Kikkoman", price: 5.99, cost_price: 2.0, stock: 250,
  supplier_id: sup3,
  attributes: { origine: "Japon", contenance: "500ml", fermentation: "Naturelle", conservation: "Sans conservateur" },
  price_history: [{ price: 5.99, date: new Date("2023-01-01") }],
  reviews: [
    { rating: 5, comment: "La référence incontournable" },
    { rating: 4, comment: "Goût authentique, très bon" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p43 = db.products.insertOne({
  name: "Riz basmati vieilli 5kg",
  description: "Riz basmati extra long vieilli 2 ans, Himalaya, grains longs et parfumés",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Tilda", price: 16.90, cost_price: 6.5, stock: 120,
  supplier_id: sup3,
  attributes: { origine: "Himalaya", vieillissement: "2 ans", poids: "5kg", type: "Basmati extra long" },
  price_history: [
    { price: 18.90, date: new Date("2023-06-01") },
    { price: 16.90, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Grains parfumés, ne colle pas" },
    { rating: 4, comment: "Excellent riz, qualité constante" }
  ],
  last_ordered_at: new Date("2026-06-28"), created_at: new Date("2023-06-01")
}).insertedId;

var p44 = db.products.insertOne({
  name: "Vinaigrette Balsamic Modena IGP",
  description: "Vinaigre balsamique de Modène IGP, vieilli 3 ans, densité élevée, arômes concentrés",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Leonardi", price: 14.90, cost_price: 5.5, stock: 0,
  supplier_id: sup3,
  attributes: { origine: "Modène, Italie", vieillissement: "3 ans", certification: "IGP", contenance: "250ml" },
  price_history: [
    { price: 16.90, date: new Date("2023-09-01") },
    { price: 14.90, date: new Date("2024-06-01") }
  ],
  reviews: [
    { rating: 1, comment: "" },
    { rating: 5, comment: "Extraordinaire avec la mozzarella" }
  ],
  last_ordered_at: new Date("2025-09-15"), created_at: new Date("2023-09-01")
}).insertedId;

var p45 = db.products.insertOne({
  name: "Pistaches grillées salées 500g",
  description: "Pistaches de Bronte Sicile DOP, grillées et légèrement salées, sachet refermable",
  category_name: "Alimentaire", category_id: catAlimentaire,
  brand: "Terre Exotique", price: 12.90, cost_price: 5.0, stock: 180,
  supplier_id: sup3,
  attributes: { origine: "Bronte, Sicile", certification: "DOP", poids: "500g", conditionnement: "Sachet refermable" },
  price_history: [
    { price: 14.90, date: new Date("2023-06-01") },
    { price: 12.90, date: new Date("2024-02-01") }
  ],
  reviews: [
    { rating: 5, comment: "Les meilleures pistaches que j'ai mangées" },
    { rating: 4, comment: "Excellentes, juste assez salées" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-06-01")
}).insertedId;

// =============================================================================
// PRODUITS - SPORT (10 produits)
// =============================================================================
var p46 = db.products.insertOne({
  name: "Tapis de yoga antidérapant 6mm",
  description: "Tapis yoga TPE double couche 6mm, antidérapant, marquages alignement, sac de transport inclus",
  category_name: "Sport", category_id: catSport,
  brand: "Gaiam", price: 59.99, cost_price: 22.0, stock: 45,
  supplier_id: sup4,
  attributes: { matiere: "TPE", epaisseur: "6mm", dimensions: "183x61cm", couleur: "Violet" },
  price_history: [
    { price: 69.99, date: new Date("2023-01-01") },
    { price: 59.99, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Antidérapant même en transpiration" },
    { rating: 4, comment: "Bonne épaisseur, confortable" }
  ],
  last_ordered_at: new Date("2026-06-28"), created_at: new Date("2023-01-01")
}).insertedId;

var p47 = db.products.insertOne({
  name: "Vélo de route Trek Émonda SL5",
  description: "Vélo carbone Alpha SL, groupe Shimano 105 12v, freins disque hydraulique, poids 7.8kg",
  category_name: "Sport", category_id: catSport,
  brand: "Trek", price: 2999.0, cost_price: 1900.0, stock: 5,
  supplier_id: sup4,
  attributes: { cadre: "Carbone Alpha SL", groupe: "Shimano 105 12v", taille: "56cm", poids: "7.8kg" },
  price_history: [
    { price: 3199.0, date: new Date("2023-03-01") },
    { price: 2999.0, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Légèreté et rigidité remarquables" },
    { rating: 5, comment: "Un vrai plaisir à monter" }
  ],
  last_ordered_at: new Date("2026-04-15"), created_at: new Date("2023-03-01")
}).insertedId;

var p48 = db.products.insertOne({
  name: "Kettlebell fonte 16kg",
  description: "Kettlebell en fonte solide, surface texturée antidérapante, base plate, finition epoxy",
  category_name: "Sport", category_id: catSport,
  brand: "Rogue Fitness", price: 79.0, cost_price: 35.0, stock: 0,
  supplier_id: sup4,
  attributes: { poids: "16kg", matiere: "Fonte", finition: "Epoxy noir", couleur: "Noir" },
  price_history: [
    { price: 89.0, date: new Date("2022-06-01") },
    { price: 79.0, date: new Date("2023-09-01") }
  ],
  reviews: [
    { rating: 5, comment: "Robuste, finition parfaite" },
    { rating: 4, comment: "Très bon kettlebell, conforme" }
  ],
  last_ordered_at: new Date("2025-12-20"), created_at: new Date("2022-06-01")
}).insertedId;

var p49 = db.products.insertOne({
  name: "Chaussures trail running Salomon Speedcross 6",
  description: "Chaussures trail agressives, crampons Chevron, Quicklace, protection Mudguard, drop 10mm",
  category_name: "Sport", category_id: catSport,
  brand: "Salomon", price: 139.99, cost_price: 70.0, stock: 30,
  supplier_id: sup4,
  attributes: { taille: "42", couleur: "Noir/Rouge", drop: "10mm", tige: "EnergyCell+" },
  price_history: [
    { price: 149.99, date: new Date("2023-09-01") },
    { price: 139.99, date: new Date("2024-05-01") }
  ],
  reviews: [
    { rating: 5, comment: "Grip exceptionnel sur tous terrains" },
    { rating: 4, comment: "Très bonnes chaussures de trail" }
  ],
  last_ordered_at: new Date("2026-06-10"), created_at: new Date("2023-09-01")
}).insertedId;

var p50 = db.products.insertOne({
  name: "Corde à sauter Crossfit vitesse",
  description: "Corde acier câble 3mm réglable, roulements à billes, poignées aluminium, 300 sauts/min",
  category_name: "Sport", category_id: catSport,
  brand: "WOD Nation", price: 34.99, cost_price: 10.0, stock: 80,
  supplier_id: sup4,
  attributes: { longueur: "Réglable 2.4-3m", cable: "Acier 3mm", roulements: "Billes double" },
  price_history: [
    { price: 39.99, date: new Date("2023-01-01") },
    { price: 34.99, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 5, comment: "Parfaite pour les double-unders" },
    { rating: 4, comment: "Très rapide, légère" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p51 = db.products.insertOne({
  name: "Sac à dos randonnée Osprey 45L",
  description: "Sac à dos randonnée 45L avec système AirScape, bretelles ergonomiques, poche hydratation",
  category_name: "Sport", category_id: catSport,
  brand: "Osprey", price: 249.0, cost_price: 110.0, stock: 18,
  supplier_id: sup4,
  attributes: { capacite: "45L", poids: "1.4kg", couleur: "Vert forêt", systeme_dos: "AirScape" },
  price_history: [
    { price: 269.0, date: new Date("2023-04-01") },
    { price: 249.0, date: new Date("2024-03-01") }
  ],
  reviews: [
    { rating: 5, comment: "Parfait pour les sorties de plusieurs jours" },
    { rating: 5, comment: "Confort incomparable sur longue distance" }
  ],
  last_ordered_at: new Date("2026-05-20"), created_at: new Date("2023-04-01")
}).insertedId;

var p52 = db.products.insertOne({
  name: "Maillot cyclisme Castelli Perfetto",
  description: "Maillot jersey professionnel imperméable léger, coupe aérodynamique, poche dorsale 3 compartiments",
  category_name: "Sport", category_id: catSport,
  brand: "Castelli", price: 189.0, cost_price: 75.0, stock: 22,
  supplier_id: sup4,
  attributes: { taille: "L", couleur: "Noir", impermeabilite: "Oui", genre: "Homme" },
  price_history: [
    { price: 209.0, date: new Date("2023-05-01") },
    { price: 189.0, date: new Date("2024-04-01") }
  ],
  reviews: [
    { rating: 4, comment: "Léger et coupe-vent efficace" },
    { rating: 5, comment: "Le maillot parfait pour l'été" }
  ],
  last_ordered_at: new Date("2026-06-05"), created_at: new Date("2023-05-01")
}).insertedId;

var p53 = db.products.insertOne({
  name: "Bandes de résistance ensemble 5 niveaux",
  description: "Set 5 bandes latex résistance progressive (5-55kg), poignées incluses, sac de rangement",
  category_name: "Sport", category_id: catSport,
  brand: "Fit Simplify", price: 29.99, cost_price: 8.0, stock: 120,
  supplier_id: sup4,
  attributes: { niveaux: "5 (S/M/L/XL/XXL)", resistance: "5 à 55kg", materiau: "Latex naturel" },
  price_history: [
    { price: 34.99, date: new Date("2023-01-01") },
    { price: 29.99, date: new Date("2024-01-01") }
  ],
  reviews: [
    { rating: 4, comment: "Bon rapport qualité-prix pour la maison" },
    { rating: 5, comment: "Polyvalentes, idéales pour la rééducation" }
  ],
  last_ordered_at: new Date("2026-07-01"), created_at: new Date("2023-01-01")
}).insertedId;

var p54 = db.products.insertOne({
  name: "Montre GPS Garmin Forerunner 265",
  description: "Montre running GPS, écran AMOLED, VO2max, récupération intelligente, 15j autonomie GPS",
  category_name: "Sport", category_id: catSport,
  brand: "Garmin", price: 449.99, cost_price: 260.0, stock: 20,
  supplier_id: sup4,
  attributes: { ecran: "AMOLED 1.3 pouces", gps: "GPS+GLONASS", autonomie: "15 jours GPS", waterproof: "5 ATM" },
  price_history: [
    { price: 499.99, date: new Date("2023-01-05") },
    { price: 449.99, date: new Date("2024-04-01") }
  ],
  reviews: [
    { rating: 5, comment: "La meilleure montre course à pied" },
    { rating: 4, comment: "Données précises, interface intuitive" }
  ],
  last_ordered_at: new Date("2026-06-25"), created_at: new Date("2023-01-05")
}).insertedId;

var p55 = db.products.insertOne({
  name: "Gants de boxe cuir 14oz",
  description: "Gants de boxe entraînement cuir véritable 14oz, rembourrage triple densité, scratch velcro",
  category_name: "Sport", category_id: catSport,
  brand: "Cleto Reyes", price: 149.0, cost_price: 60.0, stock: 15,
  supplier_id: sup4,
  attributes: { poids: "14oz", matiere: "Cuir véritable", fermeture: "Velcro scratch", couleur: "Rouge/Noir" },
  price_history: [
    { price: 169.0, date: new Date("2023-03-01") },
    { price: 149.0, date: new Date("2024-05-01") }
  ],
  reviews: [
    { rating: 5, comment: "Cuir de grande qualité, très résistants" },
    { rating: 4, comment: "Excellents gants, nécessitent un rodage" }
  ],
  last_ordered_at: new Date("2026-05-10"), created_at: new Date("2023-03-01")
}).insertedId;

// =============================================================================
// MISE À JOUR DES FOURNISSEURS
// =============================================================================
db.suppliers.updateOne({ _id: sup1 }, { $set: { products_supplied: [
  p1.toString(), p2.toString(), p3.toString(), p4.toString(), p5.toString(),
  p6.toString(), p7.toString(), p8.toString(), p9.toString(), p10.toString(),
  p11.toString(), p12.toString(), p13.toString(), p14.toString(), p15.toString(),
  p16.toString(), p17.toString(), p18.toString(), p19.toString(), p20.toString(),
  p21.toString(), p22.toString(), p23.toString()
] } });
db.suppliers.updateOne({ _id: sup2 }, { $set: { products_supplied: [
  p24.toString(), p25.toString(), p26.toString(), p27.toString(), p28.toString(),
  p29.toString(), p30.toString(), p31.toString(), p32.toString(), p33.toString(),
  p34.toString(), p35.toString()
] } });
db.suppliers.updateOne({ _id: sup3 }, { $set: { products_supplied: [
  p36.toString(), p37.toString(), p38.toString(), p39.toString(), p40.toString(),
  p41.toString(), p42.toString(), p43.toString(), p44.toString(), p45.toString()
] } });
db.suppliers.updateOne({ _id: sup4 }, { $set: { products_supplied: [
  p46.toString(), p47.toString(), p48.toString(), p49.toString(), p50.toString(),
  p51.toString(), p52.toString(), p53.toString(), p54.toString(), p55.toString()
] } });

// =============================================================================
// REVIEWS INDEPENDANTES (collection séparée)
// =============================================================================
db.reviews.insertMany([
  { product_id: p1.toString(), user_id: user1.toString(), rating: 5, comment: "Excellent smartphone, photos magnifiques", date: new Date("2026-02-01") },
  { product_id: p1.toString(), user_id: user2.toString(), rating: 4, comment: "Très bon rapport qualité-prix", date: new Date("2026-02-10") },
  { product_id: p2.toString(), user_id: user3.toString(), rating: 5, comment: "Parfait, comme toujours", date: new Date("2026-01-15") },
  { product_id: p3.toString(), user_id: user1.toString(), rating: 5, comment: "Meilleure réduction de bruit du marché", date: new Date("2026-03-05") },
  { product_id: p4.toString(), user_id: user2.toString(), rating: 5, comment: "Indispensable au quotidien", date: new Date("2026-04-10") },
  { product_id: p5.toString(), user_id: user4.toString(), rating: 4, comment: "Excellente tablette pour le travail", date: new Date("2026-01-20") },
  { product_id: p6.toString(), user_id: user5.toString(), rating: 5, comment: "Son incroyable pour la taille", date: new Date("2026-05-01") },
  { product_id: p13.toString(), user_id: user1.toString(), rating: 5, comment: "Léger, silencieux, performances excellentes", date: new Date("2026-04-15") },
  { product_id: p13.toString(), user_id: user3.toString(), rating: 5, comment: "Le meilleur ultraportable du marché", date: new Date("2026-05-20") },
  { product_id: p17.toString(), user_id: user4.toString(), rating: 5, comment: "Frappe exceptionnelle, build premium", date: new Date("2026-03-10") },
  { product_id: p19.toString(), user_id: user6.toString(), rating: 5, comment: "La souris parfaite pour le travail", date: new Date("2026-05-01") },
  { product_id: p24.toString(), user_id: user2.toString(), rating: 4, comment: "Belle finition, taille correctement", date: new Date("2026-03-05") },
  { product_id: p24.toString(), user_id: user5.toString(), rating: 1, comment: "", date: new Date("2026-03-06") },
  { product_id: p25.toString(), user_id: user3.toString(), rating: 5, comment: "Très confortables au quotidien", date: new Date("2026-04-01") },
  { product_id: p36.toString(), user_id: user1.toString(), rating: 5, comment: "Arômes exceptionnels, café de qualité", date: new Date("2026-05-10") },
  { product_id: p38.toString(), user_id: user4.toString(), rating: 5, comment: "Le meilleur chocolat que j'ai goûté", date: new Date("2026-06-01") },
  { product_id: p44.toString(), user_id: user6.toString(), rating: 1, comment: "", date: new Date("2026-01-05") },
  { product_id: p46.toString(), user_id: user5.toString(), rating: 5, comment: "Antidérapant même en transpiration", date: new Date("2026-05-15") },
  { product_id: p49.toString(), user_id: user3.toString(), rating: 5, comment: "Grip exceptionnel sur tous terrains", date: new Date("2026-06-10") },
  { product_id: p54.toString(), user_id: user2.toString(), rating: 5, comment: "La meilleure montre course à pied", date: new Date("2026-06-20") }
]);

// =============================================================================
// MISE À JOUR DES WISHLISTS UTILISATEURS
// =============================================================================
db.users.updateOne({ _id: user1 }, { $set: { wishlist: [p5.toString(), p13.toString(), p15.toString()] } });
db.users.updateOne({ _id: user2 }, { $set: { wishlist: [p2.toString(), p29.toString(), p47.toString()] } });
db.users.updateOne({ _id: user3 }, { $set: { wishlist: [p11.toString(), p26.toString()] } });
db.users.updateOne({ _id: user4 }, { $set: { wishlist: [p38.toString(), p46.toString(), p54.toString()] } });
db.users.updateOne({ _id: user5 }, { $set: { wishlist: [p25.toString(), p49.toString(), p51.toString()] } });
db.users.updateOne({ _id: user6 }, { $set: { wishlist: [p36.toString(), p37.toString()] } });

print("=============================================================");
print("Base de donnees product_catalog initialisee avec succes.");
print("55 produits répartis sur 5 catégories :");
print("  - Electronique  : 12 produits");
print("  - Informatique  : 11 produits");
print("  - Mode          : 12 produits");
print("  - Alimentaire   : 10 produits");
print("  - Sport         : 10 produits");
print("  Total           : 55 produits");
print("4 fournisseurs, 6 utilisateurs, 20 reviews independantes");
print("=============================================================");
