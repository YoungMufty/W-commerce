'use strict';

/**
 * Curated Starter & Mock Sellers
 * Ensures public seller profile and storefront routes (/seller/:id, /store/:slug, /stores/:id)
 * render cleanly with rich data for demo and starter catalog accounts without hitting 500s.
 */

const STARTER_SELLERS = [
  {
    id: 'starter-seller-aura',
    name: 'Aura Audio Labs',
    avatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    isVerified: true,
    joinedAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    followers: 1250,
    stats: {
      rating: 4.9,
      reviewCount: 75,
      orderCount: 1420,
      productsCount: 6,
      responseRate: 99,
      onTimeRate: 98
    },
    store: {
      id: 'starter-store-aura-01',
      sellerId: 'starter-seller-aura',
      name: 'Aura Sound Lab',
      storeName: 'Aura Sound Lab',
      slug: 'aura-sound-lab',
      portfolioSlug: 'aura-sound-lab',
      description: 'Studio-grade spatial audio, beryllium drivers & cutting-edge acoustics.',
      bio: 'Aura Sound Lab crafts acoustic hardware for audiophiles, producers, and sonic purists. Engineered in California with precision drivers and aerospace-grade materials.',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      banner: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&q=80',
      country: 'United States',
      category: 'Electronics',
      isVerified: true,
      productsCount: 6,
      sellerTier: 'PRO',
      subscriptionTier: 'PRO',
      approvalStatus: 'APPROVED',
      averageRating: 4.9,
      totalReviews: 75,
      topProducts: [
        {
          id: 'starter-audio-apex-01',
          title: 'Apex Cybernetic ANC Wireless Headphones',
          price: 169.99,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
          description: 'Custom 40mm beryllium drivers, 45dB hybrid ANC, 40-hour ultra battery.'
        },
        {
          id: 'starter-audio-mic-08',
          title: 'Quantum Studio Broadcast Condenser Mic',
          price: 169.00,
          imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
          description: 'Gold-sputtered capsule, zero-latency direct monitoring & XLR/USB dual output.'
        },
        {
          id: 'starter-audio-monitor-03',
          title: 'Aura Studio Nearfield Reference Monitors',
          price: 289.00,
          imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
          description: 'Class-D bi-amplified studio acoustic monitors with flat frequency response.'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 180).toISOString()
    }
  },
  {
    id: 'starter-seller-solis-streetwear',
    name: 'Solis Streetwear Collective',
    avatar: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    isVerified: true,
    joinedAt: new Date(Date.now() - 86400000 * 160).toISOString(),
    followers: 1890,
    stats: {
      rating: 4.95,
      reviewCount: 88,
      orderCount: 1650,
      productsCount: 5,
      responseRate: 99,
      onTimeRate: 98
    },
    store: {
      id: 'starter-store-solis-02',
      sellerId: 'starter-seller-solis-streetwear',
      name: 'Solis Streetwear',
      storeName: 'Solis Streetwear',
      slug: 'solis-streetwear',
      portfolioSlug: 'solis-streetwear',
      description: 'High-concept utilitarian streetwear, heavy cotton silhouettes and modern techwear.',
      bio: 'Solis Streetwear bridges elevated minimalist tailoring with aggressive utilitarian cuts. Designed for fluid movement in metropolitan landscapes.',
      logo: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      banner: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=80',
      country: 'United Kingdom',
      category: 'Streetwear & Fashion',
      isVerified: true,
      productsCount: 5,
      sellerTier: 'PRO',
      subscriptionTier: 'PRO',
      approvalStatus: 'APPROVED',
      averageRating: 4.95,
      totalReviews: 88,
      topProducts: [
        {
          id: 'starter-solis-hoodie-01',
          title: 'Heavyweight Fleece Boxy Minimalist Hoodie',
          price: 110.00,
          imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
          description: '500 GSM loopback French terry with relaxed drop-shoulder drape.'
        },
        {
          id: 'starter-solis-cargo-02',
          title: 'Modular Tactical Cargo Joggers',
          price: 125.00,
          imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
          description: 'DWR water-resistant nylon shell with magnetic quick-release pockets.'
        },
        {
          id: 'starter-solis-jacket-03',
          title: 'Stormproof Ripstop Overshirt Jacket',
          price: 145.00,
          imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
          description: 'Lightweight weather-sealed commuter jacket with concealed zip vents.'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 160).toISOString()
    }
  },
  {
    id: 'starter-seller-solis',
    name: 'Solis Botanical Atelier',
    avatar: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
    isVerified: true,
    joinedAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    followers: 980,
    stats: {
      rating: 4.94,
      reviewCount: 52,
      orderCount: 920,
      productsCount: 4,
      responseRate: 98,
      onTimeRate: 99
    },
    store: {
      id: 'starter-store-solis-05',
      sellerId: 'starter-seller-solis',
      name: 'Solis Botanicals',
      storeName: 'Solis Botanicals',
      slug: 'solis-botanicals',
      portfolioSlug: 'solis-botanicals',
      description: 'Artisanal organic skincare, botanical extracts, and sustainable wellness essentials.',
      bio: 'Solis Botanicals crafts small-batch organic skincare, ethically wild-harvested botanicals, and cold-pressed elixirs for revitalizing daily self-care rituals.',
      logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      banner: 'https://images.unsplash.com/photo-1608248597359-04d80a373ff2?auto=format&fit=crop&w=1600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1608248597359-04d80a373ff2?auto=format&fit=crop&w=1600&q=80',
      country: 'France',
      category: 'Beauty & Wellness',
      isVerified: true,
      productsCount: 4,
      sellerTier: 'PRO',
      subscriptionTier: 'PRO',
      approvalStatus: 'APPROVED',
      averageRating: 4.94,
      totalReviews: 52,
      topProducts: [
        {
          id: 'starter-skincare-serum-09',
          title: 'Solar Radiance Antioxidant Vitamin C Serum',
          price: 48.00,
          imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
          description: '15% pure L-ascorbic acid with ferulic acid and botanical squalane.'
        },
        {
          id: 'starter-skincare-oil-10',
          title: 'Midnight Bloom Restorative Facial Elixir',
          price: 62.00,
          imageUrl: 'https://images.unsplash.com/photo-1608248597359-04d80a373ff2?auto=format&fit=crop&w=1000&q=80',
          description: 'Cold-pressed blue tansy and evening primrose rejuvenating night oil.'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 120).toISOString()
    }
  },
  {
    id: 'starter-seller-kuro',
    name: 'Kuro Design Collective',
    avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    isVerified: true,
    joinedAt: new Date(Date.now() - 86400000 * 240).toISOString(),
    followers: 3420,
    stats: {
      rating: 4.95,
      reviewCount: 179,
      orderCount: 2310,
      productsCount: 8,
      responseRate: 98,
      onTimeRate: 97
    },
    store: {
      id: 'starter-store-kuro-02',
      sellerId: 'starter-seller-kuro',
      name: 'Kuro Studio',
      storeName: 'Kuro Studio',
      slug: 'kuro-studio',
      portfolioSlug: 'kuro-studio',
      description: 'Avant-garde Tokyo streetwear, technical apparel and aerodynamic footwear.',
      bio: 'Kuro Studio merges brutalist minimalism with technical high-performance textiles. Inspired by the cyber-streets of Neo-Tokyo.',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      banner: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=80',
      country: 'Japan',
      category: 'Fashion',
      isVerified: true,
      productsCount: 8,
      sellerTier: 'PRO',
      subscriptionTier: 'PRO',
      approvalStatus: 'APPROVED',
      averageRating: 4.95,
      totalReviews: 179,
      topProducts: [
        {
          id: 'starter-sneakers-neo-02',
          title: 'Neo-Tokyo High-Top Sneaker Matrix Edition',
          price: 219.00,
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
          description: 'Sculpted carbon fiber plate with responsive shock-absorption cushioning.'
        },
        {
          id: 'starter-streetwear-hoodie-03',
          title: 'Obsidian Minimalist Oversized Heavyweight Hoodie',
          price: 102.40,
          imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
          description: 'Double-layered hood with ergonomic seam construction and tonal embroidery.'
        },
        {
          id: 'starter-gear-backpack-06',
          title: 'Nomad Weatherproof Magnetic Commuter Pack',
          price: 135.00,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
          description: 'Fidlock magnetic buckles, ballistic nylon and waterproof YKK zippers.'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 240).toISOString()
    }
  },
  {
    id: 'starter-seller-chronos',
    name: 'Chronos Horology London',
    avatar: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    isVerified: true,
    joinedAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    followers: 890,
    stats: {
      rating: 4.96,
      reviewCount: 39,
      orderCount: 480,
      productsCount: 3,
      responseRate: 100,
      onTimeRate: 100
    },
    store: {
      id: 'starter-store-chronos-03',
      sellerId: 'starter-seller-chronos',
      name: 'Chronos Horology',
      storeName: 'Chronos Horology',
      slug: 'chronos-horology',
      portfolioSlug: 'chronos-horology',
      description: 'Precision Japanese mechanical field watches crafted with surgical stainless steel.',
      bio: 'Independent British horology studio blending classical watchmaking aesthetics with contemporary Japanese automatic calibers.',
      logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      banner: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=80',
      country: 'United Kingdom',
      category: 'Luxury & Watches',
      isVerified: true,
      productsCount: 3,
      sellerTier: 'PRO',
      subscriptionTier: 'PRO',
      approvalStatus: 'APPROVED',
      averageRating: 4.96,
      totalReviews: 39,
      topProducts: [
        {
          id: 'starter-watch-chronos-04',
          title: 'Chronos Sapphire Mechanical Field Watch',
          price: 349.00,
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
          description: 'Anti-reflective sapphire crystal, 200m water resistance, automatic caliber.'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 300).toISOString()
    }
  },
  {
    id: 'starter-seller-volt',
    name: 'VoltTech Innovation Lab',
    avatar: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    isVerified: true,
    joinedAt: new Date(Date.now() - 86400000 * 150).toISOString(),
    followers: 2100,
    stats: {
      rating: 4.92,
      reviewCount: 96,
      orderCount: 1850,
      productsCount: 5,
      responseRate: 97,
      onTimeRate: 98
    },
    store: {
      id: 'starter-store-volt-04',
      sellerId: 'starter-seller-volt',
      name: 'VoltTech Labs',
      storeName: 'VoltTech Labs',
      slug: 'volttech-labs',
      portfolioSlug: 'volttech-labs',
      description: 'Next-generation custom mechanical peripherals, GaN charging stations and desk tech.',
      bio: 'Engineering high-throughput workspace hardware, precision machined keyboards, and ultra-dense Gallium Nitride power systems.',
      logo: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      banner: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=80',
      country: 'United States',
      category: 'Electronics & Computing',
      isVerified: true,
      productsCount: 5,
      sellerTier: 'PRO',
      subscriptionTier: 'PRO',
      approvalStatus: 'APPROVED',
      averageRating: 4.92,
      totalReviews: 96,
      topProducts: [
        {
          id: 'starter-keyboard-titan-05',
          title: 'Titanium Mechanical Custom RGB Keyboard',
          price: 143.10,
          imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
          description: 'CNC anodized chassis, hot-swappable lubed switches, sound-dampening foam.'
        },
        {
          id: 'starter-tech-charger-07',
          title: 'Hyperion 100W GaN Magnetic Fast-Charge Hub',
          price: 66.75,
          imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
          description: 'Quad-port Gallium Nitride fast charger with intelligent power allocation.'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 150).toISOString()
    }
  }
];

/**
 * Common slug aliases to resolve shorthand paths
 */
const ALIAS_MAP = {
  'solis': 'solis-streetwear',
  'solis-street': 'solis-streetwear',
  'solis-streetwear-collective': 'solis-streetwear',
  'aura': 'aura-sound-lab',
  'aura-audio': 'aura-sound-lab',
  'aura-audio-labs': 'aura-sound-lab',
  'kuro': 'kuro-studio',
  'chronos': 'chronos-horology',
  'volt': 'volttech-labs',
  'volttech': 'volttech-labs'
};

/**
 * Normalizes input key for matching.
 */
function normalizeKey(str) {
  if (!str) return '';
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Searches for a starter seller by seller ID, store ID, store slug, or name.
 */
function findStarterSeller(idOrSlug) {
  if (!idOrSlug) return null;
  const rawKey = normalizeKey(idOrSlug);
  const key = ALIAS_MAP[rawKey] || rawKey;

  // 1. Direct match in curated starter sellers
  const matched = STARTER_SELLERS.find(s => {
    return (
      normalizeKey(s.id) === key ||
      normalizeKey(s.id) === rawKey ||
      normalizeKey(s.name) === key ||
      normalizeKey(s.name) === rawKey ||
      (s.store && (
        normalizeKey(s.store.id) === key ||
        normalizeKey(s.store.id) === rawKey ||
        normalizeKey(s.store.slug) === key ||
        normalizeKey(s.store.slug) === rawKey ||
        normalizeKey(s.store.portfolioSlug) === key ||
        normalizeKey(s.store.portfolioSlug) === rawKey ||
        normalizeKey(s.store.name) === key ||
        normalizeKey(s.store.name) === rawKey
      ))
    );
  });

  if (matched) return matched;

  // 2. Dynamic generation for any starter-seller-* or starter-store-* identifiers
  if (key.startsWith('starter-seller-') || key.startsWith('starter-store-') || key.startsWith('starter-')) {
    const rawTag = key.replace(/^starter-(seller|store)-?/, '') || 'merchant';
    const capitalizedName = rawTag
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    return {
      id: key.startsWith('starter-seller-') ? key : `starter-seller-${rawTag}`,
      name: `${capitalizedName} Official`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=80',
      isVerified: true,
      joinedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
      followers: 650,
      stats: {
        rating: 4.9,
        reviewCount: 38,
        orderCount: 520,
        productsCount: 3,
        responseRate: 98,
        onTimeRate: 99
      },
      store: {
        id: key.startsWith('starter-store-') ? key : `starter-store-${rawTag}-01`,
        sellerId: key.startsWith('starter-seller-') ? key : `starter-seller-${rawTag}`,
        name: `${capitalizedName} Store`,
        storeName: `${capitalizedName} Store`,
        slug: rawTag,
        portfolioSlug: rawTag,
        description: `Official verified store for ${capitalizedName}. Curated premium products with fast global delivery.`,
        bio: `Welcome to ${capitalizedName}. We specialize in carefully curated high quality goods backed by our 100% satisfaction guarantee.`,
        logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=80',
        logoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=80',
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
        country: 'Global',
        category: 'General',
        isVerified: true,
        productsCount: 3,
        sellerTier: 'PRO',
        subscriptionTier: 'PRO',
        approvalStatus: 'APPROVED',
        averageRating: 4.9,
        totalReviews: 38,
        topProducts: [
          {
            id: `starter-item-${rawTag}-01`,
            title: `${capitalizedName} Signature Edition`,
            price: 99.00,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
            description: `Exclusive handcrafted product from ${capitalizedName}.`
          }
        ],
        createdAt: new Date(Date.now() - 86400000 * 90).toISOString()
      }
    };
  }

  return null;
}

/**
 * Returns response payload formatted for sellerController.getSellerProfile
 */
function getStarterSellerProfileResponse(idOrSlug) {
  const seller = findStarterSeller(idOrSlug);
  if (!seller) return null;

  return {
    success: true,
    seller: {
      id: seller.id,
      name: seller.name,
      avatar: seller.avatar,
      isVerified: seller.isVerified,
      joinedAt: seller.joinedAt,
      followers: seller.followers,
      stats: {
        rating: seller.stats.rating,
        reviewCount: seller.stats.reviewCount,
        orderCount: seller.stats.orderCount,
        productsCount: seller.stats.productsCount,
        responseRate: seller.stats.responseRate,
        onTimeRate: seller.stats.onTimeRate
      },
      store: seller.store ? {
        id: seller.store.id,
        name: seller.store.name,
        slug: seller.store.slug,
        description: seller.store.description,
        bio: seller.store.bio,
        logo: seller.store.logo,
        country: seller.store.country,
        category: seller.store.category,
        isVerified: seller.store.isVerified,
        productsCount: seller.store.productsCount,
        topProducts: seller.store.topProducts,
        createdAt: seller.store.createdAt
      } : null
    }
  };
}

/**
 * Returns response payload formatted for storeController.getStoreBySlug and getStoreById
 */
function getStarterStoreResponse(idOrSlug) {
  const seller = findStarterSeller(idOrSlug);
  if (!seller || !seller.store) return null;

  const store = seller.store;
  const products = (store.topProducts || []).map(p => ({
    id: p.id,
    title: p.title,
    name: p.title,
    price: Number(p.price) || 99,
    description: p.description || p.title,
    imageUrl: p.imageUrl,
    images: [{ url: p.imageUrl }],
    rating: 4.9,
    soldCount: 42,
    stock: 50,
    isArchived: false
  }));

  const storePayload = {
    id: store.id,
    storeId: store.id,
    sellerId: seller.id,
    slug: store.slug,
    portfolioSlug: store.portfolioSlug || store.slug,
    name: store.name,
    storeName: store.name,
    logo: store.logo,
    logoUrl: store.logo,
    banner: store.banner,
    bannerUrl: store.banner,
    description: store.description,
    bio: store.bio || store.description,
    verification: store.isVerified,
    isVerified: store.isVerified,
    country: store.country,
    averageRating: seller.stats.rating,
    totalReviews: seller.stats.reviewCount,
    subscriptionTier: store.subscriptionTier || 'PRO',
    sellerTier: store.sellerTier || 'PRO',
    banningRate: 0,
    productsCount: store.productsCount || products.length
  };

  const sellerPayload = {
    id: seller.id,
    name: seller.name,
    avatar: seller.avatar,
    verified: seller.isVerified
  };

  const metricsPayload = {
    followers: seller.followers,
    likes: Math.round(seller.followers * 1.5),
    products: store.productsCount || products.length,
    rating: seller.stats.rating,
    reviews: seller.stats.reviewCount,
    banningRate: 0
  };

  const portfolioPayload = {
    theme: 'Aura Modern',
    customCss: '',
    sections: [],
    banners: [
      {
        id: 'banner-01',
        title: store.name,
        subtitle: store.description,
        imageUrl: store.banner
      }
    ],
    layout: 'Modern',
    configuration: {}
  };

  return {
    success: true,
    data: {
      isExternalShowcase: false,
      store: storePayload,
      seller: sellerPayload,
      metrics: metricsPayload,
      products,
      posts: [],
      brandConfig: {},
      portfolio: portfolioPayload,
      isFollowing: false
    },
    // Top-level store property for endpoints that read res.data.store directly
    store: {
      ...storePayload,
      products,
      user: {
        id: seller.id,
        fullName: seller.name,
        avatarUrl: seller.avatar,
        isVerified: seller.isVerified
      }
    }
  };
}

/**
 * Returns member public profile payload for userController.getMemberProfile
 */
function getStarterMemberProfileResponse(idOrSlug) {
  const seller = findStarterSeller(idOrSlug);
  if (!seller) return null;

  return {
    success: true,
    user: {
      id: seller.id,
      fullName: seller.name,
      avatarUrl: seller.avatar,
      role: 'SELLER',
      isVerified: seller.isVerified,
      storeName: seller.store?.name || null,
      rating: seller.stats.rating || 5.0,
      country: seller.store?.country || 'US',
      email: `${normalizeKey(seller.id)}@w-commerce.internal`,
      phone: null,
      address: null,
      createdAt: seller.joinedAt,
      stats: {
        productsCount: seller.stats.productsCount,
        ordersCount: seller.stats.orderCount,
        reviewsCount: seller.stats.reviewCount
      }
    }
  };
}

module.exports = {
  STARTER_SELLERS,
  findStarterSeller,
  getStarterSellerProfileResponse,
  getStarterStoreResponse,
  getStarterMemberProfileResponse
};