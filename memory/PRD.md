# Luméa — Premium E-Commerce Platform

## Original Problem Statement
Build a non-basic e-commerce website with: Admin dashboard, Inventory management, Coupons, Payment gateway, Order tracking, Wishlist, Reviews, Image uploads. Stack requested: MERN + Stripe/Razorpay + Cloudinary.

## Stack (as built)
React (CRA) + FastAPI + MongoDB. JWT email/password auth, Razorpay payment gateway (DEMO MODE until keys added), Emergent object storage for image uploads (Cloudinary equivalent).

## User Choices
- Auth: JWT email/password
- Payments: Razorpay (India) — keys not yet provided → checkout runs in DEMO MODE
- Image storage: Emergent object storage
- Catalog: mixed (Fashion / Electronics / Lifestyle)
- Design: modern, attractive — "Editorial Swiss Minimalist" (Clash Display + Satoshi, black/white with rose accent)

## User Personas
- Customer: browses catalog, searches/filters, wishlists, reviews, checks out, tracks orders
- Admin (ayanpratapsingh1@gmail.com): manages inventory, coupons, orders, views revenue analytics

## Implemented (June 2026)
- JWT auth (register/login/me), bcrypt, admin auto-seed, RBAC (admin gate), 5-try/15-min brute-force lockout
- Product catalog: list/detail, category filter, search, sort; multi-image gallery (thumbnails + arrows)
- Product variants: size/color combinations each with own stock; variant-aware cart/checkout/stock-decrement
- Product reviews & star ratings (verified-buyer only, one per product)
- Wishlist, cart (variant-separated lines), coupons (WELCOME10/SAVE20), whole-rupee rounding
- Checkout: LIVE Razorpay (order create + signature verify) + address + coupon
- Order tracking with visual status stepper; order emails (confirmation + shipping updates) via Resend/BackgroundTasks
- Admin dashboard: stats, revenue-by-category, 14-day daily revenue area chart, top-5 best sellers, low-stock, recent orders
- Admin inventory CRUD (image upload + variants editor), coupon CRUD, order management
- Product catalog: list/detail, category filter, search, sort; 8 seeded products
- Product reviews & star ratings (avg auto-computed)
- Wishlist (toggle, dedicated page)
- Cart: add/update/remove, subtotal, free shipping over ₹999
- Coupons: WELCOME10 (10%), SAVE20 (20%, min ₹5000); admin CRUD; validate at checkout
- Checkout: address, coupon, Razorpay order creation + signature verification; DEMO MODE auto-completes when keys absent
- Order tracking: customer /orders with visual status tracker (pending→confirmed→shipped→delivered)
- Admin dashboard: revenue/orders/products/customers stats, revenue-by-category bar + pie charts, low-stock alerts, recent orders
- Admin inventory: product CRUD with image upload to Emergent object storage
- Admin orders: view all, change status (persists)
- Security hardening: order-verify ownership + idempotency, stock oversell guard, safe ObjectId (404 not 500), cart product validation

## Backlog / Remaining
- P1: Add real Razorpay keys to go from DEMO MODE to live payments
- P2: Login brute-force lockout / rate limiting
- P2: Duplicate-review guard + verified-purchase reviews
- P2: Upload mime-type / size validation
- P2: Explicit CORS origins (currently Bearer tokens so harmless)
- P2: Multiple product images gallery on detail page; order confirmation email (Resend)

## Test Credentials
Admin: ayanpratapsingh1@gmail.com / Admin@12345
Customers: register via /register (use @example.com for tests)

## Test Status
Iteration 2: backend 95% (38/40 pytest), frontend 95%. Both HIGH bugs from iteration 2 (cart poisoning, /checkout deep-link) fixed and verified after.
