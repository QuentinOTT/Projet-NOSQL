// Script d'initialisation MongoDB - Product Catalog Management System
// Execute automatiquement au premier demarrage du conteneur (docker-entrypoint-initdb.d)

db = db.getSiblingDB('product_catalog');

db.createCollection('categories');
db.createCollection('suppliers');
db.createCollection('products');
db.createCollection('reviews');
db.createCollection('users');

// Index texte pour recherche full-text (besoin utilisateur #13)
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category_name: 1 });
db.products.createIndex({ brand: 1 });
db.reviews.createIndex({ product_id: 1 });

// ----- Categories -----
var catElectronique = db.categories.insertOne({ name: "Electronique", parent_category_id: null, description: "Appareils electroniques" }).insertedId;
var catInformatique = db.categories.insertOne({ name: "Informatique", parent_category_id: null, description: "Materiel informatique" }).insertedId;
var catMode = db.categories.insertOne({ name: "Mode", parent_category_id: null, description: "Vetements et accessoires" }).insertedId;

// ----- Suppliers -----
var sup1 = db.suppliers.insertOne({ name: "TechDistrib", contact: "contact@techdistrib.com", products_supplied: [] }).insertedId;
var sup2 = db.suppliers.insertOne({ name: "ModeWholesale", contact: "contact@modewholesale.com", products_supplied: [] }).insertedId;

// ----- Users -----
var user1 = db.users.insertOne({ name: "Alice Martin", email: "alice@example.com", wishlist: [], order_history: [] }).insertedId;
var user2 = db.users.insertOne({ name: "Bob Durand", email: "bob@example.com", wishlist: [], order_history: [] }).insertedId;

// ----- Products -----
var p1 = db.products.insertOne({
  name: "Smartphone Galaxy X",
  description: "Smartphone haut de gamme avec ecran AMOLED 6.5 pouces",
  category_name: "Electronique",
  category_id: catElectronique,
  brand: "Samsung",
  price: 899.99,
  cost_price: 650.0,
  stock: 25,
  supplier_id: sup1,
  attributes: { couleur: "Noir", stockage: "256GB", garantie: "2 ans" },
  reviews: [{ rating: 5, comment: "Excellent produit" }, { rating: 4, comment: "Tres bon rapport qualite prix" }],
  last_ordered_at: new Date("2026-06-15"),
  created_at: new Date("2025-01-10")
}).insertedId;

var p2 = db.products.insertOne({
  name: "Laptop UltraBook 14",
  description: "Ordinateur portable leger pour le travail et les etudes",
  category_name: "Informatique",
  category_id: catInformatique,
  brand: "Dell",
  price: 1199.0,
  cost_price: 900.0,
  stock: 0,
  supplier_id: sup1,
  attributes: { ram: "16GB", stockage: "512GB SSD", processeur: "Intel i7" },
  reviews: [{ rating: 5, comment: "" }],
  last_ordered_at: new Date("2025-11-20"),
  created_at: new Date("2025-02-05")
}).insertedId;

var p3 = db.products.insertOne({
  name: "Veste en cuir",
  description: "Veste en cuir vegetal, coupe moderne",
  category_name: "Mode",
  category_id: catMode,
  brand: "UrbanStyle",
  price: 149.99,
  cost_price: 60.0,
  stock: 40,
  supplier_id: sup2,
  attributes: { taille: "M", couleur: "Marron" },
  reviews: [{ rating: 1, comment: "" }, { rating: 4, comment: "Belle finition" }],
  last_ordered_at: new Date("2026-05-01"),
  created_at: new Date("2025-03-12")
}).insertedId;

var p4 = db.products.insertOne({
  name: "Ecouteurs sans fil Pro",
  description: "Ecouteurs bluetooth avec reduction de bruit active",
  category_name: "Electronique",
  category_id: catElectronique,
  brand: "Sony",
  price: 199.99,
  cost_price: 110.0,
  stock: 15,
  supplier_id: sup1,
  attributes: { couleur: "Blanc", autonomie: "24h" },
  reviews: [{ rating: 5, comment: "Superbe qualite audio" }],
  last_ordered_at: new Date("2026-06-28"),
  created_at: new Date("2025-04-18")
}).insertedId;

var p5 = db.products.insertOne({
  name: "Sneakers RunFast",
  description: "Chaussures de running legeres et respirantes",
  category_name: "Mode",
  category_id: catMode,
  brand: "SportMax",
  price: 89.99,
  cost_price: 35.0,
  stock: 60,
  supplier_id: sup2,
  attributes: { taille: "42", couleur: "Bleu" },
  reviews: [],
  last_ordered_at: new Date("2024-09-01"),
  created_at: new Date("2025-05-22")
}).insertedId;

// ----- Update suppliers with products_supplied -----
db.suppliers.updateOne({ _id: sup1 }, { $set: { products_supplied: [p1.toString(), p2.toString(), p4.toString()] } });
db.suppliers.updateOne({ _id: sup2 }, { $set: { products_supplied: [p3.toString(), p5.toString()] } });

// ----- Reviews collection (documents independants, lies par product_id) -----
db.reviews.insertMany([
  { product_id: p1.toString(), user_id: user1.toString(), rating: 5, comment: "Excellent produit", date: new Date("2026-02-01") },
  { product_id: p1.toString(), user_id: user2.toString(), rating: 4, comment: "Tres bon rapport qualite prix", date: new Date("2026-02-10") },
  { product_id: p2.toString(), user_id: user1.toString(), rating: 5, comment: "", date: new Date("2025-12-01") },
  { product_id: p3.toString(), user_id: user2.toString(), rating: 1, comment: "", date: new Date("2026-03-05") },
  { product_id: p3.toString(), user_id: user1.toString(), rating: 4, comment: "Belle finition", date: new Date("2026-03-06") },
  { product_id: p4.toString(), user_id: user2.toString(), rating: 5, comment: "Superbe qualite audio", date: new Date("2026-06-29") }
]);

// ----- Users wishlist -----
db.users.updateOne({ _id: user1 }, { $set: { wishlist: [p2.toString(), p4.toString()] } });
db.users.updateOne({ _id: user2 }, { $set: { wishlist: [p1.toString(), p5.toString()] } });

print("Base de donnees product_catalog initialisee avec succes.");
