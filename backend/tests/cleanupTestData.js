/**
 * One-off cleanup of QA-created products/orders/users so admin analytics is not polluted.
 */
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'lumea';

async function cleanup() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db(dbName);

  const prodRes = await db.collection('products').deleteMany({ name: { $regex: /^TEST_/ } });
  console.log('products removed:', prodRes.deletedCount);

  const orders = await db.collection('orders').find({}).toArray();
  const victims = [];
  for (const o of orders) {
    const items = o.items || [];
    const email = o.user_email || '';
    if (items.length > 0 && items.every(i => String(i.name || '').startsWith('TEST_'))) {
      victims.push(o._id);
    } else if (email.startsWith('TEST_') || email.startsWith('qa_')) {
      victims.push(o._id);
    }
  }

  const orderRes = victims.length > 0
    ? await db.collection('orders').deleteMany({ _id: { $in: victims } })
    : { deletedCount: 0 };
  console.log('orders removed:', orderRes.deletedCount);

  const userRes = await db.collection('users').deleteMany({
    $or: [
      { email: { $regex: /^test_cust_/i } },
      { email: { $regex: /^test_/i } },
      { email: { $regex: /^qa_/i } }
    ],
    role: 'customer'
  });
  console.log('users removed:', userRes.deletedCount);

  const revRes = await db.collection('reviews').deleteMany({ comment: { $regex: /^TEST_/ } });
  console.log('reviews removed:', revRes.deletedCount);

  await client.close();
}

if (require.main === module) {
  cleanup().catch(console.error);
}

module.exports = cleanup;
