// seed.js — Database seeder for Perera Stores (Kade Manager)
// Creates exactly ONE owner, ONE staff user, and 10 realistic Sri Lankan kade products.
// Run with: npm run seed
//
// ⚠️  WARNING: This will wipe existing Users and Products before seeding.

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// ---------------------------------------------------------------------------
// Demo users
// ---------------------------------------------------------------------------
const users = [
  {
    name: 'Kamal Perera',
    email: 'owner@pererastores.lk',
    password: 'owner123',
    role: 'owner',
  },
  {
    name: 'Nimal Silva',
    email: 'staff@pererastores.lk',
    password: 'staff123',
    role: 'staff',
  },
];

// ---------------------------------------------------------------------------
// 10 realistic Sri Lankan kade (corner shop) products with LKR prices
// ---------------------------------------------------------------------------
const products = [
  {
    name: 'Samba Rice',
    category: 'Grocery',
    unit: 'kg',
    unitType: 'measured',
    quantity: 200,
    unitPrice: 195,
    lowStockThreshold: 20,
  },
  {
    name: 'Dhal (Red Lentils)',
    category: 'Grocery',
    unit: 'kg',
    unitType: 'measured',
    quantity: 80,
    unitPrice: 320,
    lowStockThreshold: 10,
  },
  {
    name: 'Coconut Oil',
    category: 'Grocery',
    unit: 'L',
    unitType: 'measured',
    quantity: 50,
    unitPrice: 620,
    lowStockThreshold: 10,
  },
  {
    name: 'Milo Tin (400g)',
    category: 'Beverage',
    unit: 'tin',
    unitType: 'countable',
    quantity: 25,
    unitPrice: 950,
    lowStockThreshold: 5,
  },
  {
    name: 'Laojee Tea (100 bags)',
    category: 'Beverage',
    unit: 'pack',
    unitType: 'countable',
    quantity: 60,
    unitPrice: 410,
    lowStockThreshold: 10,
  },
  {
    name: 'Anchor Milk Powder (400g)',
    category: 'Dairy',
    unit: 'pack',
    unitType: 'countable',
    quantity: 30,
    unitPrice: 1250,
    lowStockThreshold: 5,
  },
  {
    name: 'Maggi Noodles',
    category: 'Snacks',
    unit: 'pcs',
    unitType: 'countable',
    quantity: 120,
    unitPrice: 70,
    lowStockThreshold: 20,
  },
  {
    name: 'Sunlight Soap (90g)',
    category: 'Household',
    unit: 'pcs',
    unitType: 'countable',
    quantity: 50,
    unitPrice: 65,
    lowStockThreshold: 10,
  },
  {
    name: 'Sugar (White)',
    category: 'Grocery',
    unit: 'kg',
    unitType: 'measured',
    quantity: 3,           // intentionally low to demo low-stock alert
    unitPrice: 180,
    lowStockThreshold: 15,
  },
  {
    name: 'Elephant Ginger Beer (330ml)',
    category: 'Beverage',
    unit: 'bottle',
    unitType: 'countable',
    quantity: 72,
    unitPrice: 130,
    lowStockThreshold: 12,
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
const seed = async () => {
  await connectDB();

  console.log('\n🌱 Starting seed for Perera Stores...\n');

  // Wipe existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing Users and Products');

  // Create users (password hashing handled by the pre-save hook in User.js)
  const createdUsers = await User.create(users);
  console.log(`👥 Created ${createdUsers.length} users:`);
  createdUsers.forEach((u) =>
    console.log(`   • ${u.role.toUpperCase()}: ${u.email} (password: ${u.role}123)`)
  );

  // Create products
  const createdProducts = await Product.create(products);
  console.log(`\n📦 Created ${createdProducts.length} products:`);
  createdProducts.forEach((p) =>
    console.log(`   • ${p.name} — LKR ${p.unitPrice}/${p.unit} (qty: ${p.quantity})`)
  );

  console.log('\n✅ Seed complete! Perera Stores is ready to roll.\n');
  console.log('📋 Login credentials:');
  console.log('   Owner  → owner@pererastores.lk  / owner123');
  console.log('   Staff  → staff@pererastores.lk  / staff123\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
