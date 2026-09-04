require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const users = [
  {
    name: 'Perera Owner',
    email: 'owner@pererastores.lk',
    password: 'owner123',
    role: 'owner',
  },
  {
    name: 'Saman Staff',
    email: 'staff@pererastores.lk',
    password: 'staff123',
    role: 'staff',
  },
];

const products = [
  { name: 'Katta Sambol', category: 'Condiments', unit: 'pcs', quantity: 50, unitPrice: 85, lowStockThreshold: 10 },
  { name: 'Munchee Super Cream Cracker 200g', category: 'Biscuits', unit: 'pack', quantity: 120, unitPrice: 180, lowStockThreshold: 20 },
  { name: 'Anchor Milk Powder 400g', category: 'Dairy', unit: 'pcs', quantity: 35, unitPrice: 980, lowStockThreshold: 10 },
  { name: 'Dilmah Tea Bags 100g', category: 'Beverages', unit: 'pack', quantity: 60, unitPrice: 520, lowStockThreshold: 10 },
  { name: 'Elephant House Ginger Beer 400ml', category: 'Beverages', unit: 'bottle', quantity: 144, unitPrice: 110, lowStockThreshold: 24 },
  { name: 'Laojee Tea Dust 100g', category: 'Beverages', unit: 'pack', quantity: 80, unitPrice: 145, lowStockThreshold: 15 },
  { name: 'Maliban Cream Cracker 190g', category: 'Biscuits', unit: 'pack', quantity: 90, unitPrice: 160, lowStockThreshold: 15 },
  { name: 'Sunlight Dishwash Bar 90g', category: 'Household', unit: 'pcs', quantity: 200, unitPrice: 55, lowStockThreshold: 30 },
  { name: 'Keells Coconut Milk 200ml', category: 'Dairy', unit: 'can', quantity: 48, unitPrice: 120, lowStockThreshold: 12 },
  { name: 'Araliya Rose Rice 1kg', category: 'Staples', unit: 'kg', quantity: 100, unitPrice: 220, lowStockThreshold: 20 },
];

const seed = async () => {
  await connectDB();

  console.log('⏳ Clearing existing data...');
  await User.deleteMany({});
  await Product.deleteMany({});

  console.log('🌱 Seeding users...');
  // Use create() one-by-one so pre-save password hashing fires for each
  for (const u of users) {
    await User.create(u);
  }

  console.log('🌱 Seeding products...');
  await Product.insertMany(products);

  console.log('✅ Seed complete!');
  console.log('   owner@pererastores.lk / owner123');
  console.log('   staff@pererastores.lk / staff123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
