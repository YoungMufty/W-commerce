/**
 * Curated starter drops for instant feed hydration.
 * Ensures the live discovery feed always has vibrant, high-conversion content
 * even if the backend is initializing or has 0 products initially.
 */

export const CURATED_STARTER_DROPS = [
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
      images: [
        { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-aura-01',
        sellerId: 'starter-seller-aura',
        storeName: 'Aura Sound Lab',
        portfolioSlug: 'aura-sound-lab',
        isVerified: true
      },
      _count: { reviews: 48 }
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
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-kuro-02',
        sellerId: 'starter-seller-kuro',
        storeName: 'Kuro Studio',
        portfolioSlug: 'kuro-studio',
        isVerified: true
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
      images: [
        { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-kuro-02',
        sellerId: 'starter-seller-kuro',
        storeName: 'Kuro Studio',
        portfolioSlug: 'kuro-studio',
        isVerified: true
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
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-chronos-03',
        sellerId: 'starter-seller-chronos',
        storeName: 'Chronos Horology',
        portfolioSlug: 'chronos-horology',
        isVerified: true
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
      images: [
        { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-volt-04',
        sellerId: 'starter-seller-volt',
        storeName: 'VoltTech Labs',
        portfolioSlug: 'volttech-labs',
        isVerified: true
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
      images: [
        { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
      store: {
        id: 'starter-store-volt-04',
        sellerId: 'starter-seller-volt',
        storeName: 'VoltTech Labs',
        portfolioSlug: 'volttech-labs',
        isVerified: true
      },
      _count: { reviews: 42 }
    }
  }
];

export function getFilteredStarterDrops(category = '', search = '') {
  let drops = [...CURATED_STARTER_DROPS];
  const cat = (category || '').toLowerCase().trim();
  const q = (search || '').toLowerCase().trim();

  if (cat && cat !== 'foryou' && cat !== 'trending' && cat !== 'all') {
    if (cat === 'promotions') {
      drops = drops.filter(d => d.isFlashSale);
    } else {
      drops = drops.filter(d => (d.category || '').toLowerCase().includes(cat) || (d.text || '').toLowerCase().includes(cat));
    }
  }

  if (q) {
    drops = drops.filter(d => (d.text || '').toLowerCase().includes(q) || (d.seller || '').toLowerCase().includes(q));
  }

  // If specific query yielded 0 results, fall back to the top trending drops so feed is never completely blank
  if (drops.length === 0) {
    return CURATED_STARTER_DROPS;
  }

  return drops;
}
