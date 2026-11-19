'use strict';

/**
 * Curated starter drops for instant feed hydration.
 * Ensures the live discovery feed always has vibrant, high-conversion content
 * even if the backend is initializing or has 0 products initially.
 */

const CURATED_STARTER_DROPS = [
  {
    id: 'starter-drop-kalid-01',
    sellerId: 'starter-seller-kalid',
    storeSlug: 'tirimisiyu-kalid-shop',
    storeId: 'starter-store-kalid-01',
    seller: "TIRIMISIYU KALID's Shop",
    avatar: 'T',
    time: '🔥 Hot & Fresh',
    text: 'Ten freshly prepared crispy chicken breast strips served with four sauces — Golden, crunchy, and seasoned with our secret spice blend.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80',
    promoTitle: 'SPECIAL DEAL: ₦10,000 Crispy Strips Feast',
    promoType: 'FESTIVAL_PROMO',
    isFlashSale: false,
    discount: 0,
    dealPrice: 10000,
    audioUrl: null,
    audioTitle: null,
    likes: 4890,
    comments: 72,
    category: 'food',
    originalProduct: {
      id: 'starter-food-chicken-strips-01',
      title: 'Ten freshly prepared crispy chicken breast strips served with four sauces',
      description: 'Ten freshly prepared crispy chicken breast strips served with four signature dipping sauces. Golden-fried to crunchy perfection from premium farm-fresh poultry.',
      price: 10000,
      shippingFee: 1500,
      stock: 50,
      category: 'Food',
      subCategory: 'Fast Food & Dining',
      tags: 'food, chicken, crispy, fast food, dining, strips, meals, sauces, poultry',
      images: [
        { id: 'img-chick-1', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-kalid-01',
        sellerId: 'starter-seller-kalid',
        storeName: "TIRIMISIYU KALID's Shop",
        portfolioSlug: 'tirimisiyu-kalid-shop',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 72 }
    }
  },
  {
    id: 'starter-drop-01',
    sellerId: 'starter-seller-aura',
    storeSlug: 'aura-sound-lab',
    storeId: 'starter-store-aura-01',
    seller: 'Aura Sound Lab',
    avatar: 'A',
    time: '🔥 Flash Deal',
    text: 'Apex Cybernetic ANC Wireless Headphones — Studio-grade spatial audio, beryllium drivers & 45h battery.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    promoTitle: 'FLASH SALE: 15% OFF Apex Headphones',
    promoType: 'FLASH_DEAL',
    isFlashSale: true,
    discount: 15,
    dealPrice: 169.99,
    audioUrl: null,
    audioTitle: null,
    likes: 3840,
    comments: 48,
    category: 'electronics',
    originalProduct: {
      id: 'starter-audio-apex-01',
      title: 'Apex Cybernetic ANC Wireless Headphones',
      description: 'Studio-grade spatial audio with hybrid active noise cancellation, custom 40mm beryllium drivers, and 45-hour ultra-low latency battery.',
      price: 199.99,
      shippingFee: 0,
      stock: 45,
      category: 'Electronics',
      subCategory: 'Audio & Tech',
      tags: 'electronics, audio, headphones, anc, wireless, gadgets',
      images: [
        { id: 'img-audio-1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-aura-01',
        sellerId: 'starter-seller-aura',
        storeName: 'Aura Sound Lab',
        portfolioSlug: 'aura-sound-lab',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 48 }
    }
  },
  {
    id: 'starter-drop-luxe-01',
    sellerId: 'starter-seller-luxe',
    storeSlug: 'luxe-timepieces',
    storeId: 'starter-store-luxe-01',
    seller: 'Luxe Timepieces',
    avatar: 'L',
    time: '🔥 Flash Deal',
    text: 'Samsung Galaxy Watch Ultra Titanium Smartwatch — Super AMOLED display, sapphire crystal & military-grade resilience.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80',
    promoTitle: 'FLASH DEAL: Galaxy Watch Ultra Edition',
    promoType: 'FLASH_DEAL',
    isFlashSale: true,
    discount: 17,
    dealPrice: 249.99,
    audioUrl: null,
    audioTitle: null,
    likes: 4120,
    comments: 56,
    category: 'electronics',
    originalProduct: {
      id: 'starter-watch-galaxy-01',
      title: 'Samsung Galaxy Watch Ultra Titanium Edition',
      description: 'Super AMOLED display, aerospace-grade titanium casing, dual-frequency GPS, 100m water resistance, and advanced wellness biometric sensor suite.',
      price: 299.99,
      shippingFee: 0,
      stock: 25,
      category: 'Electronics',
      subCategory: 'Wearables & Smartwatches',
      tags: 'smartwatch, watch, galaxy, samsung, electronics, luxury, wearables, fitness',
      images: [
        { id: 'img-gw-1', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-luxe-01',
        sellerId: 'starter-seller-luxe',
        storeName: 'Luxe Timepieces',
        portfolioSlug: 'luxe-timepieces',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 56 }
    }
  },
  {
    id: 'starter-drop-solis-01',
    sellerId: 'starter-seller-solis-street',
    storeSlug: 'solis-streetwear',
    storeId: 'starter-store-solis-02',
    seller: 'Solis Streetwear',
    avatar: 'S',
    time: 'Just Dropped',
    text: 'Solis Cyber Heavyweight Graphic Tee — 300GSM custom combed organic cotton with high-density puff print detailing.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    isFlashSale: false,
    discount: 0,
    dealPrice: 65.00,
    audioUrl: null,
    audioTitle: null,
    likes: 3450,
    comments: 41,
    category: 'fashion',
    originalProduct: {
      id: 'starter-streetwear-solis-tee-01',
      title: 'Solis Cyber Heavyweight Graphic Tee',
      description: 'Crafted from 300GSM custom combed organic cotton with high-density puff print detailing and relaxed dropped-shoulder silhouette.',
      price: 65.00,
      shippingFee: 0,
      stock: 60,
      category: 'Fashion',
      subCategory: 'Streetwear & Apparel',
      tags: 'fashion, streetwear, tee, clothing, solis, apparel, oversized, shirt',
      images: [
        { id: 'img-solis-1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-solis-02',
        sellerId: 'starter-seller-solis-street',
        storeName: 'Solis Streetwear',
        portfolioSlug: 'solis-streetwear',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 41 }
    }
  },
  {
    id: 'starter-drop-02',
    sellerId: 'starter-seller-kuro',
    storeSlug: 'kuro-studio',
    storeId: 'starter-store-kuro-02',
    seller: 'Kuro Studio',
    avatar: 'K',
    time: 'Just Dropped',
    text: 'Neo-Tokyo High-Top Sneaker Matrix Edition — Carbon fiber plating, responsive aerodynamic soles, global release.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    isFlashSale: false,
    discount: 0,
    dealPrice: 219.00,
    audioUrl: null,
    audioTitle: null,
    likes: 5120,
    comments: 86,
    category: 'fashion',
    originalProduct: {
      id: 'starter-sneakers-neo-02',
      title: 'Neo-Tokyo High-Top Sneaker Matrix Edition',
      description: 'Constructed with shock-absorbing carbon fiber plating, breathable ballistic mesh, and responsive aerodynamic soles. Limited global release.',
      price: 219.00,
      shippingFee: 0,
      stock: 22,
      category: 'Fashion',
      subCategory: 'Footwear & Streetwear',
      tags: 'sneakers, shoes, kicks, fashion, streetwear, tokyo',
      images: [
        { id: 'img-snk-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-kuro-02',
        sellerId: 'starter-seller-kuro',
        storeName: 'Kuro Studio',
        portfolioSlug: 'kuro-studio',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 86 }
    }
  },
  {
    id: 'starter-drop-03',
    sellerId: 'starter-seller-kuro',
    storeSlug: 'kuro-studio',
    storeId: 'starter-store-kuro-02',
    seller: 'Kuro Studio',
    avatar: 'K',
    time: '🔥 Flash Deal',
    text: 'Obsidian Minimalist Oversized Hoodie — 500GSM organic French terry cotton with dropped shoulders & hidden zip kangaroo pouch.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    promoTitle: 'FLASH DEAL: 20% OFF Obsidian Hoodie',
    promoType: 'FLASH_DEAL',
    isFlashSale: true,
    discount: 20,
    dealPrice: 102.40,
    audioUrl: null,
    audioTitle: null,
    likes: 4210,
    comments: 62,
    category: 'fashion',
    originalProduct: {
      id: 'starter-streetwear-hoodie-03',
      title: 'Obsidian Minimalist Oversized Heavyweight Hoodie',
      description: 'Crafted from 500GSM organic French terry cotton with custom dropped shoulders, reinforced double-needle stitching, and hidden zip kangaroo pouch.',
      price: 128.00,
      shippingFee: 0,
      stock: 35,
      category: 'Fashion',
      subCategory: 'Apparel',
      tags: 'fashion, hoodie, streetwear, apparel, cotton, clothing',
      images: [
        { id: 'img-hoodie-1', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-kuro-02',
        sellerId: 'starter-seller-kuro',
        storeName: 'Kuro Studio',
        portfolioSlug: 'kuro-studio',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 62 }
    }
  },
  {
    id: 'starter-drop-04',
    sellerId: 'starter-seller-chronos',
    storeSlug: 'chronos-horology',
    storeId: 'starter-store-chronos-03',
    seller: 'Chronos Horology',
    avatar: 'C',
    time: 'Just Dropped',
    text: 'Chronos Sapphire Mechanical Field Watch — Precision Japanese automatic movement with 316L stainless steel & sapphire glass.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    isFlashSale: false,
    discount: 0,
    dealPrice: 349.00,
    audioUrl: null,
    audioTitle: null,
    likes: 2950,
    comments: 39,
    category: 'fashion',
    originalProduct: {
      id: 'starter-watch-chronos-04',
      title: 'Chronos Sapphire Mechanical Field Watch',
      description: 'Precision Japanese automatic movement housed in brushed surgical-grade 316L stainless steel with anti-reflective sapphire crystal and quick-release leather strap.',
      price: 349.00,
      shippingFee: 0,
      stock: 14,
      category: 'Fashion',
      subCategory: 'Luxury & Accessories',
      tags: 'fashion, watch, timepiece, luxury, accessories, steel',
      images: [
        { id: 'img-wtc-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-chronos-03',
        sellerId: 'starter-seller-chronos',
        storeName: 'Chronos Horology',
        portfolioSlug: 'chronos-horology',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 39 }
    }
  },
  {
    id: 'starter-drop-05',
    sellerId: 'starter-seller-volt',
    storeSlug: 'volttech-labs',
    storeId: 'starter-store-volt-04',
    seller: 'VoltTech Labs',
    avatar: 'V',
    time: '🔥 Flash Deal',
    text: 'Titanium Mechanical Custom RGB Keyboard — Hot-swappable linear switches, CNC aluminum chassis & PBT dye-sub caps.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    promoTitle: 'FLASH DEAL: 10% OFF Titanium Keyboard',
    promoType: 'FLASH_DEAL',
    isFlashSale: true,
    discount: 10,
    dealPrice: 143.10,
    audioUrl: null,
    audioTitle: null,
    likes: 3620,
    comments: 54,
    category: 'electronics',
    originalProduct: {
      id: 'starter-keyboard-titan-05',
      title: 'Titanium Mechanical Custom RGB Keyboard',
      description: 'Hot-swappable custom lubricated linear switches, solid CNC aluminum chassis, sound-dampening brass weight plate, and PBT dye-sub keycaps.',
      price: 159.00,
      shippingFee: 0,
      stock: 28,
      category: 'Electronics',
      subCategory: 'Gaming Gear',
      tags: 'electronics, keyboard, mechanical, rgb, desk, gaming',
      images: [
        { id: 'img-kb-1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-volt-04',
        sellerId: 'starter-seller-volt',
        storeName: 'VoltTech Labs',
        portfolioSlug: 'volttech-labs',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 54 }
    }
  },
  {
    id: 'starter-drop-06',
    sellerId: 'starter-seller-volt',
    storeSlug: 'volttech-labs',
    storeId: 'starter-store-volt-04',
    seller: 'VoltTech Labs',
    avatar: 'V',
    time: '🔥 Flash Deal',
    text: 'Hyperion 100W GaN Magnetic Fast-Charge Hub — 3x USB-C PD 3.1 ports, intelligent power distribution & foldable MagSafe stand.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
    promoTitle: 'FLASH DEAL: 25% OFF GaN Charger',
    promoType: 'FLASH_DEAL',
    isFlashSale: true,
    discount: 25,
    dealPrice: 66.75,
    audioUrl: null,
    audioTitle: null,
    likes: 3100,
    comments: 42,
    category: 'electronics',
    originalProduct: {
      id: 'starter-tech-charger-07',
      title: 'Hyperion 100W GaN Magnetic Fast-Charge Hub',
      description: 'Next-gen Gallium Nitride fast charger with 3x USB-C PD 3.1 ports, intelligent power distribution, and multi-device foldable MagSafe stand.',
      price: 89.00,
      shippingFee: 0,
      stock: 55,
      category: 'Electronics',
      subCategory: 'Tech Accessories',
      tags: 'electronics, charger, gan, power, tech, usbc',
      images: [
        { id: 'img-chg-1', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-volt-04',
        sellerId: 'starter-seller-volt',
        storeName: 'VoltTech Labs',
        portfolioSlug: 'volttech-labs',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 42 }
    }
  },
  {
    id: 'starter-drop-07',
    sellerId: 'starter-seller-kuro',
    storeSlug: 'kuro-studio',
    storeId: 'starter-store-kuro-02',
    seller: 'Kuro Studio',
    avatar: 'K',
    time: 'Featured Pack',
    text: 'Nomad Weatherproof Magnetic Commuter Pack — Cordura 1000D ballistic nylon with Fidlock magnetic buckle systems & 16-inch laptop chamber.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    isFlashSale: false,
    discount: 0,
    dealPrice: 135.00,
    audioUrl: null,
    audioTitle: null,
    likes: 2280,
    comments: 31,
    category: 'fashion',
    originalProduct: {
      id: 'starter-gear-backpack-06',
      title: 'Nomad Weatherproof Magnetic Commuter Pack',
      description: 'Engineered from Cordura 1000D ballistic nylon with Fidlock magnetic buckle systems, padded 16-inch laptop chamber, and TSA-ready lay-flat design.',
      price: 135.00,
      shippingFee: 0,
      stock: 40,
      category: 'Fashion',
      subCategory: 'Gear & Bags',
      tags: 'fashion, backpack, bag, commuter, travel, waterproof, gear',
      images: [
        { id: 'img-bag-1', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-kuro-02',
        sellerId: 'starter-seller-kuro',
        storeName: 'Kuro Studio',
        portfolioSlug: 'kuro-studio',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 31 }
    }
  },
  {
    id: 'starter-drop-08',
    sellerId: 'starter-seller-aura',
    storeSlug: 'aura-sound-lab',
    storeId: 'starter-store-aura-01',
    seller: 'Aura Sound Lab',
    avatar: 'A',
    time: 'Studio Pro',
    text: 'Quantum Studio Broadcast Condenser Mic — Cardioid polar pattern tuned for rich vocal warmth & zero-latency hardware monitoring.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
    isFlashSale: false,
    discount: 0,
    dealPrice: 169.00,
    audioUrl: null,
    audioTitle: null,
    likes: 1940,
    comments: 27,
    category: 'electronics',
    originalProduct: {
      id: 'starter-audio-mic-08',
      title: 'Quantum Studio Broadcast Condenser Mic',
      description: 'Cardioid polar pattern condenser capsule tuned specifically for rich vocal warmth, background ambient rejection, and zero-latency hardware monitoring.',
      price: 169.00,
      shippingFee: 0,
      stock: 19,
      category: 'Electronics',
      subCategory: 'Audio Gear',
      tags: 'electronics, microphone, studio, audio, podcast, streaming',
      images: [
        { id: 'img-mic-1', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80', isPrimary: true }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-aura-01',
        sellerId: 'starter-seller-aura',
        storeName: 'Aura Sound Lab',
        portfolioSlug: 'aura-sound-lab',
        isVerified: true,
        approvalStatus: 'APPROVED'
      },
      _count: { reviews: 27 }
    }
  }
];

const STARTER_PRODUCTS = CURATED_STARTER_DROPS.map(d => d.originalProduct);

function getFilteredStarterDrops(category = '', search = '') {
  let drops = [...CURATED_STARTER_DROPS];
  const cat = (category || '').toLowerCase().trim();
  const q = (search || '').toLowerCase().trim();

  if (cat && cat !== 'foryou' && cat !== 'trending' && cat !== 'all') {
    if (cat === 'promotions') {
      drops = drops.filter(d => d.isFlashSale);
    } else {
      drops = drops.filter(d => {
        const dCat = (d.category || '').toLowerCase();
        const dText = (d.text || '').toLowerCase();
        const pTags = (d.originalProduct?.tags || '').toLowerCase();
        const pSub = (d.originalProduct?.subCategory || '').toLowerCase();
        return dCat.includes(cat) || dText.includes(cat) || pTags.includes(cat) || pSub.includes(cat);
      });
    }
  }

  if (q) {
    drops = drops.filter(d => {
      const dText = (d.text || '').toLowerCase();
      const dSeller = (d.seller || '').toLowerCase();
      const pTitle = (d.originalProduct?.title || '').toLowerCase();
      const pTags = (d.originalProduct?.tags || '').toLowerCase();
      return dText.includes(q) || dSeller.includes(q) || pTitle.includes(q) || pTags.includes(q);
    });
  }

  // If specific query yielded 0 results, fall back to all drops so feed is never completely blank
  if (drops.length === 0) {
    return CURATED_STARTER_DROPS;
  }

  return drops;
}

module.exports = {
  CURATED_STARTER_DROPS,
  STARTER_PRODUCTS,
  getFilteredStarterDrops
};
