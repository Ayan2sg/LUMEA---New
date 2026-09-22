// ---------------- Luméa E-Commerce Seed Catalog ----------------
// 22 Products per category (Fashion, Footwear, Electronics, Lifestyle = 88 total)

const SEED_PRODUCTS = [
  // ==========================================
  // CATEGORY 1: FASHION (22 Products)
  // ==========================================
  {
    name: 'Ivory Wrap Midi Dress', category: 'Fashion', price: 2499, stock: 24, featured: true,
    description: 'A flowing ivory wrap dress cut from breathable crepe. Effortless drape, adjustable waist tie, and a timeless silhouette for day into evening.',
    images: [
      'https://images.pexels.com/photos/30590675/pexels-photo-30590675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: 'XS', color: 'Ivory', stock: 5 }, { size: 'S', color: 'Ivory', stock: 7 },
      { size: 'M', color: 'Ivory', stock: 6 }, { size: 'L', color: 'Rose', stock: 6 }
    ],
    tags: ['dress', 'women', 'midi', 'ivory', 'wrap']
  },
  {
    name: 'Casual Black Poplin Shirt', category: 'Fashion', price: 1499, stock: 35, featured: true,
    description: 'Crisp poplin casual shirt tailored in an easy silhouette. Finished with mother-of-pearl buttons and breathable cotton weave for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Black', stock: 10 }, { size: 'M', color: 'Black', stock: 15 },
      { size: 'L', color: 'Black', stock: 10 }
    ],
    tags: ['shirt', 'black', 'casual', 'men', 'top']
  },
  {
    name: 'Linen Vacation Relaxed Shirt', category: 'Fashion', price: 1899, stock: 25, featured: false,
    description: 'Breezy washed linen shirt designed for casual comfort. Features a camp collar and relaxed drape in coastal tones.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'White', stock: 12 }, { size: 'L', color: 'White', stock: 8 },
      { size: 'XL', color: 'Navy', stock: 5 }
    ],
    tags: ['shirt', 'casual', 'linen', 'summer', 'white']
  },
  {
    name: 'Sunlit Lounge Hat & Set', category: 'Fashion', price: 1899, stock: 18, featured: true,
    description: 'Relaxed lounge co-ord paired with a wide-brim hat. Soft-touch cotton blend built for slow mornings and golden hours.',
    images: [
      'https://images.unsplash.com/photo-1687884578968-94d89d7e30cb?crop=entropy&cs=srgb&fm=jpg&w=940&q=85',
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: 'S', color: 'Sand', stock: 6 }, { size: 'M', color: 'Sand', stock: 6 },
      { size: 'L', color: 'Sand', stock: 6 }
    ],
    tags: ['set', 'co-ord', 'hat', 'summer', 'sand']
  },
  {
    name: 'Oversized Heavyweight Cotton Tee', category: 'Fashion', price: 999, stock: 45, featured: false,
    description: 'Crafted from 280 GSM combed organic cotton with a drop-shoulder cut. Dense, durable, and effortlessly structured.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Black', stock: 15 }, { size: 'M', color: 'Black', stock: 15 },
      { size: 'L', color: 'White', stock: 15 }
    ],
    tags: ['tee', 'tshirt', 'black', 'cotton', 'oversized']
  },
  {
    name: 'Tailored Pleated Trousers', category: 'Fashion', price: 2799, stock: 20, featured: true,
    description: 'High-waisted tailored pants with subtle front pleats and a relaxed tapered leg. Woven from lightweight tropical wool blend.',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '30', color: 'Charcoal', stock: 7 }, { size: '32', color: 'Charcoal', stock: 7 },
      { size: '34', color: 'Sand', stock: 6 }
    ],
    tags: ['trousers', 'pants', 'tailored', 'formal', 'charcoal']
  },
  {
    name: 'Minimalist Linen Camp Shirt', category: 'Fashion', price: 1699, stock: 28, featured: false,
    description: 'Cuban collar short-sleeve shirt in natural unbleached linen. Breathable weave designed to soften with every wash.',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Sand', stock: 14 }, { size: 'L', color: 'Sand', stock: 14 }
    ],
    tags: ['shirt', 'linen', 'camp', 'casual', 'summer']
  },
  {
    name: 'Cashmere-Blend Knit Cardigan', category: 'Fashion', price: 3499, stock: 16, featured: false,
    description: 'Ultra-soft cardigan spun with Mongolian cashmere and fine merino. Horn buttons and a relaxed unisex drape.',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Ivory', stock: 5 }, { size: 'M', color: 'Ivory', stock: 6 },
      { size: 'L', color: 'Grey', stock: 5 }
    ],
    tags: ['cardigan', 'knit', 'sweater', 'cashmere', 'ivory']
  },
  {
    name: 'Japanese Selvedge Denim Jacket', category: 'Fashion', price: 4299, stock: 14, featured: true,
    description: '14oz Japanese raw denim tailored into a clean trucker silhouette. Copper hardware and contrast stitching that fades over time.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Indigo', stock: 7 }, { size: 'L', color: 'Indigo', stock: 7 }
    ],
    tags: ['jacket', 'denim', 'selvedge', 'outerwear', 'indigo']
  },
  {
    name: 'Raw Indigo Relaxed Jeans', category: 'Fashion', price: 2999, stock: 22, featured: false,
    description: 'Classic five-pocket jeans with a straight leg and mid-rise. Unwashed rigid denim that molds uniquely to your shape.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '30', color: 'Indigo', stock: 8 }, { size: '32', color: 'Indigo', stock: 8 },
      { size: '34', color: 'Indigo', stock: 6 }
    ],
    tags: ['jeans', 'denim', 'pants', 'indigo', 'casual']
  },
  {
    name: 'Ribbed Mock-Neck Long Sleeve', category: 'Fashion', price: 1299, stock: 30, featured: false,
    description: 'Fitted ribbed knit top with a subtle high neck. Ideal for sleek layering under blazers and overshirts.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'XS', color: 'Black', stock: 10 }, { size: 'S', color: 'Black', stock: 10 },
      { size: 'M', color: 'Ivory', stock: 10 }
    ],
    tags: ['top', 'knit', 'mock-neck', 'black', 'layer']
  },
  {
    name: 'Washed Linen Utility Overshirt', category: 'Fashion', price: 2299, stock: 20, featured: false,
    description: 'Heavyweight linen blend overshirt with dual flap chest pockets. Layer as a light jacket during transitional seasons.',
    images: [
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Olive', stock: 10 }, { size: 'L', color: 'Olive', stock: 10 }
    ],
    tags: ['shirt', 'overshirt', 'utility', 'olive', 'linen']
  },
  {
    name: 'Silk Drape Slip Dress', category: 'Fashion', price: 3199, stock: 15, featured: false,
    description: 'Bias-cut mulberry silk midi dress with adjustable delicate straps. Shimmers gently in evening light.',
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Black', stock: 7 }, { size: 'M', color: 'Champagne', stock: 8 }
    ],
    tags: ['dress', 'silk', 'slip', 'evening', 'black']
  },
  {
    name: 'Structured Wool Blazer', category: 'Fashion', price: 5499, stock: 12, featured: true,
    description: 'Modern double-breasted blazer cut from Italian twill wool. Subtle shoulder pads and clean notched lapels.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '38', color: 'Black', stock: 6 }, { size: '40', color: 'Black', stock: 6 }
    ],
    tags: ['blazer', 'suit', 'wool', 'black', 'formal']
  },
  {
    name: 'Relaxed French Terry Hoodie', category: 'Fashion', price: 2199, stock: 26, featured: false,
    description: '450 GSM looped French terry pullover with no drawstrings for a minimal aesthetic. Pre-shrunk for an enduring fit.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Charcoal', stock: 14 }, { size: 'L', color: 'Charcoal', stock: 12 }
    ],
    tags: ['hoodie', 'sweatshirt', 'casual', 'charcoal', 'fleece']
  },
  {
    name: 'Classic Oxford Button-Down', category: 'Fashion', price: 1599, stock: 32, featured: false,
    description: 'Traditional heavyweight basketweave cotton with roll collar and locker loop. The quintessential smart-casual workhorse.',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Light Blue', stock: 10 }, { size: 'M', color: 'Light Blue', stock: 12 },
      { size: 'L', color: 'White', stock: 10 }
    ],
    tags: ['shirt', 'oxford', 'blue', 'button-down', 'casual']
  },
  {
    name: 'High-Waisted Wide-Leg Pants', category: 'Fashion', price: 2599, stock: 18, featured: false,
    description: 'Fluid drape palazzo trousers tailored with belt loops and clean slant pockets. Modern architectural proportion.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Sand', stock: 8 }, { size: 'M', color: 'Black', stock: 10 }
    ],
    tags: ['pants', 'trousers', 'wide-leg', 'sand', 'women']
  },
  {
    name: 'Minimal Trench Coat', category: 'Fashion', price: 5999, stock: 10, featured: true,
    description: 'Double-breasted gabardine storm coat with storm flap, horn buttons, and waist cinch belt. Resists wind and light drizzle.',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Beige', stock: 5 }, { size: 'L', color: 'Beige', stock: 5 }
    ],
    tags: ['coat', 'trench', 'outerwear', 'beige', 'classic']
  },
  {
    name: 'Waffle-Knit Thermal Crewneck', category: 'Fashion', price: 1399, stock: 25, featured: false,
    description: 'Textured honeycombed cotton jersey built for breathable warmth. Finished with sturdy ribbed collar and cuffs.',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Natural', stock: 12 }, { size: 'L', color: 'Black', stock: 13 }
    ],
    tags: ['crewneck', 'waffle', 'knit', 'casual', 'thermal']
  },
  {
    name: 'Poplin Boxy Short-Sleeve Shirt', category: 'Fashion', price: 1499, stock: 22, featured: false,
    description: 'Clean-front square hem poplin shirt with a wide placket and straight sleeves. Pairs cleanly over shorts or trousers.',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'White', stock: 11 }, { size: 'L', color: 'White', stock: 11 }
    ],
    tags: ['shirt', 'poplin', 'white', 'casual', 'summer']
  },
  {
    name: 'Bohemian Linen Wrap Skirt', category: 'Fashion', price: 1999, stock: 16, featured: false,
    description: 'Calf-grazing wrap skirt with an asymmetrical tie and soft fringed edge. Cut from midweight laundered flax.',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'S', color: 'Terracotta', stock: 8 }, { size: 'M', color: 'Terracotta', stock: 8 }
    ],
    tags: ['skirt', 'linen', 'wrap', 'boho', 'summer']
  },
  {
    name: 'Merino Wool Knit Turtleneck', category: 'Fashion', price: 3299, stock: 14, featured: true,
    description: 'Extra-fine 19.5-micron Australian merino wool with a snug rollneck. Lightweight yet exceptionally insulating.',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'M', color: 'Black', stock: 7 }, { size: 'L', color: 'Oatmeal', stock: 7 }
    ],
    tags: ['sweater', 'turtleneck', 'merino', 'black', 'knit']
  },

  // ==========================================
  // CATEGORY 2: FOOTWEAR (22 Products)
  // ==========================================
  {
    name: 'Minimalist Cloud Running Shoes', category: 'Footwear', price: 2799, stock: 25, featured: true,
    description: 'Featherlight performance road running sneakers featuring engineered mesh upper, responsive foam cushioning, and high-traction rubber outsole.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Black', stock: 8 }, { size: 'UK 8', color: 'Black', stock: 10 },
      { size: 'UK 9', color: 'Black', stock: 7 }
    ],
    tags: ['shoes', 'running', 'sneakers', 'footwear', 'black']
  },
  {
    name: 'AeroStride Daily Runners', category: 'Footwear', price: 3199, stock: 22, featured: false,
    description: 'All-weather engineered running sneakers built for daily miles and street style. Supportive arch design with breathable knit.',
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'White', stock: 8 }, { size: 'UK 9', color: 'White', stock: 8 },
      { size: 'UK 10', color: 'Grey', stock: 6 }
    ],
    tags: ['shoes', 'running', 'sneakers', 'footwear', 'white']
  },
  {
    name: 'Monochrome Court Low-Top Sneakers', category: 'Footwear', price: 2499, stock: 28, featured: true,
    description: 'Vintage tennis silhouette reworked in full-grain white calf leather with an off-white cupsole. Understated and versatile.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'White', stock: 9 }, { size: 'UK 8', color: 'White', stock: 10 },
      { size: 'UK 9', color: 'White', stock: 9 }
    ],
    tags: ['sneakers', 'shoes', 'court', 'leather', 'white']
  },
  {
    name: 'Premium Italian Suede Loafers', category: 'Footwear', price: 4499, stock: 15, featured: true,
    description: 'Unlined buttery soft suede penny loafers with a flexible Blake stitch leather sole. Slip into effortless sophistication.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Tobacco', stock: 5 }, { size: 'UK 9', color: 'Tobacco', stock: 6 },
      { size: 'UK 10', color: 'Dark Brown', stock: 4 }
    ],
    tags: ['loafers', 'shoes', 'suede', 'formal', 'brown']
  },
  {
    name: 'Classic Leather Chelsea Boots', category: 'Footwear', price: 5299, stock: 16, featured: true,
    description: 'Handcrafted full-grain oiled leather boots with elastic side gussets and pull tabs. Goodyear welted for years of resoleability.',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Black', stock: 5 }, { size: 'UK 9', color: 'Black', stock: 6 },
      { size: 'UK 10', color: 'Black', stock: 5 }
    ],
    tags: ['boots', 'chelsea', 'leather', 'black', 'footwear']
  },
  {
    name: 'TrailGrip Outdoor Runners', category: 'Footwear', price: 3699, stock: 20, featured: false,
    description: 'Rugged all-terrain trail running shoes with Vibram-inspired lugged grip, rock plate protection, and water-repellent ripstop upper.',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Olive', stock: 8 }, { size: 'UK 9', color: 'Olive', stock: 8 },
      { size: 'UK 10', color: 'Black', stock: 4 }
    ],
    tags: ['shoes', 'running', 'trail', 'outdoor', 'sneakers']
  },
  {
    name: 'Minimal Slip-On Mule', category: 'Footwear', price: 1899, stock: 24, featured: false,
    description: 'Contoured cork footbed wrapped in supple vegan leather. Molded arch support for all-day indoor-outdoor ease.',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Sand', stock: 8 }, { size: 'UK 8', color: 'Sand', stock: 8 },
      { size: 'UK 9', color: 'Black', stock: 8 }
    ],
    tags: ['mule', 'slip-on', 'sandals', 'footwear', 'sand']
  },
  {
    name: 'Vintage High-Top Canvas Sneakers', category: 'Footwear', price: 1999, stock: 30, featured: false,
    description: 'Durable 16oz duck canvas high-top with vulcanized rubber toe cap and cushioned ortholite insole.',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Black', stock: 10 }, { size: 'UK 9', color: 'Black', stock: 12 },
      { size: 'UK 10', color: 'Off-White', stock: 8 }
    ],
    tags: ['sneakers', 'high-top', 'canvas', 'black', 'vintage']
  },
  {
    name: 'Ergonomic Slide Sandals', category: 'Footwear', price: 1299, stock: 40, featured: false,
    description: 'Dual-density lightweight EVA slides with deep heel cups and anatomical arch cradles. Waterproof and featherlight.',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Black', stock: 15 }, { size: 'UK 8', color: 'Black', stock: 15 },
      { size: 'UK 9', color: 'Bone', stock: 10 }
    ],
    tags: ['slides', 'sandals', 'summer', 'black', 'eva']
  },
  {
    name: 'Handcrafted Derby Shoes', category: 'Footwear', price: 4899, stock: 14, featured: true,
    description: 'Polished calfskin open-laced Derby with storm welt stitching and stacked leather heels. The gold standard dress shoe.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Black', stock: 5 }, { size: 'UK 9', color: 'Black', stock: 5 },
      { size: 'UK 10', color: 'Chestnut', stock: 4 }
    ],
    tags: ['derby', 'shoes', 'leather', 'formal', 'black']
  },
  {
    name: 'Featherlight Pace Road Runners', category: 'Footwear', price: 2999, stock: 24, featured: false,
    description: 'Weighing under 210g, these road racers feature dual-density nitrogen-infused foam and breathable mono-mesh.',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Charcoal', stock: 8 }, { size: 'UK 9', color: 'Charcoal', stock: 8 },
      { size: 'UK 10', color: 'Blue', stock: 8 }
    ],
    tags: ['shoes', 'running', 'sneakers', 'lightweight', 'road']
  },
  {
    name: 'Urban Explorer Knit Trainers', category: 'Footwear', price: 2699, stock: 20, featured: false,
    description: 'Seamless sock-knit upper that slips on easily. Responsive rubber outsole provides reliable traction on city pavements.',
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Black', stock: 6 }, { size: 'UK 8', color: 'Black', stock: 8 },
      { size: 'UK 9', color: 'Grey', stock: 6 }
    ],
    tags: ['trainers', 'knit', 'sneakers', 'black', 'shoes']
  },
  {
    name: 'Waterproof Hiker Boot', category: 'Footwear', price: 5799, stock: 12, featured: true,
    description: 'GORE-TEX lined nubuck boots with padded leather collar, rustproof speed hooks, and shock-absorbing EVA midsole.',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Brown', stock: 4 }, { size: 'UK 9', color: 'Brown', stock: 5 },
      { size: 'UK 10', color: 'Brown', stock: 3 }
    ],
    tags: ['boots', 'hiking', 'waterproof', 'outdoor', 'brown']
  },
  {
    name: 'Desert Suede Chukka Boots', category: 'Footwear', price: 3899, stock: 18, featured: false,
    description: 'Two-eyelet desert chukkas built on natural crepe soles. Effortlessly dress up or down with chinos or denim.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Sand', stock: 6 }, { size: 'UK 9', color: 'Sand', stock: 6 },
      { size: 'UK 10', color: 'Sand', stock: 6 }
    ],
    tags: ['boots', 'chukka', 'suede', 'sand', 'casual']
  },
  {
    name: 'Retro Tennis Trainer', category: 'Footwear', price: 2299, stock: 26, featured: false,
    description: 'Perforated leather vamp, terry-cloth lining, and gum rubber outsole recreating 80s center-court style.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'White/Navy', stock: 10 }, { size: 'UK 9', color: 'White/Navy', stock: 10 },
      { size: 'UK 10', color: 'White/Navy', stock: 6 }
    ],
    tags: ['sneakers', 'retro', 'tennis', 'white', 'shoes']
  },
  {
    name: 'Cushioned Recovery Slides', category: 'Footwear', price: 1499, stock: 35, featured: false,
    description: 'Maximalist foam slides engineered to speed up post-workout foot recovery and ease joint pressure.',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Oatmeal', stock: 12 }, { size: 'UK 8', color: 'Oatmeal', stock: 12 },
      { size: 'UK 9', color: 'Black', stock: 11 }
    ],
    tags: ['slides', 'recovery', 'comfort', 'sandals', 'shoes']
  },
  {
    name: 'Oxford Brogue Leather Shoes', category: 'Footwear', price: 4699, stock: 15, featured: false,
    description: 'Wingtip brogue detailing with intricate laser perforations. Burnished tan leather with hidden eyelets.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Tan', stock: 5 }, { size: 'UK 9', color: 'Tan', stock: 5 },
      { size: 'UK 10', color: 'Black', stock: 5 }
    ],
    tags: ['oxford', 'brogue', 'formal', 'tan', 'leather']
  },
  {
    name: 'Barefoot Training Sneakers', category: 'Footwear', price: 2899, stock: 20, featured: false,
    description: 'Zero-drop wide toe-box training shoes that foster natural balance and foot strength during gym sessions.',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Black', stock: 7 }, { size: 'UK 9', color: 'Black', stock: 7 },
      { size: 'UK 10', color: 'Black', stock: 6 }
    ],
    tags: ['barefoot', 'training', 'shoes', 'zero-drop', 'sneakers']
  },
  {
    name: 'Woven Leather Summer Mules', category: 'Footwear', price: 2399, stock: 18, featured: false,
    description: 'Intricately handwoven leather upper with backless ease and cushioned insole. Effortless Mediterranean elegance.',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Cognac', stock: 6 }, { size: 'UK 8', color: 'Cognac', stock: 6 },
      { size: 'UK 9', color: 'Black', stock: 6 }
    ],
    tags: ['mule', 'woven', 'leather', 'summer', 'shoes']
  },
  {
    name: 'Velocity Carbon Plate Racers', category: 'Footwear', price: 6499, stock: 10, featured: true,
    description: 'Marathon racing shoes with full-length carbon fiber propulsion plate embedded in supercritical PEBA foam.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Neon/White', stock: 4 }, { size: 'UK 9', color: 'Neon/White', stock: 4 },
      { size: 'UK 10', color: 'Black', stock: 2 }
    ],
    tags: ['shoes', 'running', 'carbon', 'racing', 'marathon']
  },
  {
    name: 'All-Weather Lug Sole Loafer', category: 'Footwear', price: 4199, stock: 15, featured: false,
    description: 'Chunky commando lugged sole paired with a sleek brushed leather moc-toe upper. Bold modern silhouette.',
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 8', color: 'Black', stock: 5 }, { size: 'UK 9', color: 'Black', stock: 5 },
      { size: 'UK 10', color: 'Black', stock: 5 }
    ],
    tags: ['loafer', 'lug-sole', 'chunky', 'black', 'shoes']
  },
  {
    name: 'Everyday Canvas Skate Lows', category: 'Footwear', price: 1699, stock: 32, featured: false,
    description: 'Reinforced suede ollie patch and double-stitched canvas low-top with padded collar for casual street sessions.',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'UK 7', color: 'Black/White', stock: 10 }, { size: 'UK 8', color: 'Black/White', stock: 12 },
      { size: 'UK 9', color: 'Black/White', stock: 10 }
    ],
    tags: ['sneakers', 'skate', 'canvas', 'black', 'shoes']
  },

  // ==========================================
  // CATEGORY 3: ELECTRONICS (22 Products)
  // ==========================================
  {
    name: 'Aurora Tablet Pro 11', category: 'Electronics', price: 42999, stock: 12, featured: true,
    description: 'An 11-inch OLED tablet with an edge-to-edge display, all-day battery, and a laminated anti-glare finish. Creative power in a slim frame.',
    images: [
      'https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&w=940&q=85',
      'https://images.unsplash.com/photo-1778854097052-5a04619c5e64?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: '128GB', color: 'Space Grey', stock: 6 }, { size: '256GB', color: 'Silver', stock: 6 }
    ],
    tags: ['tablet', 'electronics', 'oled', 'touchscreen', 'creative']
  },
  {
    name: 'Leica-Lens Smartphone X', category: 'Electronics', price: 68999, stock: 8, featured: true,
    description: 'Flagship phone with a co-engineered Leica triple camera, titanium body, and a 120Hz display. Photography, redefined.',
    images: [
      'https://images.unsplash.com/photo-1778854097052-5a04619c5e64?crop=entropy&cs=srgb&fm=jpg&w=940&q=85',
      'https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: '256GB', color: 'Titanium', stock: 4 }, { size: '512GB', color: 'Obsidian', stock: 4 }
    ],
    tags: ['phone', 'smartphone', 'camera', 'leica', 'titanium']
  },
  {
    name: 'Workspace Laptop Air 14', category: 'Electronics', price: 74999, stock: 15, featured: true,
    description: 'Ultralight 14-inch laptop with a fanless silicon core, 18-hour battery, and a crisp Retina panel for work anywhere.',
    images: [
      'https://images.unsplash.com/photo-1605629921852-f9b3d997c14a?crop=entropy&cs=srgb&fm=jpg&w=940&q=85',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: '16GB/512GB', color: 'Space Grey', stock: 8 }, { size: '32GB/1TB', color: 'Silver', stock: 7 }
    ],
    tags: ['laptop', 'computer', 'air', 'minimalist', 'workspace']
  },
  {
    name: 'iPad + iPhone Creator Duo', category: 'Electronics', price: 89999, stock: 6, featured: false,
    description: 'The essential creator bundle. Sketch, edit, and publish across a seamless dual-device workflow.',
    images: [
      'https://images.unsplash.com/photo-1572784040789-304f4cdacd62?crop=entropy&cs=srgb&fm=jpg&w=940&q=85',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: 'Bundle', color: 'Midnight', stock: 6 }
    ],
    tags: ['bundle', 'ipad', 'iphone', 'creator', 'apple']
  },
  {
    name: 'ANC Studio Wireless Headphones', category: 'Electronics', price: 12999, stock: 20, featured: true,
    description: 'Over-ear planar magnetic headphones with active hybrid noise cancellation, plush memory foam ear cushions, and 40-hour playtime.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Standard', color: 'Matte Black', stock: 10 }, { size: 'Standard', color: 'Silver Sand', stock: 10 }
    ],
    tags: ['headphones', 'anc', 'wireless', 'audio', 'black']
  },
  {
    name: 'True Wireless Earbuds Pro', category: 'Electronics', price: 5999, stock: 30, featured: false,
    description: 'Custom 11mm dynamic drivers, transparency mode, spatial audio head tracking, and Qi wireless fast-charging case.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'One Size', color: 'White', stock: 15 }, { size: 'One Size', color: 'Black', stock: 15 }
    ],
    tags: ['earbuds', 'wireless', 'audio', 'bluetooth', 'earphones']
  },
  {
    name: 'Minimalist Mechanical Keyboard 75%', category: 'Electronics', price: 6499, stock: 18, featured: true,
    description: 'CNC machined anodized aluminum body with hot-swappable tactile switches, sound dampening silicone gaskets, and PBT dye-sub keycaps.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '75%', color: 'Silver White', stock: 9 }, { size: '75%', color: 'Dark Slate', stock: 9 }
    ],
    tags: ['keyboard', 'mechanical', 'custom', 'desk', 'workspace']
  },
  {
    name: 'Precision Wireless Ergonomic Mouse', category: 'Electronics', price: 3299, stock: 25, featured: false,
    description: 'MagSpeed electromagnetic scroll wheel, 8000 DPI track-anywhere glass sensor, and ergonomic thumb rest for posture support.',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Standard', color: 'Graphite', stock: 15 }, { size: 'Standard', color: 'Pale Grey', stock: 10 }
    ],
    tags: ['mouse', 'ergonomic', 'wireless', 'office', 'computer']
  },
  {
    name: 'Lumina OLED Smartwatch 2', category: 'Electronics', price: 14999, stock: 16, featured: true,
    description: 'Sapphire crystal touchscreen display with ECG heart tracking, sleep analytics, 50m water resistance, and 7-day battery life.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '42mm', color: 'Black Leather', stock: 8 }, { size: '42mm', color: 'Titanium Mesh', stock: 8 }
    ],
    tags: ['watch', 'smartwatch', 'oled', 'fitness', 'black']
  },
  {
    name: 'Ultra-Slim 4K Portable Monitor', category: 'Electronics', price: 18499, stock: 12, featured: false,
    description: '15.6-inch 4K IPS secondary monitor with magnetic origami cover stand. Single cable USB-C power and display.',
    images: [
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1605629921852-f9b3d997c14a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '15.6-inch', color: 'Space Grey', stock: 12 }
    ],
    tags: ['monitor', 'screen', '4k', 'display', 'portable']
  },
  {
    name: 'Desktop Hi-Fi Bookshelf Speakers', category: 'Electronics', price: 9999, stock: 14, featured: true,
    description: 'Acoustic-grade MDF enclosure paired with silk dome tweeters and 4-inch Kevlar woofers. Optical, Bluetooth 5.2, and RCA inputs.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Pair', color: 'Walnut Wood', stock: 7 }, { size: 'Pair', color: 'Matte Black', stock: 7 }
    ],
    tags: ['speakers', 'audio', 'bookshelf', 'sound', 'hifi']
  },
  {
    name: 'Paperwhite Minimal E-Reader', category: 'Electronics', price: 11499, stock: 18, featured: false,
    description: '300 ppi glare-free E-Ink Carta display with warm adjustable backlight and weeks of battery life. Waterproof IPX8.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '16GB', color: 'Black', stock: 10 }, { size: '32GB', color: 'Sage Green', stock: 8 }
    ],
    tags: ['ereader', 'e-ink', 'books', 'reading', 'minimalist']
  },
  {
    name: 'USB-C 100W Fast GaN Charger', category: 'Electronics', price: 2499, stock: 35, featured: false,
    description: 'Compact Gallium Nitride (GaN) fast charger with 3 USB-C and 1 USB-A ports. Powers laptop, phone, and tablet concurrently.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '100W', color: 'Matte Black', stock: 20 }, { size: '100W', color: 'White', stock: 15 }
    ],
    tags: ['charger', 'gan', 'usbc', 'power', 'fast-charging']
  },
  {
    name: 'Aluminium Monitor Light Bar', category: 'Electronics', price: 3799, stock: 22, featured: false,
    description: 'Asymmetrical optical glare-free desk lamp clamping securely atop any computer monitor. Wireless rotating dial control.',
    images: [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Standard', color: 'Space Grey', stock: 22 }
    ],
    tags: ['lightbar', 'lamp', 'desk', 'workspace', 'lighting']
  },
  {
    name: 'Wireless 3-in-1 Charging Stand', category: 'Electronics', price: 2999, stock: 25, featured: false,
    description: 'Weighted brushed zinc base supporting Qi2 magnetic wireless fast charging for phone, earbuds, and smartwatch.',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '3-in-1', color: 'Black', stock: 15 }, { size: '3-in-1', color: 'White', stock: 10 }
    ],
    tags: ['charger', 'wireless', 'dock', 'stand', 'magsafe']
  },
  {
    name: 'Portable Magnetic Power Bank 10k', category: 'Electronics', price: 1999, stock: 30, featured: false,
    description: '10,000mAh slim external battery pack that snaps magnetically to phone backs with integrated folding kickstand.',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '10,000mAh', color: 'Titanium Grey', stock: 20 }, { size: '10,000mAh', color: 'Ivory', stock: 10 }
    ],
    tags: ['powerbank', 'battery', 'portable', 'magsafe', 'charger']
  },
  {
    name: 'USB Studio Condenser Microphone', category: 'Electronics', price: 4999, stock: 16, featured: false,
    description: 'Broadcast-grade 24-bit 96kHz cardioid capsule with zero-latency headphone monitoring and internal pop filter.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'USB-C', color: 'Matte Black', stock: 16 }
    ],
    tags: ['microphone', 'audio', 'podcast', 'streaming', 'studio']
  },
  {
    name: 'Audiophile USB DAC & Amp', category: 'Electronics', price: 6999, stock: 14, featured: false,
    description: 'Dual ESS Sabre ES9038Q2M DAC chips delivering balanced 4.4mm and 3.5mm outputs with pristine harmonic clarity.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Balanced', color: 'Obsidian Black', stock: 14 }
    ],
    tags: ['dac', 'amp', 'audiophile', 'hifi', 'music']
  },
  {
    name: 'Smart Home Ambience Light', category: 'Electronics', price: 2899, stock: 22, featured: false,
    description: 'Frosted glass cordless rechargeable orb offering 16 million colors, candlelight flicker mode, and circadian rhythm sync.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Orb', color: 'Frosted White', stock: 22 }
    ],
    tags: ['lamp', 'smartlight', 'home', 'ambience', 'decor']
  },
  {
    name: 'Smart Digital Voice Recorder', category: 'Electronics', price: 3499, stock: 15, featured: false,
    description: 'Credit-card thin voice recorder with triple MEMS noise-cancelling mics and AI-powered meeting transcription support.',
    images: [
      'https://images.unsplash.com/photo-1572784040789-304f4cdacd62?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1778854097052-5a04619c5e64?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '64GB', color: 'Aluminium Grey', stock: 15 }
    ],
    tags: ['recorder', 'voice', 'audio', 'gadget', 'office']
  },
  {
    name: '4K Ultra HD Streaming Camera', category: 'Electronics', price: 8299, stock: 12, featured: false,
    description: 'Sony STARVIS sensor webcam with AI auto-framing, dual stereo noise-cancelling mics, and HDR low-light correction.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '4K/60fps', color: 'Graphite', stock: 12 }
    ],
    tags: ['camera', 'webcam', '4k', 'streaming', 'video']
  },
  {
    name: 'MagSafe Leather Battery Wallet', category: 'Electronics', price: 2199, stock: 25, featured: false,
    description: 'Sleek Italian top-grain leather cardholder with built-in 3000mAh emergency battery and Find My tracker support.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Universal', color: 'Cognac Brown', stock: 15 }, { size: 'Universal', color: 'Midnight Black', stock: 10 }
    ],
    tags: ['wallet', 'magsafe', 'leather', 'charger', 'battery']
  },

  // ==========================================
  // CATEGORY 4: LIFESTYLE (22 Products)
  // ==========================================
  {
    name: 'Minimal Canvas Tote', category: 'Lifestyle', price: 899, stock: 40, featured: false,
    description: 'Heavyweight organic canvas tote with reinforced straps. Your everyday carry, pared back to the essentials.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.pexels.com/photos/8148587/pexels-photo-8148587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    ],
    variants: [
      { size: 'Standard', color: 'Ecru', stock: 20 }, { size: 'Standard', color: 'Black', stock: 20 }
    ],
    tags: ['bag', 'tote', 'canvas', 'carry', 'lifestyle']
  },
  {
    name: 'Ceramic Pour-Over Set', category: 'Lifestyle', price: 1499, stock: 22, featured: false,
    description: 'Matte ceramic pour-over dripper and carafe. Slow coffee ritual, beautifully engineered.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1773394472792-a3a2f9a85d2e?crop=entropy&cs=srgb&fm=jpg&w=940&q=85'
    ],
    variants: [
      { size: '600ml', color: 'Matte White', stock: 12 }, { size: '600ml', color: 'Charcoal', stock: 10 }
    ],
    tags: ['coffee', 'pour-over', 'ceramic', 'kitchen', 'home']
  },
  {
    name: 'Heavyweight Stoneware Coffee Mug', category: 'Lifestyle', price: 599, stock: 50, featured: false,
    description: 'Thick-walled artisan stoneware mug glazed by hand in earthy speckles. Retains heat and fits comfortably in both palms.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '350ml', color: 'Speckled Oatmeal', stock: 25 }, { size: '350ml', color: 'Matte Black', stock: 25 }
    ],
    tags: ['mug', 'cup', 'coffee', 'ceramic', 'stoneware']
  },
  {
    name: 'Japanese Kyusu Tea Pot', category: 'Lifestyle', price: 1999, stock: 18, featured: true,
    description: 'Side-handled ceramic teapot hand-thrown in Tokoname style. Built-in clay mesh filter designed for whole-leaf green tea.',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '400ml', color: 'Unglazed Clay', stock: 18 }
    ],
    tags: ['tea', 'teapot', 'kyusu', 'ceramic', 'japan']
  },
  {
    name: 'Full-Grain Leather Passport Wallet', category: 'Lifestyle', price: 1799, stock: 25, featured: false,
    description: 'Vegetable-tanned leather travel case holding passport, boarding pass, cash, and 4 cards. Ages into a rich patina.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Passport', color: 'Cognac', stock: 15 }, { size: 'Passport', color: 'Espresso', stock: 10 }
    ],
    tags: ['wallet', 'leather', 'passport', 'travel', 'accessories']
  },
  {
    name: 'Double-Wall Insulated Tumbler', category: 'Lifestyle', price: 1199, stock: 35, featured: false,
    description: '18/8 kitchen-grade stainless steel with vacuum insulation. Keeps drinks piping hot for 8 hours or ice-cold for 24 hours.',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '500ml', color: 'Matte Black', stock: 20 }, { size: '500ml', color: 'Stone Grey', stock: 15 }
    ],
    tags: ['tumbler', 'bottle', 'water', 'insulated', 'travel']
  },
  {
    name: 'Organic Waffle Throw Blanket', category: 'Lifestyle', price: 2499, stock: 20, featured: true,
    description: 'Pre-washed 100% GOTS organic cotton honeycomb waffle weave. Breathable, tactile, and oversized for couch or bed.',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '130x180cm', color: 'Oatmeal', stock: 10 }, { size: '130x180cm', color: 'Olive', stock: 10 }
    ],
    tags: ['blanket', 'throw', 'home', 'cotton', 'waffle']
  },
  {
    name: 'Hand-Poured Soy Amber Candle', category: 'Lifestyle', price: 899, stock: 40, featured: false,
    description: 'Natural soy wax infused with cedarwood, vetiver, and smoky vanilla notes. 50-hour clean burn with cotton wick.',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '250g', color: 'Amber Glass', stock: 40 }
    ],
    tags: ['candle', 'scent', 'home', 'soy', 'aromatherapy']
  },
  {
    name: 'Solid Brass Desk Pen & Holder', category: 'Lifestyle', price: 1299, stock: 22, featured: false,
    description: 'Precision milled solid untreated brass rollerball pen balanced in a heavy circular desktop block.',
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Standard', color: 'Raw Brass', stock: 22 }
    ],
    tags: ['pen', 'brass', 'desk', 'stationery', 'office']
  },
  {
    name: 'Minimalist Concrete Incense Burner', category: 'Lifestyle', price: 699, stock: 35, featured: false,
    description: 'Architectural cast concrete tray with a solid brass sphere holder designed to catch falling ash neatly.',
    images: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Long Tray', color: 'Slate Grey', stock: 35 }
    ],
    tags: ['incense', 'burner', 'concrete', 'home', 'zen']
  },
  {
    name: 'Weekender Waxed Canvas Duffel', category: 'Lifestyle', price: 4499, stock: 15, featured: true,
    description: 'Weather-resistant 18oz paraffin-waxed canvas travel duffel finished with full-grain bridle leather handles and brass zippers.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '45L', color: 'Olive Green', stock: 8 }, { size: '45L', color: 'Field Tan', stock: 7 }
    ],
    tags: ['duffel', 'bag', 'travel', 'weekender', 'canvas']
  },
  {
    name: 'Italian Leather Key Lanyard', category: 'Lifestyle', price: 499, stock: 45, featured: false,
    description: 'Minimalist key loop handcrafted from vegetable-tanned leather with a heavy-duty matte black snap hook.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Keyring', color: 'Natural Tan', stock: 25 }, { size: 'Keyring', color: 'Black', stock: 20 }
    ],
    tags: ['keychain', 'leather', 'lanyard', 'edc', 'accessories']
  },
  {
    name: 'Linen Bedding Pillowcase Pair', category: 'Lifestyle', price: 1399, stock: 25, featured: false,
    description: 'Enveloped-closure pillowcases stone-washed for immediate softness and temperature-regulating breathability.',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Standard Pair', color: 'Flax Natural', stock: 15 }, { size: 'Standard Pair', color: 'Slate Grey', stock: 10 }
    ],
    tags: ['linen', 'pillowcase', 'bedding', 'home', 'sleep']
  },
  {
    name: 'Walnut Wood Watch Stand', category: 'Lifestyle', price: 1099, stock: 20, featured: false,
    description: 'Solid North American walnut base with a padded microfiber cushion to rest your daily timepiece scratch-free.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Single Watch', color: 'Walnut', stock: 20 }
    ],
    tags: ['watch', 'stand', 'walnut', 'wood', 'desk']
  },
  {
    name: 'French Press Borosilicate Brewer', category: 'Lifestyle', price: 1699, stock: 22, featured: false,
    description: 'Heat-resistant borosilicate glass with laser-cut stainless steel micro-filter for rich, sediment-free brew.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '800ml', color: 'Stainless Steel', stock: 22 }
    ],
    tags: ['coffee', 'french-press', 'glass', 'brewer', 'kitchen']
  },
  {
    name: 'Brass Architect Bookmark', category: 'Lifestyle', price: 399, stock: 60, featured: false,
    description: 'Slim spring-brass marker that clips securely over book pages without leaving crease marks.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'One Size', color: 'Polished Brass', stock: 60 }
    ],
    tags: ['bookmark', 'brass', 'book', 'stationery', 'gift']
  },
  {
    name: 'Hand-Blown Borosilicate Glass Carafe', category: 'Lifestyle', price: 1299, stock: 24, featured: false,
    description: 'Minimalist water carafe with matching inverted tumbler cap. Perfectly sized for your bedside nightstand or desk.',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '750ml', color: 'Clear Glass', stock: 24 }
    ],
    tags: ['carafe', 'glass', 'water', 'bedside', 'home']
  },
  {
    name: 'Matte Black Metal Planter & Stand', category: 'Lifestyle', price: 1599, stock: 18, featured: false,
    description: 'Seamless spun iron pot elevated on a slender wireframe tripod stand for monstera and indoor flora.',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Medium (20cm)', color: 'Matte Black', stock: 18 }
    ],
    tags: ['planter', 'plant', 'home', 'decor', 'metal']
  },
  {
    name: 'Travel Watch Storage Roll', category: 'Lifestyle', price: 1899, stock: 20, featured: false,
    description: 'Triple watch travel case structured with slide-out modular cushions and scratch-protective microsuede lining.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '3 Watches', color: 'Smooth Black Leather', stock: 10 }, { size: '3 Watches', color: 'Mocha Suede', stock: 10 }
    ],
    tags: ['watch', 'case', 'travel', 'leather', 'accessories']
  },
  {
    name: 'Wool Felt Laptop Sleeve 14-inch', category: 'Lifestyle', price: 1499, stock: 26, featured: false,
    description: '3mm thick natural German wool felt providing natural water repellency and shock cushioning. Magnetic flap closure.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1605629921852-f9b3d997c14a?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '14-inch', color: 'Anthracite', stock: 16 }, { size: '16-inch', color: 'Anthracite', stock: 10 }
    ],
    tags: ['sleeve', 'laptop', 'felt', 'wool', 'accessories']
  },
  {
    name: 'Minimalist Leather Cardholder', category: 'Lifestyle', price: 799, stock: 40, featured: false,
    description: 'Ultra-thin card case with central cash pocket and 4 exterior card slots. Hand-painted burnished edges.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: 'Slim', color: 'Black', stock: 20 }, { size: 'Slim', color: 'Tan', stock: 20 }
    ],
    tags: ['wallet', 'cardholder', 'leather', 'black', 'slim']
  },
  {
    name: 'Ceramic Aromatherapy Diffuser', category: 'Lifestyle', price: 2199, stock: 18, featured: true,
    description: 'Sculptural stone-matte ceramic ultrasonic essential oil diffuser with ambient warm halo LED glow and auto shut-off.',
    images: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?crop=entropy&cs=srgb&fm=jpg&q=85&w=940',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=srgb&fm=jpg&q=85&w=940'
    ],
    variants: [
      { size: '120ml', color: 'Terracotta', stock: 9 }, { size: '120ml', color: 'Sand White', stock: 9 }
    ],
    tags: ['diffuser', 'aromatherapy', 'home', 'wellness', 'ceramic']
  }
];

module.exports = SEED_PRODUCTS;
