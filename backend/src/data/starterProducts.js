'use strict';

/**
 * Curated starter products for instant hydration when the remote database is empty or warming up.
 * These ensure /feed, /api/v1/products, /api/v1/products/trending, and flash deals never display
 * an empty "No Drops Yet" screen on fresh deployments.
 */

const STARTER_PRODUCTS = [
  {
    id: 'starter-food-chicken-strips-01',
    title: 'Ten freshly prepared crispy chicken breast strips served with four sauces',
    description: 'Ten freshly prepared crispy chicken breast strips served with four signature dipping sauces. Golden-fried to crunchy perfection from premium farm-fresh poultry.',
    price: 10000,
    shippingFee: 1500,
    stock: 50,
    category: 'Food',
    subCategory: 'Fast Food & Dining',
    sku: 'FOOD-CHK-01',
    tags: 'food, chicken, crispy, fast food, dining, strips, meals, sauces, poultry',
    isFlashSale: false,
    discount: 0,
    dealPrice: 10000,
    rating: 5.0,
    viewCount: 4890,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 1,
    images: [
      { id: 'img-chick-1', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-chick-1', name: 'Sauce Selection', values: ['Garlic Mayo & BBQ', 'Sweet Chili & Ranch', 'Spicy Peri-Peri'] }
    ],
    storeId: 'starter-store-kalid-01',
    store: {
      id: 'starter-store-kalid-01',
      sellerId: 'starter-seller-kalid',
      storeName: "TIRIMISIYU KALID's Shop",
      portfolioSlug: 'tirimisiyu-kalid-shop',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'NG',
      originHub: 'Lagos Hub',
      user: { id: 'starter-seller-kalid', fullName: 'TIRIMISIYU KALID' }
    },
    _count: { reviews: 72 },
    reviews: [
      { rating: 5, comment: 'Crispiest and freshest chicken tenders in town! Sauces were phenomenal.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'starter-watch-galaxy-01',
    title: 'Samsung Galaxy Watch Ultra Titanium Edition',
    description: 'Super AMOLED display, aerospace-grade titanium casing, dual-frequency GPS, 100m water resistance, and advanced wellness biometric sensor suite.',
    price: 299.99,
    shippingFee: 0,
    stock: 25,
    category: 'Electronics',
    subCategory: 'Wearables & Smartwatches',
    sku: 'TECH-GW-01',
    tags: 'smartwatch, watch, galaxy, samsung, electronics, luxury, wearables, fitness',
    isFlashSale: true,
    discount: 17,
    dealPrice: 249.99,
    rating: 4.95,
    viewCount: 4120,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-gw-1', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-gw-1', name: 'Case Color', values: ['Titanium Gray', 'Titanium Silver', 'Titanium White'] }
    ],
    storeId: 'starter-store-luxe-01',
    store: {
      id: 'starter-store-luxe-01',
      sellerId: 'starter-seller-luxe',
      storeName: 'Luxe Timepieces',
      portfolioSlug: 'luxe-timepieces',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'US',
      originHub: 'USA Hub',
      user: { id: 'starter-seller-luxe', fullName: 'Luxe Timepieces Official' }
    },
    _count: { reviews: 56 },
    reviews: [
      { rating: 5, comment: 'Phenomenal battery life and the titanium body feels indestructible.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'starter-streetwear-solis-tee-01',
    title: 'Solis Cyber Heavyweight Graphic Tee',
    description: 'Crafted from 300GSM custom combed organic cotton with high-density puff print detailing and relaxed dropped-shoulder silhouette.',
    price: 65.00,
    shippingFee: 0,
    stock: 60,
    category: 'Fashion',
    subCategory: 'Streetwear & Apparel',
    sku: 'APP-SOLIS-01',
    tags: 'fashion, streetwear, tee, clothing, solis, apparel, oversized, shirt',
    isFlashSale: false,
    discount: 0,
    dealPrice: 65.00,
    rating: 4.88,
    viewCount: 3450,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-solis-1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-solis-1', name: 'Size', values: ['S', 'M', 'L', 'XL'] }
    ],
    storeId: 'starter-store-solis-02',
    store: {
      id: 'starter-store-solis-02',
      sellerId: 'starter-seller-solis-street',
      storeName: 'Solis Streetwear',
      portfolioSlug: 'solis-streetwear',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'US',
      originHub: 'USA Hub',
      user: { id: 'starter-seller-solis-street', fullName: 'Solis Design Lab' }
    },
    _count: { reviews: 41 },
    reviews: [
      { rating: 5, comment: 'Super dense fabric with vivid puff print. Definitely buying another colorway.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'starter-audio-apex-01',
    title: 'Apex Cybernetic ANC Wireless Headphones',
    description: 'Studio-grade spatial audio with hybrid active noise cancellation, custom 40mm beryllium drivers, and 45-hour ultra-low latency battery.',
    price: 199.99,
    shippingFee: 0,
    stock: 45,
    category: 'Electronics',
    subCategory: 'Audio & Tech',
    sku: 'AUDIO-APX-01',
    tags: 'audio, headphones, tech, wireless, anc, premium',
    isFlashSale: true,
    discount: 15,
    dealPrice: 169.99,
    rating: 4.9,
    viewCount: 3840,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-audio-1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
      { id: 'img-audio-2', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80', isPrimary: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-audio-1', name: 'Color', values: ['Matte Black', 'Titanium Silver'] }
    ],
    storeId: 'starter-store-aura-01',
    store: {
      id: 'starter-store-aura-01',
      sellerId: 'starter-seller-aura',
      storeName: 'Aura Sound Lab',
      portfolioSlug: 'aura-sound-lab',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'US',
      originHub: 'USA Hub',
      user: { id: 'starter-seller-aura', fullName: 'Aura Audio Labs' }
    },
    _count: { reviews: 48 },
    reviews: [
      { rating: 5, comment: 'Phenomenal bass clarity and pristine build quality!' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'starter-sneakers-neo-02',
    title: 'Neo-Tokyo High-Top Sneaker Matrix Edition',
    description: 'Constructed with shock-absorbing carbon fiber plating, breathable ballistic mesh, and responsive aerodynamic soles. Limited global release.',
    price: 219.00,
    shippingFee: 0,
    stock: 22,
    category: 'Fashion',
    subCategory: 'Footwear & Streetwear',
    sku: 'SNK-NEO-02',
    tags: 'sneakers, streetwear, shoes, fashion, kicks, tokyo',
    isFlashSale: false,
    discount: 0,
    dealPrice: 219.00,
    rating: 4.95,
    viewCount: 5120,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 3,
    images: [
      { id: 'img-snk-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
      { id: 'img-snk-2', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80', isPrimary: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-snk-1', name: 'Size', values: ['US 9', 'US 10', 'US 11', 'US 12'] }
    ],
    storeId: 'starter-store-kuro-02',
    store: {
      id: 'starter-store-kuro-02',
      sellerId: 'starter-seller-kuro',
      storeName: 'Kuro Studio',
      portfolioSlug: 'kuro-studio',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'JP',
      originHub: 'Asia Hub',
      user: { id: 'starter-seller-kuro', fullName: 'Kuro Design Collective' }
    },
    _count: { reviews: 86 },
    reviews: [
      { rating: 5, comment: 'The silhouette looks even sharper in person. Fits like a glove.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'starter-streetwear-hoodie-03',
    title: 'Obsidian Minimalist Oversized Heavyweight Hoodie',
    description: 'Crafted from 500GSM organic French terry cotton with custom dropped shoulders, reinforced double-needle stitching, and hidden zip kangaroo pouch.',
    price: 128.00,
    shippingFee: 0,
    stock: 35,
    category: 'Fashion',
    subCategory: 'Apparel',
    sku: 'APP-OBS-03',
    tags: 'hoodie, streetwear, apparel, fashion, cotton, black',
    isFlashSale: true,
    discount: 20,
    dealPrice: 102.40,
    rating: 4.88,
    viewCount: 4210,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-hoodie-1', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
      { id: 'img-hoodie-2', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isPrimary: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-hoodie-1', name: 'Size', values: ['S', 'M', 'L', 'XL'] }
    ],
    storeId: 'starter-store-kuro-02',
    store: {
      id: 'starter-store-kuro-02',
      sellerId: 'starter-seller-kuro',
      storeName: 'Kuro Studio',
      portfolioSlug: 'kuro-studio',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'JP',
      originHub: 'Asia Hub',
      user: { id: 'starter-seller-kuro', fullName: 'Kuro Design Collective' }
    },
    _count: { reviews: 62 },
    reviews: [
      { rating: 5, comment: 'Super heavy cotton drape, best hoodie purchase this year.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'starter-watch-chronos-04',
    title: 'Chronos Sapphire Mechanical Field Watch',
    description: 'Precision Japanese automatic movement housed in brushed surgical-grade 316L stainless steel with anti-reflective sapphire crystal and quick-release leather strap.',
    price: 349.00,
    shippingFee: 0,
    stock: 14,
    category: 'Fashion',
    subCategory: 'Luxury & Accessories',
    sku: 'WTC-CHR-04',
    tags: 'watch, timepiece, luxury, accessories, steel, automatic',
    isFlashSale: false,
    discount: 0,
    dealPrice: 349.00,
    rating: 4.96,
    viewCount: 2950,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 3,
    images: [
      { id: 'img-wtc-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
      { id: 'img-wtc-2', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80', isPrimary: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-wtc-1', name: 'Dial Color', values: ['Midnight Blue', 'Matte Black', 'Emerald Green'] }
    ],
    storeId: 'starter-store-chronos-03',
    store: {
      id: 'starter-store-chronos-03',
      sellerId: 'starter-seller-chronos',
      storeName: 'Chronos Horology',
      portfolioSlug: 'chronos-horology',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'GB',
      originHub: 'EU Hub',
      user: { id: 'starter-seller-chronos', fullName: 'Chronos Horology London' }
    },
    _count: { reviews: 39 },
    reviews: [
      { rating: 5, comment: 'Museum grade finishing. Keeps pristine time and looks striking.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: 'starter-keyboard-titan-05',
    title: 'Titanium Mechanical Custom RGB Keyboard',
    description: 'Hot-swappable custom lubricated linear switches, solid CNC aluminum chassis, sound-dampening brass weight plate, and PBT dye-sub keycaps.',
    price: 159.00,
    shippingFee: 0,
    stock: 28,
    category: 'Electronics',
    subCategory: 'Gaming Gear',
    sku: 'TECH-KB-05',
    tags: 'keyboard, gaming, electronics, mechanical, rgb, desk',
    isFlashSale: true,
    discount: 10,
    dealPrice: 143.10,
    rating: 4.91,
    viewCount: 3620,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-kb-1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
      { id: 'img-kb-2', url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80', isPrimary: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-kb-1', name: 'Switch Type', values: ['Linear Red', 'Tactile Brown', 'Clicky Blue'] }
    ],
    storeId: 'starter-store-volt-04',
    store: {
      id: 'starter-store-volt-04',
      sellerId: 'starter-seller-volt',
      storeName: 'VoltTech Labs',
      portfolioSlug: 'volttech-labs',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'US',
      originHub: 'USA Hub',
      user: { id: 'starter-seller-volt', fullName: 'VoltTech Innovation Lab' }
    },
    _count: { reviews: 54 },
    reviews: [
      { rating: 5, comment: 'The sound profile out of the box is incredible. Deep satisfying thock!' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'starter-gear-backpack-06',
    title: 'Nomad Weatherproof Magnetic Commuter Pack',
    description: 'Engineered from Cordura 1000D ballistic nylon with Fidlock magnetic buckle systems, padded 16-inch laptop chamber, and TSA-ready lay-flat design.',
    price: 135.00,
    shippingFee: 0,
    stock: 40,
    category: 'Fashion',
    subCategory: 'Gear & Bags',
    sku: 'BAG-NMD-06',
    tags: 'backpack, bag, commuter, travel, waterproof, gear',
    isFlashSale: false,
    discount: 0,
    dealPrice: 135.00,
    rating: 4.87,
    viewCount: 2280,
    isAdBoosted: false,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-bag-1', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
      { id: 'img-bag-2', url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80', isPrimary: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    options: [
      { id: 'opt-bag-1', name: 'Color', values: ['Stealth Black', 'Olive Drab', 'Slate Grey'] }
    ],
    storeId: 'starter-store-kuro-02',
    store: {
      id: 'starter-store-kuro-02',
      sellerId: 'starter-seller-kuro',
      storeName: 'Kuro Studio',
      portfolioSlug: 'kuro-studio',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'JP',
      originHub: 'Asia Hub',
      user: { id: 'starter-seller-kuro', fullName: 'Kuro Design Collective' }
    },
    _count: { reviews: 31 },
    reviews: [
      { rating: 5, comment: 'Rain beads right off. Best travel companion for tech nomads.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'starter-tech-charger-07',
    title: 'Hyperion 100W GaN Magnetic Fast-Charge Hub',
    description: 'Next-gen Gallium Nitride fast charger with 3x USB-C PD 3.1 ports, intelligent power distribution, and multi-device foldable MagSafe stand.',
    price: 89.00,
    shippingFee: 0,
    stock: 55,
    category: 'Electronics',
    subCategory: 'Tech Accessories',
    sku: 'TECH-CHG-07',
    tags: 'charger, gan, power, tech, electronics, usbc',
    isFlashSale: true,
    discount: 25,
    dealPrice: 66.75,
    rating: 4.92,
    viewCount: 3100,
    isAdBoosted: true,
    isArchived: false,
    estimatedDeliveryDays: 2,
    images: [
      { id: 'img-chg-1', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
    options: [],
    storeId: 'starter-store-volt-04',
    store: {
      id: 'starter-store-volt-04',
      sellerId: 'starter-seller-volt',
      storeName: 'VoltTech Labs',
      portfolioSlug: 'volttech-labs',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'US',
      originHub: 'USA Hub',
      user: { id: 'starter-seller-volt', fullName: 'VoltTech Innovation Lab' }
    },
    _count: { reviews: 42 },
    reviews: [
      { rating: 5, comment: 'Powers my MacBook Pro and iPhone at full speed without warming up.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 'starter-audio-mic-08',
    title: 'Quantum Studio Broadcast Condenser Mic',
    description: 'Cardioid polar pattern condenser capsule tuned specifically for rich vocal warmth, background ambient rejection, and zero-latency hardware monitoring.',
    price: 169.00,
    shippingFee: 0,
    stock: 19,
    category: 'Electronics',
    subCategory: 'Audio Gear',
    sku: 'AUD-MIC-08',
    tags: 'microphone, studio, audio, podcast, streaming, voice',
    isFlashSale: false,
    discount: 0,
    dealPrice: 169.00,
    rating: 4.89,
    viewCount: 1940,
    isAdBoosted: false,
    isArchived: false,
    estimatedDeliveryDays: 3,
    images: [
      { id: 'img-mic-1', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
    options: [],
    storeId: 'starter-store-aura-01',
    store: {
      id: 'starter-store-aura-01',
      sellerId: 'starter-seller-aura',
      storeName: 'Aura Sound Lab',
      portfolioSlug: 'aura-sound-lab',
      isVerified: true,
      approvalStatus: 'APPROVED',
      country: 'US',
      originHub: 'USA Hub',
      user: { id: 'starter-seller-aura', fullName: 'Aura Audio Labs' }
    },
    _count: { reviews: 27 },
    reviews: [
      { rating: 5, comment: 'Crystal clear vocals, podcast listeners immediately noticed the jump in clarity.' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString()
  }
];

/**
 * Filter starter products based on query parameters.
 */
function getFilteredStarterProducts(query = {}) {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    origin,
    format,
    sort,
    limit = 20,
    page = 1,
    isFlashSale
  } = query;

  let filtered = [...STARTER_PRODUCTS];

  // 1. Flash sale filter
  if (isFlashSale === true || format === 'flash') {
    filtered = filtered.filter(p => p.isFlashSale);
  }

  // 2. Category filter
  if (category && category !== 'all' && category !== 'All Items' && category !== 'foryou') {
    const cats = String(category).toLowerCase().split(',').map(c => c.trim());
    filtered = filtered.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subCategory || '').toLowerCase();
      const pTags = (p.tags || '').toLowerCase();
      return cats.some(c => pCat.includes(c) || pSub.includes(c) || pTags.includes(c));
    });
  }

  // 3. Search query
  if (search) {
    const q = String(search).toLowerCase().trim();
    filtered = filtered.filter(p => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.toLowerCase().includes(q)) ||
        (p.store && p.store.storeName.toLowerCase().includes(q))
      );
    });
  }

  // 4. Price range
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  // 5. Sorting
  if (sort) {
    const s = String(sort).toLowerCase();
    if (s.includes('low') || s.includes('asc')) {
      filtered.sort((a, b) => a.price - b.price);
    } else if (s.includes('high') || s.includes('desc')) {
      filtered.sort((a, b) => b.price - a.price);
    } else if (s.includes('popular') || s.includes('view') || s.includes('trend')) {
      filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (s.includes('rating')) {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  } else {
    // Default: trending/popular first
    filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  }

  const total = filtered.length;
  const numLimit = Math.max(1, parseInt(limit) || 20);
  const numPage = Math.max(1, parseInt(page) || 1);
  const skip = (numPage - 1) * numLimit;
  const paginated = filtered.slice(skip, skip + numLimit);

  return {
    products: paginated,
    total,
    pages: Math.ceil(total / numLimit) || 1,
    page: numPage
  };
}

/**
 * Starter flash deals matching flashDeal schema
 */
const STARTER_FLASH_DEALS = STARTER_PRODUCTS.filter(p => p.isFlashSale).map((product, idx) => {
  const originalPrice = product.price;
  const discount = product.discount || 20;
  const dealPrice = product.dealPrice || Number((originalPrice * (1 - discount / 100)).toFixed(2));
  const endDate = new Date(Date.now() + 86400000 * 2).toISOString();

  return {
    id: `starter-flash-deal-0${idx + 1}`,
    productId: product.id,
    promoTitle: `EXCLUSIVE DROP: ${product.title}`,
    promoType: 'FLASH_DEAL',
    discount,
    originalPrice,
    dealPrice,
    startDate: new Date(Date.now() - 3600000).toISOString(),
    endDate,
    maxStock: product.stock,
    soldCount: 7 + idx * 3,
    stockLeft: product.stock - (7 + idx * 3),
    timeLeft: 86400000 * 2,
    countdownText: 'Ends in 48h 0m',
    isExpiringSoon: false,
    isActive: true,
    bannerImage: product.imageUrl,
    product: {
      ...product,
      store: product.store,
      images: product.images,
      reviews: [{ rating: 5 }]
    }
  };
});

module.exports = {
  STARTER_PRODUCTS,
  STARTER_FLASH_DEALS,
  getFilteredStarterProducts
};
