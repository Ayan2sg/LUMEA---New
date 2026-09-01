const { v4: uuidv4 } = require('uuid');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '../frontend/.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const base = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
const API = `${base}/api`;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'lumea';

async function main() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db(dbName);

  const email = `qa_ui_${uuidv4().slice(0, 8)}@example.com`;
  const pw = 'Test@12345';

  const regResp = await axios.post(`${API}/auth/register`, {
    name: 'QA UI Buyer',
    email,
    password: pw
  });
  const uid = regResp.data.user.id;

  const products = await db.collection('products').find({}).toArray();
  const p = products[0];
  const pid = p._id.toString();

  await db.collection('orders').insertOne({
    user_id: uid,
    user_email: email,
    user_name: 'QA UI Buyer',
    items: [{
      product_id: pid,
      name: p.name,
      price: p.price,
      quantity: 1,
      category: p.category
    }],
    subtotal: p.price,
    discount: 0,
    shipping: 0,
    total: p.price,
    coupon: null,
    address: {
      name: 'QA UI Buyer',
      line1: '1 QA St',
      city: 'Pune',
      state: 'MH',
      pincode: '411001',
      phone: '9999999999'
    },
    status: 'confirmed',
    payment_status: 'paid',
    created_at: new Date().toISOString()
  });

  console.log('EMAIL', email);
  console.log('PASSWORD', pw);
  console.log('USER_ID', uid);
  console.log('PRODUCT', pid);

  await client.close();
}

main().catch(console.error);
