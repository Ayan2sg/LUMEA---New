const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'lumea';

async function main() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db(dbName);

  const products = await db.collection('products').find({}, { projection: { name: 1, images: 1 } }).toArray();
  for (const p of products) {
    console.log(p._id.toString(), (p.images || []).length, p.name);
  }

  const totalOrders = await db.collection('orders').countDocuments({});
  const paidOrders = await db.collection('orders').countDocuments({ payment_status: 'paid' });
  console.log('orders:', totalOrders, 'paid:', paidOrders);

  await client.close();
}

main().catch(console.error);
