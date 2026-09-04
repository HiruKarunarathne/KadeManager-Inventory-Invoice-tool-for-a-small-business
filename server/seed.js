/**
 * seed.js — Populates Perera Stores with demo data
 * Run: npm run seed
 *
 * Creates:
 *  • 1 owner user
 *  • 1 staff user
 *  • 10 realistic Sri Lankan kade products
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const OWNER = {
  name: 'Kamal Perera',
  email: 'owner@pererastores.lk',
  password: 'owner123',
  role: 'owner',
};

const STAFF = {
  name: 'Nimali Silva',
  email: 'staff@pererastores.lk',
  password: 'staff123',
  role: 'staff',
};

const PRODUCTS = [
  { name: 'Anchor Full Cream Milk Powder 400g', category: 'Dairy', unit: 'pack', quantity: 45, unitPrice: 890, lowStockThreshold: 10 },
  { name: 'Maliban Cream Crackers 190g', category: 'Snacks', unit: 'pack', quantity: 80, unitPrice: 185, lowStockThreshold: 15 },
  { name: 'Ceylon Tea — Mlesna 100g', category: 'Beverage', unit: 'pack', quantity: 30, unitPrice: 420, lowStockThreshold: 8 },
  { name: 'Samba Rice 5kg', category: 'Grocery', unit: 'kg', quantity: 120, unitPrice: 1600, lowStockThreshold: 20 },
  { name: 'Coconut Oil 1L', category: 'Grocery', unit: 'bottle', quantity: 25, unitPrice: 680, lowStockThreshold: 5 },
  { name: 'Red Lentils (Parippu) 1kg', category: 'Grocery', unit: 'kg', quantity: 60, unitPrice: 360, lowStockThreshold: 10 },
  { name: 'Elephant House Ice Cream Soda 400ml', category: 'Beverage', unit: 'bottle', quantity: 12, unitPrice: 140, lowStockThreshold: 12 },
  { name: 'Surf Excel Detergent 1kg', category: 'Household', unit: 'pack', quantity: 20, unitPrice: 540, lowStockThreshold: 5 },
  { name: 'Astra Margarine 500g', category: 'Dairy', unit: 'pack', quantity: 8, unitPrice: 310, lowStockThreshold: 10 },
  { name: 'MD Chilli Sauce 400g', category: 'Grocery', unit: 'bottle', quantity: 35, unitPrice: 230, lowStockThreshold: 8 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing users and products');

    // Create users (passwords will be hashed by pre-save hook)
    const owner = await User.create(OWNER);
    const staff = await User.create(STAFF);
    console.log(`👤 Created owner: ${owner.email}`);
    console.log(`👤 Created staff: ${staff.email}`);

    // Create products
    const products = await Product.insertMany(PRODUCTS);
    console.log(`📦 Created ${products.length} products`);

    console.log('\n─────────────────────────────────');
    console.log('✅ Seed complete! Demo credentials:');
    console.log(`   Owner  → ${OWNER.email}  / ${OWNER.password}`);
    console.log(`   Staff  → ${STAFF.email} / ${STAFF.password}`);
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
