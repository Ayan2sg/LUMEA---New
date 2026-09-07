const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const rootDir = __dirname;
dotenv.config({ path: path.join(rootDir, '.env') });

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  // Optional if razorpay package is loading
}

let mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
let dbName = process.env.DB_NAME || 'lumea';
let client = null;
let db = null;
let memoryMongoServer = null;

const JWT_SECRET = process.env.JWT_SECRET || 'lumea-secret-key-change-in-production';
const JWT_ALGORITHM = 'HS256';
const APP_NAME = process.env.APP_NAME || 'lumea-store';
const EMERGENT_KEY = process.env.EMERGENT_LLM_KEY;
const STORAGE_URL = 'https://integrations.emergentagent.com/objstore/api/v1/storage';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const APP_URL = process.env.APP_URL || '';
const EMAIL_BASE_URL = 'https://integrations.emergentagent.com';
const EMAIL_KEY = process.env.EMERGENT_EMAIL_KEY;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Luméa';
const PORT = process.env.PORT || 8000;

const app = express();
const apiRouter = express.Router();

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*';
app.use(cors({
  origin: corsOrigins === '*' ? '*' : corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
}));

app.use(express.json());

// Ensure database connection in serverless environments (e.g. Vercel)
let dbInitPromise = null;
app.use(async (req, res, next) => {
  if (!db) {
    if (!dbInitPromise) {
      dbInitPromise = initDatabase().catch(err => {
        dbInitPromise = null;
        console.error('Database initialization error:', err);
      });
    }
    try {
      await dbInitPromise;
    } catch (e) {
      return res.status(500).json({ detail: 'Database connection error' });
    }
  }
  next();
});

// Multer memory storage for uploads
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

// ---------------- Helpers ----------------
function clean(doc) {
  if (!doc) return doc;
  const copy = { ...doc };
  if (copy._id) {
    copy.id = copy._id.toString();
    delete copy._id;
  }
  return copy;
}

function oid(idStr) {
  if (!idStr || typeof idStr !== 'string' || !ObjectId.isValid(idStr) || idStr.length !== 24) {
    const err = new Error('Not found');
    err.statusCode = 404;
    throw err;
  }
  return new ObjectId(idStr);
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function verifyPassword(plain, hashed) {
  try {
    return bcrypt.compareSync(plain, hashed);
  } catch (e) {
    return false;
  }
}

function createAccessToken(userId, email, role) {
  const payload = {
    sub: userId,
    email,
    role,
    type: 'access'
  };
  return jwt.sign(payload, JWT_SECRET, { algorithm: JWT_ALGORITHM, expiresIn: '7d' });
}

// ---------------- Auth Middleware ----------------
async function getCurrentUser(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }
  const token = authorization.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.sub) });
    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }
    const cleanUser = clean(user);
    delete cleanUser.password_hash;
    req.user = cleanUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ detail: 'Token expired' });
    }
    return res.status(401).json({ detail: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  getCurrentUser(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ detail: 'Admin access required' });
    }
    next();
  });
}

function optionalCurrentUser(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
      req.userId = payload.sub;
    } catch (e) {
      req.userId = null;
    }
  }
  next();
}

// ---------------- Storage helpers ----------------
let storageKey = null;

async function initStorage() {
  if (storageKey) return storageKey;
  if (!EMERGENT_KEY) return null;
  const resp = await axios.post(`${STORAGE_URL}/init`, { emergent_key: EMERGENT_KEY }, { timeout: 30000 });
  storageKey = resp.data.storage_key;
  return storageKey;
}

async function putObject(pathName, data, contentType) {
  const key = await initStorage();
  const resp = await axios.put(`${STORAGE_URL}/objects/${pathName}`, data, {
    headers: { 'X-Storage-Key': key, 'Content-Type': contentType },
    timeout: 120000
  });
  return resp.data;
}

async function getObject(pathName) {
  const key = await initStorage();
  const resp = await axios.get(`${STORAGE_URL}/objects/${pathName}`, {
    headers: { 'X-Storage-Key': key },
    responseType: 'arraybuffer',
    timeout: 60000
  });
  return {
    content: Buffer.from(resp.data),
    contentType: resp.headers['content-type'] || 'application/octet-stream'
  };
}

// ---------------- Email helpers ----------------
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'goo.gl', 'rebrand.ly'];
const CRED_ASK = [
  'reply with your password', 'reply with the code', 'send your password', 'cvv',
  'send us your password', 'enter your password below', 'confirm your card number',
  'your full card number', 'seed phrase', 'recovery phrase', 'verify your card',
  'social security number', 'confirm your bank details'
];
const HOSTISH_REGEX = /\b(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})/gi;

function hostOk(host) {
  if (!host || host.includes('xn--')) return false;
  // Check if IP address
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv4Regex.test(host) || ipv6Regex.test(host)) return false;
  return !SHORTENERS.some(s => host === s || host.endsWith('.' + s));
}

function sameSite(shown, real) {
  return shown === real || real.endsWith('.' + shown) || shown.endsWith('.' + real);
}

function assertSafeEmail(subject, html) {
  // Check forbidden form tags
  const formTagRegex = /<\s*(form|input|textarea|select)\b/i;
  if (formTagRegex.test(html)) {
    throw new Error('No forms or input fields in email (G2)');
  }
  const body = `${subject}\n${html}`.toLowerCase();
  for (const p of CRED_ASK) {
    if (body.includes(p)) {
      throw new Error(`Email asks the recipient for credentials: '${p}' (G2)`);
    }
  }

  // Find all href and src URLs
  const attrRegex = /\b(href|src)\s*=\s*["']([^"']+)["']/gi;
  let match;
  const urls = [];
  while ((match = attrRegex.exec(html)) !== null) {
    urls.push(match[2]);
  }

  for (const rawUrl of urls) {
    const low = rawUrl.trim().toLowerCase();
    if (low.startsWith('mailto:') || low.startsWith('tel:') || low.startsWith('cid:') || low.startsWith('#')) {
      continue;
    }
    if (!low.startsWith('https://')) {
      throw new Error(`Email links/assets must be absolute https: '${rawUrl}' (G3)`);
    }
    try {
      const parsed = new URL(low);
      const host = parsed.hostname || '';
      if (!hostOk(host) || parsed.username) {
        throw new Error(`Shortened, numeric-host or credential-bearing URL: '${rawUrl}' (G3)`);
      }
    } catch (e) {
      if (e.message.includes('G3')) throw e;
      throw new Error(`Invalid URL in email: '${rawUrl}' (G3)`);
    }
  }

  // Anchor text host mismatch check
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let aMatch;
  while ((aMatch = anchorRegex.exec(html)) !== null) {
    const href = aMatch[1].trim().toLowerCase();
    const text = aMatch[2].replace(/<[^>]*>/g, '');
    try {
      const realHost = (new URL(href)).hostname || '';
      if (!realHost) continue;
      let hostMatch;
      while ((hostMatch = HOSTISH_REGEX.exec(text)) !== null) {
        const shownHost = hostMatch[1].toLowerCase();
        if (!sameSite(shownHost, realHost)) {
          throw new Error(`Anchor text '${shownHost}' != real link host '${realHost}' (G3)`);
        }
      }
    } catch (e) {
      if (e.message.includes('G3')) throw e;
    }
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendEmail({ to, subject, html }) {
  if (!EMAIL_KEY) return null;
  try {
    assertSafeEmail(subject, html);
    const payload = {
      to: [to],
      subject,
      html,
      from_name: EMAIL_FROM_NAME
    };
    const resp = await axios.post(`${EMAIL_BASE_URL}/api/v1/email/send`, payload, {
      headers: { 'X-Email-Key': EMAIL_KEY },
      timeout: 30000
    });
    return resp.data?.id || null;
  } catch (err) {
    console.error('Email send error:', err.message);
    return null;
  }
}

function orderRows(order) {
  let rows = '';
  for (const it of order.items || []) {
    rows += `<tr><td style="padding:8px 0;font-size:14px;color:#111">${escapeHtml(it.name)} &times; ${it.quantity}</td>` +
      `<td style="padding:8px 0;font-size:14px;color:#111;text-align:right">&#8377;${Math.round(it.price * it.quantity)}</td></tr>`;
  }
  return rows;
}

function emailShell(heading, intro, order, ctaLabel = 'Track your order') {
  const link = APP_URL.startsWith('https://') ? `${APP_URL}/orders` : null;
  const btn = link ? `<a href="${link}" style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:12px 24px;font-size:14px;text-decoration:none;margin-top:16px">${escapeHtml(ctaLabel)}</a>` : '';
  return `<table role="presentation" width="100%" style="background:#f7f7f8;padding:32px 0">` +
    `<tr><td align="center"><table role="presentation" width="480" style="background:#ffffff;border:1px solid #e5e7eb">` +
    `<tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif">` +
    `<p style="font-size:22px;font-weight:bold;letter-spacing:-0.5px;margin:0 0 4px">${escapeHtml(EMAIL_FROM_NAME)}</p>` +
    `<h1 style="font-size:20px;color:#111;margin:16px 0 8px">${escapeHtml(heading)}</h1>` +
    `<p style="font-size:14px;color:#52525b;line-height:1.6">${escapeHtml(intro)}</p>` +
    `<table role="presentation" width="100%" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;margin:16px 0">${orderRows(order)}</table>` +
    `<p style="font-size:15px;color:#111"><strong>Total: &#8377;${Math.round(order.total)}</strong></p>` +
    `${btn}` +
    `<p style="font-size:12px;color:#888;margin-top:24px">Sent by ${escapeHtml(EMAIL_FROM_NAME)}. We never ask for your password or card details by email.</p>` +
    `</td></tr></table></td></tr></table>`;
}

async function emailOrderConfirmation(order) {
  const subject = `Your ${EMAIL_FROM_NAME} order is confirmed`;
  const intro = `Hi ${order.user_name || 'there'}, thanks for your order. It is confirmed and being prepared.`;
  await sendEmail({
    to: order.user_email,
    subject,
    html: emailShell('Order confirmed', intro, order)
  });
}

async function emailShippingUpdate(order, status) {
  const labels = {
    shipped: 'Your order has shipped',
    delivered: 'Your order was delivered',
    confirmed: 'Your order is confirmed',
    cancelled: 'Your order was cancelled'
  };
  const heading = labels[status] || 'Order update';
  const orderSnippet = order._id ? String(order._id).slice(-8) : (order.id ? String(order.id).slice(-8) : '');
  const intro = `Hi ${order.user_name || 'there'}, your order #${orderSnippet} is now '${status}'.`;
  const subject = `${heading} - ${EMAIL_FROM_NAME}`;
  await sendEmail({
    to: order.user_email,
    subject,
    html: emailShell(heading, intro, order)
  });
}

// ---------------- Product Prep Helper ----------------
function prepProduct(doc) {
  const variants = doc.variants || [];
  if (variants && variants.length > 0) {
    doc.stock = variants.reduce((sum, v) => sum + parseInt(v.stock || 0, 10), 0);
  }
  return doc;
}

function variantStock(product, variant) {
  if (variant && product.variants && product.variants.length > 0) {
    const match = product.variants.find(v => (v.size || '') === (variant.size || '') && (v.color || '') === (variant.color || ''));
    return match ? parseInt(match.stock || 0, 10) : 0;
  }
  return parseInt(product.stock || 0, 10);
}

function sameVariant(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (a.size || '') === (b.size || '') && (a.color || '') === (b.color || '');
}

function productStockAvailable(product, variant = null) {
  if (!product) return 0;
  if (variant && product.variants && product.variants.length > 0) {
    return variantStock(product, variant);
  }
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + parseInt(v.stock || 0, 10), 0);
  }
  return parseInt(product.stock || 0, 10);
}

// ---------------- Cart Detail Helper ----------------
async function getCartDetailed(userId) {
  const cart = (await db.collection('carts').findOne({ user_id: userId })) || { user_id: userId, items: [] };
  const raw = cart.items || [];
  const objIds = [];
  for (const it of raw) {
    try {
      objIds.push(new ObjectId(it.product_id));
    } catch (e) {
      // ignore invalid id
    }
  }
  const docs = objIds.length > 0 ? await db.collection('products').find({ _id: { $in: objIds } }).toArray() : [];
  const pmap = {};
  for (const d of docs) {
    pmap[d._id.toString()] = d;
  }
  const items = [];
  for (const it of raw) {
    const p = pmap[it.product_id];
    if (p) {
      const variant = it.variant || null;
      items.push({
        product: clean({ ...p }),
        quantity: it.quantity,
        variant,
        variant_stock: variantStock(p, variant)
      });
    }
  }
  return items;
}

// ---------------- Totals Computation Helper ----------------
async function computeTotals(userId, couponCode) {
  const items = await getCartDetailed(userId);
  if (!items || items.length === 0) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  let discount = 0.0;
  let applied = null;
  if (couponCode) {
    const c = await db.collection('coupons').findOne({ code: couponCode.toUpperCase(), active: true });
    if (c && subtotal >= (c.min_amount || 0)) {
      discount = Math.round(subtotal * (c.discount_percent / 100));
      applied = c.code;
    }
  }
  const shipping = subtotal > 999 ? 0 : 49;
  const total = Math.round(subtotal - discount + shipping);
  return { items, subtotal, discount, shipping, total, applied };
}

// ==========================================
// ROUTES
// ==========================================

// ---------------- Auth Routes ----------------
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ detail: 'Missing required fields' });
    }
    const cleanEmail = email.toLowerCase();
    const existing = await db.collection('users').findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ detail: 'Email already registered' });
    }
    const doc = {
      name,
      email: cleanEmail,
      password_hash: hashPassword(password),
      role: 'customer',
      created_at: new Date().toISOString()
    };
    const result = await db.collection('users').insertOne(doc);
    const uid = result.insertedId.toString();
    const token = createAccessToken(uid, cleanEmail, 'customer');
    return res.json({
      token,
      user: { id: uid, name, email: cleanEmail, role: 'customer' }
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ detail: 'Missing email or password' });
    }
    const cleanEmail = email.toLowerCase();
    const rec = await db.collection('login_attempts').findOne({ identifier: cleanEmail });
    const now = new Date();
    if (rec) {
      const last = new Date(rec.last);
      const diffMinutes = (now - last) / (1000 * 60);
      if (diffMinutes >= 15) {
        await db.collection('login_attempts').deleteOne({ identifier: cleanEmail });
      } else if ((rec.count || 0) >= 5) {
        return res.status(429).json({ detail: 'Too many failed attempts. Try again in a few minutes.' });
      }
    }
    const user = await db.collection('users').findOne({ email: cleanEmail });
    if (!user || !verifyPassword(password, user.password_hash)) {
      await db.collection('login_attempts').updateOne(
        { identifier: cleanEmail },
        { $inc: { count: 1 }, $set: { last: now.toISOString() } },
        { upsert: true }
      );
      return res.status(401).json({ detail: 'Invalid email or password' });
    }
    await db.collection('login_attempts').deleteOne({ identifier: cleanEmail });
    const uid = user._id.toString();
    const token = createAccessToken(uid, cleanEmail, user.role);
    return res.json({
      token,
      user: { id: uid, name: user.name, email: cleanEmail, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.get('/auth/me', getCurrentUser, (req, res) => {
  return res.json(req.user);
});

// ---------------- Product Routes ----------------
apiRouter.get('/products', async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    const q = {};
    if (category && category !== 'all') {
      q.category = category;
    }
    if (featured !== undefined) {
      q.featured = featured === 'true' || featured === true;
    }
    if (search) {
      q.name = { $regex: search, $options: 'i' };
    }
    let cursor = db.collection('products').find(q);
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { created_at: -1 }
    };
    if (sort && sortMap[sort]) {
      cursor = cursor.sort(sortMap[sort]);
    }
    const products = await cursor.limit(500).toArray();
    return res.json(products.map(clean));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.get('/categories', async (req, res) => {
  try {
    const cats = await db.collection('products').distinct('category');
    return res.json(cats.sort());
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.get('/products/:product_id', optionalCurrentUser, async (req, res) => {
  try {
    const p = await db.collection('products').findOne({ _id: oid(req.params.product_id) });
    if (!p) {
      return res.status(404).json({ detail: 'Product not found' });
    }
    const reviews = await db.collection('reviews')
      .find({ product_id: req.params.product_id })
      .sort({ created_at: -1 })
      .limit(200)
      .toArray();

    const cleanedProduct = clean(p);
    const cleanedReviews = reviews.map(r => {
      const cr = clean(r);
      delete cr.user_id;
      return cr;
    });
    cleanedProduct.reviews = cleanedReviews;
    cleanedProduct.can_review = false;
    cleanedProduct.has_reviewed = false;

    if (req.userId) {
      const purchased = await db.collection('orders').findOne({
        user_id: req.userId,
        payment_status: 'paid',
        'items.product_id': req.params.product_id
      });
      const reviewed = await db.collection('reviews').findOne({
        product_id: req.params.product_id,
        user_id: req.userId
      });
      cleanedProduct.has_reviewed = Boolean(reviewed);
      cleanedProduct.can_review = Boolean(purchased) && !Boolean(reviewed);
    }
    return res.json(cleanedProduct);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.post('/products', requireAdmin, async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || price === undefined || !category) {
      return res.status(422).json({ detail: 'Missing required product fields' });
    }
    const doc = prepProduct({
      name: req.body.name,
      description: req.body.description || '',
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock || 0),
      images: req.body.images || [],
      featured: Boolean(req.body.featured),
      tags: req.body.tags || [],
      variants: req.body.variants || [],
      rating: 0,
      review_count: 0,
      created_at: new Date().toISOString()
    });
    const result = await db.collection('products').insertOne(doc);
    const inserted = await db.collection('products').findOne({ _id: result.insertedId });
    return res.json(clean(inserted));
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.put('/products/:product_id', requireAdmin, async (req, res) => {
  try {
    const productOid = oid(req.params.product_id);
    const updateData = prepProduct({
      name: req.body.name,
      description: req.body.description || '',
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock || 0),
      images: req.body.images || [],
      featured: Boolean(req.body.featured),
      tags: req.body.tags || [],
      variants: req.body.variants || []
    });
    await db.collection('products').updateOne({ _id: productOid }, { $set: updateData });
    const updated = await db.collection('products').findOne({ _id: productOid });
    return res.json(clean(updated));
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.delete('/products/:product_id', requireAdmin, async (req, res) => {
  try {
    await db.collection('products').deleteOne({ _id: oid(req.params.product_id) });
    return res.json({ ok: true });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

// ---------------- Image Upload / Storage ----------------
apiRouter.post('/upload', requireAdmin, uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }
    const ext = req.file.originalname.includes('.') ? req.file.originalname.split('.').pop() : 'bin';
    const filePath = `${APP_NAME}/products/${uuidv4()}.${ext}`;
    const contentType = req.file.mimetype || 'application/octet-stream';
    const result = await putObject(filePath, req.file.buffer, contentType);
    await db.collection('files').insertOne({
      storage_path: result.path,
      content_type: contentType,
      original_filename: req.file.originalname,
      is_deleted: false,
      created_at: new Date().toISOString()
    });
    return res.json({ url: `/api/files/${result.path}` });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.get('/files/*', async (req, res) => {
  try {
    const rawPath = req.params[0];
    const record = await db.collection('files').findOne({ storage_path: rawPath, is_deleted: false });
    if (!record) {
      return res.status(404).json({ detail: 'File not found' });
    }
    const { content, contentType } = await getObject(rawPath);
    res.setHeader('Content-Type', record.content_type || contentType);
    return res.send(content);
  } catch (err) {
    const status = err.response?.status || 500;
    return res.status(status === 404 ? 404 : 500).json({ detail: err.message });
  }
});

// ---------------- Cart Routes ----------------
apiRouter.get('/cart', getCurrentUser, async (req, res) => {
  try {
    const items = await getCartDetailed(req.user.id);
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.post('/cart', getCurrentUser, async (req, res) => {
  try {
    const { product_id, quantity = 1, variant = null } = req.body;
    const product = await db.collection('products').findOne({ _id: oid(product_id) });
    if (!product) {
      return res.status(404).json({ detail: 'Product not found' });
    }

    const available = productStockAvailable(product, variant);
    const cart = await db.collection('carts').findOne({ user_id: req.user.id });
    let items = cart?.items ? [...cart.items] : [];
    let currentQty = 0;
    for (const it of items) {
      if (it.product_id === product_id && sameVariant(it.variant, variant)) {
        currentQty = it.quantity;
        break;
      }
    }

    const requestedQty = Number(quantity || 0);
    if (requestedQty <= 0) {
      return res.status(400).json({ detail: 'Quantity must be greater than zero' });
    }
    if (currentQty + requestedQty > available) {
      return res.status(400).json({ detail: `Only ${available} left of ${product.name}` });
    }

    let found = false;
    for (const it of items) {
      if (it.product_id === product_id && sameVariant(it.variant, variant)) {
        it.quantity += requestedQty;
        found = true;
        break;
      }
    }
    if (!found) {
      items.push({ product_id, quantity: requestedQty, variant });
    }
    items = items.filter(it => it.quantity > 0);
    await db.collection('carts').updateOne(
      { user_id: req.user.id },
      { $set: { items } },
      { upsert: true }
    );
    const detailed = await getCartDetailed(req.user.id);
    return res.json(detailed);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.put('/cart', getCurrentUser, async (req, res) => {
  try {
    const { product_id, quantity = 1, variant = null } = req.body;
    const product = await db.collection('products').findOne({ _id: oid(product_id) });
    if (!product) {
      return res.status(404).json({ detail: 'Product not found' });
    }

    const requestedQty = Number(quantity || 0);
    const cart = await db.collection('carts').findOne({ user_id: req.user.id });
    let items = cart?.items ? [...cart.items] : [];

    if (requestedQty <= 0) {
      items = items.filter(it => !(it.product_id === product_id && sameVariant(it.variant, variant)));
      await db.collection('carts').updateOne(
        { user_id: req.user.id },
        { $set: { items } },
        { upsert: true }
      );
      const detailed = await getCartDetailed(req.user.id);
      return res.json(detailed);
    }

    const available = productStockAvailable(product, variant);
    if (requestedQty > available) {
      return res.status(400).json({ detail: `Only ${available} left of ${product.name}` });
    }

    for (const it of items) {
      if (it.product_id === product_id && sameVariant(it.variant, variant)) {
        it.quantity = requestedQty;
      }
    }
    items = items.filter(it => it.quantity > 0);
    await db.collection('carts').updateOne(
      { user_id: req.user.id },
      { $set: { items } },
      { upsert: true }
    );
    const detailed = await getCartDetailed(req.user.id);
    return res.json(detailed);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.delete('/cart/:product_id', getCurrentUser, async (req, res) => {
  try {
    const productId = req.params.product_id;
    const { size, color } = req.query;
    const target = (size !== undefined || color !== undefined) ? { size: size || '', color: color || '' } : null;

    const cart = await db.collection('carts').findOne({ user_id: req.user.id });
    let items = cart?.items ? [...cart.items] : [];

    const matches = it => {
      if (it.product_id !== productId) return false;
      return target === null || sameVariant(it.variant, target);
    };

    items = items.filter(it => !matches(it));
    await db.collection('carts').updateOne(
      { user_id: req.user.id },
      { $set: { items } },
      { upsert: true }
    );
    const detailed = await getCartDetailed(req.user.id);
    return res.json(detailed);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// ---------------- Wishlist Routes ----------------
apiRouter.get('/wishlist', getCurrentUser, async (req, res) => {
  try {
    const wl = await db.collection('wishlists').findOne({ user_id: req.user.id });
    const ids = wl?.product_ids || [];
    const objIds = [];
    for (const pid of ids) {
      try {
        objIds.push(new ObjectId(pid));
      } catch (e) {
        // ignore invalid
      }
    }
    const docs = objIds.length > 0 ? await db.collection('products').find({ _id: { $in: objIds } }).toArray() : [];
    const pmap = {};
    for (const d of docs) {
      pmap[d._id.toString()] = d;
    }
    const result = [];
    for (const pid of ids) {
      if (pmap[pid]) {
        result.push(clean({ ...pmap[pid] }));
      }
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.post('/wishlist/:product_id', getCurrentUser, async (req, res) => {
  try {
    const productId = req.params.product_id;
    // ensure product exists or valid
    oid(productId);
    const wl = await db.collection('wishlists').findOne({ user_id: req.user.id });
    let ids = wl?.product_ids ? [...wl.product_ids] : [];
    if (ids.includes(productId)) {
      ids = ids.filter(id => id !== productId);
    } else {
      ids.push(productId);
    }
    await db.collection('wishlists').updateOne(
      { user_id: req.user.id },
      { $set: { product_ids: ids } },
      { upsert: true }
    );
    return res.json({ product_ids: ids });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

// ---------------- Reviews Routes ----------------
apiRouter.post('/products/:product_id/reviews', getCurrentUser, async (req, res) => {
  try {
    const productId = req.params.product_id;
    const { rating, comment = '' } = req.body;
    if (rating === undefined) {
      return res.status(422).json({ detail: 'Missing rating' });
    }
    const productOid = oid(productId);
    const purchased = await db.collection('orders').findOne({
      user_id: req.user.id,
      payment_status: 'paid',
      'items.product_id': productId
    });
    if (!purchased) {
      return res.status(403).json({ detail: 'Only verified buyers can review this product' });
    }
    const existing = await db.collection('reviews').findOne({
      product_id: productId,
      user_id: req.user.id
    });
    if (existing) {
      return res.status(400).json({ detail: 'You have already reviewed this product' });
    }
    const clampedRating = Math.max(1, Math.min(5, Number(rating)));
    const doc = {
      product_id: productId,
      user_id: req.user.id,
      user_name: req.user.name,
      rating: clampedRating,
      comment,
      created_at: new Date().toISOString()
    };
    await db.collection('reviews').insertOne(doc);
    const reviews = await db.collection('reviews').find({ product_id: productId }).toArray();
    const avg = reviews.length > 0 ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)) : 0;
    await db.collection('products').updateOne(
      { _id: productOid },
      { $set: { rating: avg, review_count: reviews.length } }
    );
    return res.json({ ok: true });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

// ---------------- Coupons Routes ----------------
apiRouter.get('/coupons', requireAdmin, async (req, res) => {
  try {
    const coupons = await db.collection('coupons').find().toArray();
    return res.json(coupons.map(clean));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.post('/coupons', requireAdmin, async (req, res) => {
  try {
    const { code, discount_percent, active = true, min_amount = 0 } = req.body;
    if (!code || discount_percent === undefined) {
      return res.status(422).json({ detail: 'Missing code or discount' });
    }
    const upperCode = code.toUpperCase();
    const existing = await db.collection('coupons').findOne({ code: upperCode });
    if (existing) {
      return res.status(400).json({ detail: 'Coupon code exists' });
    }
    const doc = {
      code: upperCode,
      discount_percent: Number(discount_percent),
      active: Boolean(active),
      min_amount: Number(min_amount)
    };
    const result = await db.collection('coupons').insertOne(doc);
    const created = await db.collection('coupons').findOne({ _id: result.insertedId });
    return res.json(clean(created));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.delete('/coupons/:coupon_id', requireAdmin, async (req, res) => {
  try {
    await db.collection('coupons').deleteOne({ _id: oid(req.params.coupon_id) });
    return res.json({ ok: true });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.post('/coupons/validate', getCurrentUser, async (req, res) => {
  try {
    const code = (req.query.code || req.body?.code || '').toUpperCase();
    const amount = Number(req.query.amount !== undefined ? req.query.amount : (req.body?.amount || 0));
    if (!code) {
      return res.status(404).json({ detail: 'Invalid coupon' });
    }
    const c = await db.collection('coupons').findOne({ code, active: true });
    if (!c) {
      return res.status(404).json({ detail: 'Invalid coupon' });
    }
    if (amount < (c.min_amount || 0)) {
      return res.status(400).json({ detail: `Minimum order ₹${c.min_amount || 0} required` });
    }
    return res.json({ code: c.code, discount_percent: c.discount_percent });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// ---------------- Orders / Checkout Routes ----------------
apiRouter.post('/checkout', getCurrentUser, async (req, res) => {
  try {
    const { coupon_code, address } = req.body;
    if (!address) {
      return res.status(422).json({ detail: 'Address is required' });
    }
    const { items, subtotal, discount, shipping, total, applied } = await computeTotals(req.user.id, coupon_code);

    for (const i of items) {
      const avail = i.variant_stock !== undefined ? i.variant_stock : (i.product.stock || 0);
      if (i.quantity > avail) {
        let label = i.product.name;
        if (i.variant) {
          label += ` (${i.variant.size || ''} ${i.variant.color || ''})`.trimEnd();
        }
        return res.status(400).json({ detail: `Only ${avail} left of ${label}` });
      }
    }

    const orderItems = items.map(i => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      category: i.product.category || 'other',
      variant: i.variant,
      image: (i.product.images && i.product.images.length > 0) ? i.product.images[0] : null
    }));

    const orderDoc = {
      user_id: req.user.id,
      user_name: req.user.name,
      user_email: req.user.email,
      items: orderItems,
      subtotal,
      discount,
      shipping,
      total,
      coupon: applied,
      address,
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };

    const insertResult = await db.collection('orders').insertOne(orderDoc);
    const orderId = insertResult.insertedId.toString();

    let razorpayOrder = null;
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && Razorpay) {
      try {
        const rzp = new Razorpay({
          key_id: RAZORPAY_KEY_ID,
          key_secret: RAZORPAY_KEY_SECRET
        });
        razorpayOrder = await rzp.orders.create({
          amount: Math.round(total * 100),
          currency: 'INR',
          payment_capture: 1,
          receipt: orderId.slice(0, 40)
        });
        await db.collection('orders').updateOne(
          { _id: insertResult.insertedId },
          { $set: { razorpay_order_id: razorpayOrder.id } }
        );
      } catch (rzpErr) {
        console.error('Razorpay error:', rzpErr.message);
      }
    }

    return res.json({
      order_id: orderId,
      total,
      razorpay_order: razorpayOrder,
      razorpay_key_id: RAZORPAY_KEY_ID,
      demo_mode: !Boolean(razorpayOrder)
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.post('/orders/verify', getCurrentUser, async (req, res) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!order_id) {
      return res.status(404).json({ detail: 'Order not found' });
    }
    const orderOid = oid(order_id);
    const order = await db.collection('orders').findOne({ _id: orderOid });
    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ detail: 'Order not found' });
    }
    if (order.payment_status === 'paid') {
      return res.json({ ok: true, order_id });
    }

    let verified = true;
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && razorpay_signature) {
      const msg = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(msg).digest('hex');
      verified = (expected === razorpay_signature);
    }

    if (!verified) {
      return res.status(400).json({ detail: 'Payment verification failed' });
    }

    await db.collection('orders').updateOne(
      { _id: orderOid },
      {
        $set: {
          payment_status: 'paid',
          status: 'confirmed',
          payment_id: razorpay_payment_id || null
        }
      }
    );

    // Decrement stock
    for (const it of order.items || []) {
      const variant = it.variant;
      const pid = oid(it.product_id);
      if (variant) {
        await db.collection('products').updateOne(
          { _id: pid },
          {
            $inc: {
              'variants.$[v].stock': -it.quantity,
              stock: -it.quantity
            }
          },
          {
            arrayFilters: [{ 'v.size': variant.size || '', 'v.color': variant.color || '' }]
          }
        );
      } else {
        await db.collection('products').updateOne(
          { _id: pid },
          { $inc: { stock: -it.quantity } }
        );
      }
    }

    // Clear cart
    await db.collection('carts').updateOne(
      { user_id: req.user.id },
      { $set: { items: [] } }
    );

    // Background confirmation email
    setImmediate(() => {
      emailOrderConfirmation(order).catch(e => console.error('Order confirmation email failed:', e));
    });

    return res.json({ ok: true, order_id });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

apiRouter.get('/orders', getCurrentUser, async (req, res) => {
  try {
    const orders = await db.collection('orders')
      .find({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .limit(200)
      .toArray();
    return res.json(orders.map(clean));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.get('/orders/:order_id', getCurrentUser, async (req, res) => {
  try {
    const o = await db.collection('orders').findOne({ _id: oid(req.params.order_id) });
    if (!o || (o.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(404).json({ detail: 'Order not found' });
    }
    return res.json(clean(o));
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ detail: err.message });
  }
});

// ---------------- Admin Orders & Stats ----------------
apiRouter.get('/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await db.collection('orders').find().sort({ created_at: -1 }).limit(500).toArray();
    return res.json(orders.map(clean));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

apiRouter.put('/admin/orders/:order_id/status', requireAdmin, async (req, res) => {
  try {
    const status = req.query.status || req.body?.status;
    if (!status) {
      return res.status(422).json({ detail: 'Status is required' });
    }
    const orderOid = oid(req.params.order_id);
    await db.collection('orders').updateOne({ _id: orderOid }, { $set: { status } });
    const order = await db.collection('orders').findOne({ _id: orderOid });
    if (order && order.payment_status === 'paid' && ['shipped', 'delivered', 'cancelled'].includes(status)) {
      setImmediate(() => {
        emailShippingUpdate(order, status).catch(e => console.error('Shipping email update failed:', e));
      });
    }
    return res.json({ ok: true });
  } catch (err) {
    const s = err.statusCode || 500;
    return res.status(s).json({ detail: err.message });
  }
});

apiRouter.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const orders = await db.collection('orders').find({ payment_status: 'paid' }).toArray();
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = await db.collection('orders').countDocuments({});
    const totalProducts = await db.collection('products').countDocuments({});
    const totalCustomers = await db.collection('users').countDocuments({ role: 'customer' });
    const lowStockDocs = await db.collection('products').find({ stock: { $lt: 10 } }).limit(50).toArray();
    const recentDocs = await db.collection('orders').find().sort({ created_at: -1 }).limit(6).toArray();

    // category revenue & best sellers & daily trend
    const missingIds = [];
    for (const o of orders) {
      for (const it of o.items || []) {
        if (!it.category) {
          try {
            missingIds.push(new ObjectId(it.product_id));
          } catch (e) {
            // ignore
          }
        }
      }
    }

    const pdocs = missingIds.length > 0 ? await db.collection('products').find({ _id: { $in: missingIds } }).toArray() : [];
    const pmap = {};
    for (const d of pdocs) {
      pmap[d._id.toString()] = d;
    }

    const catRev = {};
    const seller = {};
    const daily = {};

    for (const o of orders) {
      const day = String(o.created_at || '').slice(0, 10);
      daily[day] = (daily[day] || 0) + (o.total || 0);
      for (const it of o.items || []) {
        let cat = it.category;
        if (!cat) {
          const p = pmap[it.product_id];
          cat = p?.category || 'other';
        }
        const line = (it.price || 0) * (it.quantity || 0);
        catRev[cat] = (catRev[cat] || 0) + line;
        if (!seller[it.name]) {
          seller[it.name] = { name: it.name, qty: 0, revenue: 0, image: it.image || null };
        }
        seller[it.name].qty += it.quantity || 0;
        seller[it.name].revenue += line;
      }
    }

    const today = new Date();
    const dailyRevenue = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
      const dateStr = d.toISOString().slice(0, 10);
      dailyRevenue.push({
        date: dateStr.slice(5),
        revenue: Math.round((daily[dateStr] || 0) * 100) / 100
      });
    }

    const bestSellers = Object.values(seller)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map(b => ({ ...b, revenue: Math.round(b.revenue * 100) / 100 }));

    return res.json({
      revenue: Math.round(revenue * 100) / 100,
      total_orders: totalOrders,
      total_products: totalProducts,
      total_customers: totalCustomers,
      low_stock: lowStockDocs.map(clean),
      recent_orders: recentDocs.map(clean),
      daily_revenue: dailyRevenue,
      best_sellers: bestSellers,
      category_revenue: Object.entries(catRev).map(([k, v]) => ({ name: k, value: Math.round(v * 100) / 100 }))
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// Root route
apiRouter.get('/', (req, res) => {
  return res.json({ message: 'Lumea Store API' });
});

app.use('/api', apiRouter);

// ---------------- Seed Data ----------------
const SEED_PRODUCTS = [
  {
    name: 'Ivory Wrap Midi Dress', category: 'Fashion', price: 2499, stock: 24, featured: true,
    description: 'A flowing ivory wrap dress cut from breathable crepe. Effortless drape, adjustable waist tie, and a timeless silhouette for day into evening.',
    images: [
      'https://images.pexels.com/photos/30590675/pexels-photo-30590675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGRyZXNzJTIwZmFzaGlvbiUyMGVkaXRvcmlhbHxlbnwwfHx8fDE3ODc4MjU2NzJ8MA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1698341484377-4a6e546867b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHx3aGl0ZSUyMGRyZXNzJTIwZmFzaGlvbiUyMGVkaXRvcmlhbHxlbnwwfHx8fDE3ODc4MjU2NzJ8MA&ixlib=rb-4.1.0&q=85'
    ],
    variants: [
      { size: 'XS', color: 'Ivory', stock: 5 }, { size: 'S', color: 'Ivory', stock: 7 },
      { size: 'M', color: 'Ivory', stock: 6 }, { size: 'M', color: 'Rose', stock: 4 },
      { size: 'L', color: 'Rose', stock: 2 }
    ],
    tags: ['women', 'dress']
  },
  {
    name: 'Sunlit Lounge Hat & Set', category: 'Fashion', price: 1899, stock: 18, featured: true,
    description: 'Relaxed lounge co-ord paired with a wide-brim hat. Soft-touch cotton blend built for slow mornings and golden hours.',
    images: [
      'https://images.unsplash.com/photo-1687884578968-94d89d7e30cb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBtb2RlbHxlbnwwfHx8fDE3ODU4NzQyNjF8MA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGRyZXNzJTIwZmFzaGlvbiUyMGVkaXRvcmlhbHxlbnwwfHx8fDE3ODc4MjU2NzJ8MA&ixlib=rb-4.1.0&q=85'
    ],
    variants: [
      { size: 'S', color: 'Sand', stock: 6 }, { size: 'M', color: 'Sand', stock: 6 },
      { size: 'L', color: 'Sand', stock: 3 }, { size: 'M', color: 'White', stock: 3 }
    ],
    tags: ['women', 'set']
  },
  {
    name: 'Aurora Tablet Pro 11', category: 'Electronics', price: 42999, stock: 12, featured: true,
    description: 'An 11-inch OLED tablet with an edge-to-edge display, all-day battery, and a laminated anti-glare finish. Creative power in a slim frame.',
    images: [
      'https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MHx8fHwxNzg1ODc0MjYxfDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1778854097052-5a04619c5e64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MHx8fHwxNzg1ODc0MjYxfDA&ixlib=rb-4.1.0&q=85'
    ],
    tags: ['tablet']
  },
  {
    name: 'Leica-Lens Smartphone X', category: 'Electronics', price: 68999, stock: 8, featured: true,
    description: 'Flagship phone with a co-engineered Leica triple camera, titanium body, and a 120Hz display. Photography, redefined.',
    images: [
      'https://images.unsplash.com/photo-1778854097052-5a04619c5e64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MHx8fHwxNzg1ODc0MjYxfDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MHx8fHwxNzg1ODc0MjYxfDA&ixlib=rb-4.1.0&q=85'
    ],
    tags: ['phone']
  },
  {
    name: 'iPad + iPhone Creator Duo', category: 'Electronics', price: 89999, stock: 6, featured: false,
    description: 'The essential creator bundle. Sketch, edit, and publish across a seamless dual-device workflow.',
    images: [
      'https://images.unsplash.com/photo-1572784040789-304f4cdacd62?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwyfHxlY29tbWVyY2UlMjBsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwwfHx8fDE3ODU4NzQyNjF8MA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2slMjBtaW5pbWFsfGVufDB8fHx8MTc4NzgyNTY3Mnww&ixlib=rb-4.1.0&q=85'
    ],
    tags: ['bundle']
  },
  {
    name: 'Workspace Laptop Air 14', category: 'Electronics', price: 74999, stock: 15, featured: true,
    description: 'Ultralight 14-inch laptop with a fanless silicon core, 18-hour battery, and a crisp Retina panel for work anywhere.',
    images: [
      'https://images.unsplash.com/photo-1605629921852-f9b3d997c14a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHw0fHxlY29tbWVyY2UlMjBsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwwfHx8fDE3ODU4NzQyNjF8MA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2slMjBtaW5pbWFsfGVufDB8fHx8MTc4NzgyNTY3Mnww&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2slMjBtaW5pbWFsfGVufDB8fHx8MTc4NzgyNTY3Mnww&ixlib=rb-4.1.0&q=85'
    ],
    tags: ['laptop']
  },
  {
    name: 'Minimal Canvas Tote', category: 'Lifestyle', price: 899, stock: 40, featured: false,
    description: 'Heavyweight organic canvas tote with reinforced straps. Your everyday carry, pared back to the essentials.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.pexels.com/photos/8148587/pexels-photo-8148587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      'https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwxfHxjYW52YXMlMjB0b3RlJTIwYmFnJTIwbWluaW1hbHxlbnwwfHx8fDE3ODc4MjU2NzJ8MA&ixlib=rb-4.1.0&q=85'
    ],
    tags: ['bag']
  },
  {
    name: 'Ceramic Pour-Over Set', category: 'Lifestyle', price: 1499, stock: 22, featured: false,
    description: 'Matte ceramic pour-over dripper and carafe. Slow coffee ritual, beautifully engineered.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1773394472792-a3a2f9a85d2e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG91ciUyMG92ZXIlMjBjb2ZmZWUlMjBzZXR8ZW58MHx8fHwxNzg3ODI1NjcyfDA&ixlib=rb-4.1.0&q=85'
    ],
    tags: ['home']
  }
];

function stringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function initDatabase(customMongoUrl, customDbName) {
  if (customMongoUrl) {
    mongoUrl = customMongoUrl;
  } else if (!process.env.MONGO_URL || process.env.MONGO_URL.includes('localhost') || process.env.MONGO_URL.includes('127.0.0.1')) {
    try {
      if (!memoryMongoServer) {
        memoryMongoServer = await MongoMemoryServer.create();
      }
      mongoUrl = memoryMongoServer.getUri();
    } catch (e) {
      console.warn('MongoMemoryServer unavailable; using local MongoDB connection string as configured.');
    }
  }

  if (customDbName) {
    dbName = customDbName;
  }
  if (!client) {
    client = new MongoClient(mongoUrl);
  }
  await client.connect();
  db = client.db(dbName);

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await db.collection('users').findOne({ email: adminEmail });

  if (!existingAdmin) {
    await db.collection('users').insertOne({
      name: 'Store Admin',
      email: adminEmail,
      password_hash: hashPassword(adminPassword),
      role: 'admin',
      created_at: new Date().toISOString()
    });
  } else if (!verifyPassword(adminPassword, existingAdmin.password_hash)) {
    await db.collection('users').updateOne(
      { email: adminEmail },
      { $set: { password_hash: hashPassword(adminPassword), role: 'admin' } }
    );
  }

  const productCount = await db.collection('products').countDocuments({});
  if (productCount === 0) {
    for (const p of SEED_PRODUCTS) {
      const h = stringHash(p.name);
      const rating = Number((4.2 + 0.7 * (h % 10) / 10).toFixed(1));
      const reviewCount = (h % 40) + 5;
      await db.collection('products').insertOne({
        ...p,
        rating,
        review_count: reviewCount,
        created_at: new Date().toISOString()
      });
    }
  }

  const couponCount = await db.collection('coupons').countDocuments({});
  if (couponCount === 0) {
    await db.collection('coupons').insertMany([
      { code: 'WELCOME10', discount_percent: 10, active: true, min_amount: 0 },
      { code: 'SAVE20', discount_percent: 20, active: true, min_amount: 5000 }
    ]);
  }

  try {
    await initStorage();
  } catch (e) {
    console.error('Storage init failed:', e.message);
  }
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
  if (memoryMongoServer) {
    await memoryMongoServer.stop();
    memoryMongoServer = null;
  }
}

let server;
if (require.main === module) {
  initDatabase().then(() => {
    server = app.listen(PORT, () => {
      console.log(`Luméa backend server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  });
}

app.app = app;
app.getClient = () => client;
app.getDb = () => db;
app.initDatabase = initDatabase;
app.closeDatabase = closeDatabase;
app.assertSafeEmail = assertSafeEmail;
app.emailShell = emailShell;
app.sendEmail = sendEmail;
app.hashPassword = hashPassword;
app.verifyPassword = verifyPassword;
app.createAccessToken = createAccessToken;
app.clean = clean;
app.oid = oid;

module.exports = app;
