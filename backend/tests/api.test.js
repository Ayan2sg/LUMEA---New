const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  app,
  initDatabase,
  closeDatabase,
  getDb,
  assertSafeEmail,
  emailShell,
  sendEmail
} = require('../server');

let adminToken = '';
let adminUser = null;
let customerToken = '';
let customerUser = null;
let db = null;
let mongod = null;

const adminCredentials = {
  email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase(),
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

const TEST_ADDRESS = {
  name: 'TEST_ Buyer',
  phone: '9999999999',
  line1: '1 Test St',
  city: 'Mumbai',
  state: 'MH',
  pincode: '400001'
};

beforeAll(async () => {
  let mongoUri = process.env.MONGO_URL;
  if (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
    try {
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
    } catch (e) {
      console.warn('MongoMemoryServer create warning:', e.message);
    }
  }

  await initDatabase(mongoUri, 'lumea_test');
  db = getDb();

  // Login admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send(adminCredentials);
  if (adminRes.status === 200) {
    adminToken = adminRes.body.token;
    adminUser = adminRes.body.user;
  }

  // Register and login a customer
  const custEmail = `test_main_cust_${uuidv4().slice(0, 8)}@example.com`;
  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'TEST_ Customer Main', email: custEmail, password: 'Test@12345' });
  customerToken = custRes.body.token;
  customerUser = custRes.body.user;
}, 60000);

afterAll(async () => {
  // Clean up any test users / products / orders / reviews
  if (db) {
    await db.collection('users').deleteMany({ email: { $regex: /^test_/i } });
    await db.collection('products').deleteMany({ name: { $regex: /^TEST_/ } });
    await db.collection('orders').deleteMany({ 'address.name': { $regex: /^TEST_/ } });
    await db.collection('reviews').deleteMany({ comment: { $regex: /^TEST_/ } });
  }
  await closeDatabase();
  if (mongod) {
    await mongod.stop();
  }
}, 30000);

// ---------------- Health & Root ----------------
describe('Health & Root APIs', () => {
  test('GET /api/ should return message', async () => {
    const res = await request(app).get('/api/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Lumea Store API');
  });

  test('GET /api/products should return public products list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(8);
    const p = res.body[0];
    ['id', 'name', 'price', 'category', 'stock', 'images'].forEach(k => {
      expect(p[k]).toBeDefined();
    });
    expect(p._id).toBeUndefined();
  });

  test('GET /api/categories should return categories array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(expect.arrayContaining(['Electronics', 'Fashion', 'Lifestyle']));
  });
});

// ---------------- Auth ----------------
describe('Auth APIs', () => {
  test('Admin login succeeds with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(adminCredentials);
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.role).toBe('admin');
    expect(res.body.user.email).toBe(adminCredentials.email);
  });

  test('Bcrypt hash format in DB starts with $2b$ or $2a$', async () => {
    const u = await db.collection('users').findOne({ role: 'admin' });
    expect(u).toBeDefined();
    expect(u.password_hash.startsWith('$2b$') || u.password_hash.startsWith('$2a$')).toBe(true);
  });

  test('Login fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: adminCredentials.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
    expect(res.body.detail).toBeDefined();
  });

  test('Login fails for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password' });
    expect(res.status).toBe(401);
  });

  test('Customer registration, duplicate prevention, and /me endpoint', async () => {
    const email = `test_reg_${uuidv4().slice(0, 8)}@example.com`;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'TEST_ Reg User', email, password: 'Test@12345' });
    expect(regRes.status).toBe(200);
    expect(regRes.body.user.role).toBe('customer');
    expect(regRes.body.user.email).toBe(email.toLowerCase());

    // Duplicate
    const dupRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'TEST_ Reg User', email, password: 'Test@12345' });
    expect(dupRes.status).toBe(400);

    // /me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${regRes.body.token}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(email.toLowerCase());
    expect(meRes.body.password_hash).toBeUndefined();
    expect(meRes.body._id).toBeUndefined();
  });

  test('Protected routes require valid token', async () => {
    for (const p of ['/api/auth/me', '/api/cart', '/api/wishlist', '/api/orders']) {
      const res = await request(app).get(p);
      expect(res.status).toBe(401);
    }
  });

  test('Invalid token is rejected with 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.fake.token');
    expect(res.status).toBe(401);
  });

  test('Customer cannot access admin endpoints', async () => {
    for (const p of ['/api/admin/stats', '/api/admin/orders', '/api/coupons']) {
      const res = await request(app)
        .get(p)
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    }
  });

  test('Brute force lockout after 5 consecutive failures', async () => {
    const email = `test_bf_${uuidv4().slice(0, 8)}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'TEST_ BF User', email, password: 'Test@12345' });

    for (let i = 0; i < 5; i++) {
      const r = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'wrongpassword' });
      expect(r.status).toBe(401);
    }

    // 6th attempt locked out
    const lockedRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'wrongpassword' });
    expect(lockedRes.status).toBe(429);

    // Valid password also locked out
    const validRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'Test@12345' });
    expect(validRes.status).toBe(429);

    await db.collection('login_attempts').deleteOne({ identifier: email });
  });
});

// ---------------- Product CRUD & Query ----------------
describe('Product APIs', () => {
  let createdProductId = '';

  test('Admin can create, update, and delete product', async () => {
    const payload = {
      name: 'TEST_ Widget Product',
      description: 'A test widget',
      price: 1234.5,
      category: 'Lifestyle',
      stock: 7,
      images: ['https://example.com/a.jpg'],
      featured: true,
      tags: ['test']
    };

    // Create
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);
    expect(createRes.status).toBe(200);
    expect(createRes.body.name).toBe(payload.name);
    expect(createRes.body.price).toBe(payload.price);
    expect(createRes.body.rating).toBe(0);
    expect(createRes.body.review_count).toBe(0);
    createdProductId = createRes.body.id;

    // Public Fetch
    const getRes = await request(app).get(`/api/products/${createdProductId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.stock).toBe(7);
    expect(getRes.body.reviews).toEqual([]);

    // Update
    const updateRes = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...payload, price: 999.0, stock: 3 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.price).toBe(999.0);
    expect(updateRes.body.stock).toBe(3);

    // Delete
    const delRes = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.ok).toBe(true);

    // Verify 404 after delete
    const afterDel = await request(app).get(`/api/products/${createdProductId}`);
    expect(afterDel.status).toBe(404);
  });

  test('Customer cannot create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Hack', price: 10, category: 'Lifestyle' });
    expect(res.status).toBe(403);
  });

  test('Invalid product id returns 404', async () => {
    const res = await request(app).get('/api/products/not-a-valid-id');
    expect(res.status).toBe(404);
  });

  test('Filters, search, and sort work properly', async () => {
    const catRes = await request(app).get('/api/products?category=Electronics');
    expect(catRes.status).toBe(200);
    expect(catRes.body.every(p => p.category === 'Electronics')).toBe(true);

    const featRes = await request(app).get('/api/products?featured=true');
    expect(featRes.status).toBe(200);
    expect(featRes.body.every(p => p.featured)).toBe(true);

    const searchRes = await request(app).get('/api/products?search=laptop');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.some(p => p.name.toLowerCase().includes('laptop'))).toBe(true);

    const sortAsc = await request(app).get('/api/products?sort=price_asc');
    const pricesAsc = sortAsc.body.map(p => p.price);
    const sortedAsc = [...pricesAsc].sort((a, b) => a - b);
    expect(pricesAsc).toEqual(sortedAsc);

    const sortDesc = await request(app).get('/api/products?sort=price_desc');
    const pricesDesc = sortDesc.body.map(p => p.price);
    const sortedDesc = [...pricesDesc].sort((a, b) => b - a);
    expect(pricesDesc).toEqual(sortedDesc);
  });
});

// ---------------- Cart & Wishlist ----------------
describe('Cart & Wishlist APIs', () => {
  let p1, p2;

  beforeAll(async () => {
    const res = await request(app).get('/api/products');
    p1 = res.body[0];
    p2 = res.body[1];
  });

  test('Cart add, increment, update, and delete flow', async () => {
    // Add p1 with qty 2
    let res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: p1.id, quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].quantity).toBe(2);
    expect(res.body[0].product.id).toBe(p1.id);

    // Increment same item
    res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: p1.id, quantity: 1 });
    expect(res.body[0].quantity).toBe(3);

    // Add p2
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: p2.id, quantity: 1 });

    res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.body.length).toBe(2);

    // Update quantity
    res = await request(app)
      .put('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: p1.id, quantity: 1 });
    const item1 = res.body.find(i => i.product.id === p1.id);
    expect(item1.quantity).toBe(1);

    // Delete p2
    res = await request(app)
      .delete(`/api/cart/${p2.id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.body.every(i => i.product.id !== p2.id)).toBe(true);

    // Setting quantity 0 removes item
    res = await request(app)
      .put('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: p1.id, quantity: 0 });
    expect(res.body.length).toBe(0);
  });

  test('Wishlist toggle and fetch flow', async () => {
    // Toggle ON
    let res = await request(app)
      .post(`/api/wishlist/${p1.id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.product_ids).toContain(p1.id);

    // Get wishlist
    let listRes = await request(app)
      .get('/api/wishlist')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some(p => p.id === p1.id)).toBe(true);

    // Toggle OFF
    res = await request(app)
      .post(`/api/wishlist/${p1.id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.body.product_ids).not.toContain(p1.id);

    listRes = await request(app)
      .get('/api/wishlist')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(listRes.body.length).toBe(0);
  });
});

// ---------------- Reviews ----------------
describe('Reviews APIs', () => {
  let testProd;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'TEST_ Reviewable Item',
        description: 'Test',
        price: 500,
        category: 'Lifestyle',
        stock: 10
      });
    testProd = res.body;
  });

  afterAll(async () => {
    if (testProd) {
      await request(app)
        .delete(`/api/products/${testProd.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });

  test('Non-buyer cannot review product (403)', async () => {
    const res = await request(app)
      .post(`/api/products/${testProd.id}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ rating: 5, comment: 'TEST_ nice' });
    expect(res.status).toBe(403);
    expect(res.body.detail.toLowerCase()).toContain('verified buyer');
  });

  test('Verified buyer can review product and rating averages update', async () => {
    // Seed paid order
    const orderDoc = {
      user_id: customerUser.id,
      user_email: customerUser.email,
      user_name: customerUser.name,
      items: [{
        product_id: testProd.id,
        name: testProd.name,
        price: testProd.price,
        quantity: 1,
        category: testProd.category
      }],
      subtotal: testProd.price,
      discount: 0,
      shipping: 0,
      total: testProd.price,
      coupon: null,
      address: TEST_ADDRESS,
      status: 'confirmed',
      payment_status: 'paid',
      created_at: new Date().toISOString()
    };
    const orderRes = await db.collection('orders').insertOne(orderDoc);

    // Now submit review with rating 4
    const revRes = await request(app)
      .post(`/api/products/${testProd.id}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ rating: 4, comment: 'TEST_ Great quality' });
    expect(revRes.status).toBe(200);

    // Verify rating on product
    const pRes = await request(app).get(`/api/products/${testProd.id}`);
    expect(pRes.status).toBe(200);
    expect(pRes.body.rating).toBe(4);
    expect(pRes.body.review_count).toBe(1);
    expect(pRes.body.reviews[0].comment).toBe('TEST_ Great quality');
    expect(pRes.body.reviews[0].user_id).toBeUndefined();

    // Duplicate review should fail
    const dupRev = await request(app)
      .post(`/api/products/${testProd.id}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ rating: 5, comment: 'TEST_ Duplicate' });
    expect(dupRev.status).toBe(400);

    await db.collection('orders').deleteOne({ _id: orderRes.insertedId });
  });
});

// ---------------- Coupons ----------------
describe('Coupons APIs', () => {
  test('Admin can list and create coupon', async () => {
    const listRes = await request(app)
      .get('/api/coupons')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some(c => c.code === 'WELCOME10')).toBe(true);

    const code = `TEST${uuidv4().slice(0, 5).toUpperCase()}`;
    const createRes = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ code: code.toLowerCase(), discount_percent: 15, active: true, min_amount: 100 });
    expect(createRes.status).toBe(200);
    expect(createRes.body.code).toBe(code);

    // Delete coupon
    const delRes = await request(app)
      .delete(`/api/coupons/${createRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.status).toBe(200);
  });

  test('Validate coupon enforces min_amount', async () => {
    const validRes = await request(app)
      .post('/api/coupons/validate?code=WELCOME10&amount=1000')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(validRes.status).toBe(200);
    expect(validRes.body.discount_percent).toBe(10);

    const failMin = await request(app)
      .post('/api/coupons/validate?code=SAVE20&amount=1000')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(failMin.status).toBe(400);

    const notFound = await request(app)
      .post('/api/coupons/validate?code=NOPE999&amount=1000')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(notFound.status).toBe(404);
  });
});

// ---------------- Checkout, Orders & Idempotency ----------------
describe('Checkout & Orders APIs', () => {
  let checkoutItem;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'TEST_ Checkout Item',
        description: 'd',
        price: 3000,
        category: 'Electronics',
        stock: 20
      });
    checkoutItem = res.body;
  });

  afterAll(async () => {
    if (checkoutItem) {
      await request(app)
        .delete(`/api/products/${checkoutItem.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });

  test('Checkout empty cart fails with 400', async () => {
    await request(app)
      .put('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: checkoutItem.id, quantity: 0 });

    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ address: TEST_ADDRESS });
    expect(res.status).toBe(400);
  });

  test('Checkout, coupon calculation, whole-rupee rounding, verify idempotency, stock decrement', async () => {
    // Add 2 items (subtotal = 6000, coupon SAVE20 -> 20% discount = 1200, shipping = 0, total = 4800)
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ product_id: checkoutItem.id, quantity: 2 });

    const checkoutRes = await request(app)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ coupon_code: 'SAVE20', address: TEST_ADDRESS });
    expect(checkoutRes.status).toBe(200);
    expect(checkoutRes.body.total).toBe(4800);
    const orderId = checkoutRes.body.order_id;

    // Verify payment
    const verifyRes1 = await request(app)
      .post('/api/orders/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ order_id: orderId });
    expect(verifyRes1.status).toBe(200);
    expect(verifyRes1.body.ok).toBe(true);

    // Check stock decremented to 18
    const prodRes1 = await request(app).get(`/api/products/${checkoutItem.id}`);
    expect(prodRes1.body.stock).toBe(18);

    // Second verify call should be idempotent and not decrement stock again
    const verifyRes2 = await request(app)
      .post('/api/orders/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ order_id: orderId });
    expect(verifyRes2.status).toBe(200);

    const prodRes2 = await request(app).get(`/api/products/${checkoutItem.id}`);
    expect(prodRes2.body.stock).toBe(18);

    // Check orders list
    const ordersRes = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(ordersRes.status).toBe(200);
    const order = ordersRes.body.find(o => o.id === orderId);
    expect(order).toBeDefined();
    expect(order.payment_status).toBe('paid');
    expect(order.status).toBe('confirmed');
    expect(order.total).toBe(4800);
    expect(order.discount).toBe(1200);
    expect(order._id).toBeUndefined();

    // Cart cleared
    const cartRes = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(cartRes.body).toEqual([]);
  });

  test('Malformed ObjectId in routes returns 4xx and never 500', async () => {
    const checks = [
      ['get', '/api/orders/badid', null, customerToken],
      ['post', '/api/orders/verify', { order_id: 'badid' }, customerToken],
      ['post', '/api/cart', { product_id: 'badid', quantity: 1 }, customerToken],
      ['get', '/api/products/badid', null, customerToken],
      ['post', '/api/wishlist/badid', null, customerToken],
      ['delete', '/api/products/badid', null, adminToken],
      ['delete', '/api/coupons/badid', null, adminToken],
      ['put', '/api/admin/orders/badid/status', { status: 'shipped' }, adminToken]
    ];

    for (const [method, url, body, token] of checks) {
      let req = request(app)[method](url);
      if (token) req = req.set('Authorization', `Bearer ${token}`);
      if (body) req = req.send(body);
      const res = await req;
      expect(res.status).toBeLessThan(500);
    }
  });
});

// ---------------- Admin Analytics & Order Management ----------------
describe('Admin Analytics & Order Management', () => {
  test('Admin stats returns comprehensive analytics fields', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    ['revenue', 'total_orders', 'total_products', 'total_customers', 'low_stock', 'recent_orders', 'daily_revenue', 'best_sellers', 'category_revenue'].forEach(k => {
      expect(res.body[k]).toBeDefined();
    });
    expect(Array.isArray(res.body.daily_revenue)).toBe(true);
    expect(res.body.daily_revenue.length).toBe(14);
  });
});

// ---------------- Email Safety Scanner ----------------
describe('Email Safety Gate', () => {
  test('Safe email passes validation', () => {
    const order = { items: [{ name: 'TEST_ Item', price: 100, quantity: 2 }], total: 200, user_name: 'QA', user_email: 'qa@example.com' };
    const html = emailShell('Order confirmed', 'Thanks for your order.', order);
    expect(() => assertSafeEmail('Your order is confirmed', html)).not.toThrow();
  });

  test('Email with forms is rejected', () => {
    expect(() => assertSafeEmail('Form test', '<form><input name="test"></form>')).toThrow(/No forms/);
  });

  test('Email with credential ask is rejected', () => {
    expect(() => assertSafeEmail('Security', 'Please enter your password below')).toThrow(/credentials/);
  });

  test('Email with non-https link is rejected', () => {
    expect(() => assertSafeEmail('Link', '<a href="http://example.com">click</a>')).toThrow(/absolute https/);
  });
});
