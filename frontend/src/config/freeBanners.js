// Comprehensive Free Banners Catalog across all Store Categories
// royalty-free high-resolution banners curated for WhatsApp & online storefronts

export const BANNER_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', emoji: '🍔', desc: 'Restaurants, burgers, pizza, cafes & fresh groceries', tags: ['All', 'Burgers', 'Pizza', 'Fast Food', 'Bakery', 'BBQ', 'Sushi', 'Groceries'] },
  { id: 'fashion', name: 'Fashion & Apparel', emoji: '👗', desc: 'Clothing, streetwear, footwear & luxury boutique', tags: ['All', 'Streetwear', 'Boutique', 'Summer', 'Shoes', 'Denim', 'Luxury'] },
  { id: 'electronics', name: 'Electronics & Tech', emoji: '💻', desc: 'Smartphones, audio, laptops & smart gadgets', tags: ['All', 'Phones', 'Audio', 'Laptops', 'Gaming Tech', 'Smart Home'] },
  { id: 'beauty', name: 'Beauty & Cosmetics', emoji: '💄', desc: 'Skincare, makeup, botanical spa & perfumes', tags: ['All', 'Skincare', 'Makeup', 'Spa', 'Fragrance', 'Organic'] },
  { id: 'gaming', name: 'Gaming & Esports', emoji: '🎮', desc: 'Consoles, RGB setups, PC gaming & arcade', tags: ['All', 'RGB Setup', 'Esports', 'Arcade', 'Cyberpunk', 'Consoles'] },
  { id: 'home', name: 'Home & Living', emoji: '🏠', desc: 'Modern interior, furniture, kitchenware & decor', tags: ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Plants', 'Modern'] },
  { id: 'sports', name: 'Sports & Fitness', emoji: '⚽', desc: 'Gym equipment, athletics, yoga & activewear', tags: ['All', 'Gym', 'Running', 'Yoga', 'Athletics', 'Nutrition'] },
  { id: 'books', name: 'Books & Stationery', emoji: '📚', desc: 'Bookstores, journals, education & art supplies', tags: ['All', 'Library', 'Journals', 'Study', 'Art Supplies'] },
  { id: 'toys', name: 'Toys & Kids', emoji: '🧸', desc: 'Toys, baby care, games & playful kids world', tags: ['All', 'Lego', 'Plush', 'Baby', 'Games', 'Creative'] },
  { id: 'jewelry', name: 'Jewelry & Luxury', emoji: '💍', desc: 'Diamonds, gold, chronograph watches & accessories', tags: ['All', 'Diamonds', 'Gold', 'Watches', 'Necklaces', 'Luxury'] },
  { id: 'health', name: 'Health & Wellness', emoji: '💊', desc: 'Vitamins, supplements, natural herbs & medicine', tags: ['All', 'Vitamins', 'Herbal', 'Nutrition', 'Pharmacy'] },
  { id: 'auto', name: 'Automotive & Motors', emoji: '🚗', desc: 'Cars, detailing, motorbikes & performance parts', tags: ['All', 'Supercars', 'Detailing', 'Bikes', 'Parts'] },
  { id: 'pets', name: 'Pets & Animal Care', emoji: '🐾', desc: 'Dogs, cats, pet food & animal accessories', tags: ['All', 'Dogs', 'Cats', 'Pet Food', 'Accessories'] },
  { id: 'coffee', name: 'Cafe & Bakery', emoji: '☕', desc: 'Artisan espresso, pastries, croissants & sweets', tags: ['All', 'Coffee', 'Croissants', 'Cafe', 'Pastries'] }
];

export const EXTERNAL_BANNER_SITES = [
  {
    name: 'Freepik / Magnific',
    badge: 'Popular Stock',
    icon: 'sparkles',
    desc: 'Millions of free food, store banners and marketing vectors',
    getUrl: (catSlug) => `https://www.freepik.com/free-photos-vectors/${catSlug}-banner`
  },
  {
    name: 'Unsplash Store Banners',
    badge: 'Free HD',
    icon: 'camera',
    desc: 'High-resolution commercial-friendly storefront photography',
    getUrl: (catSlug) => `https://unsplash.com/s/photos/${catSlug}-banner`
  },
  {
    name: 'Pexels Banner Library',
    badge: '100% Free',
    icon: 'image',
    desc: 'Curated free stock photos and banner graphics',
    getUrl: (catSlug) => `https://www.pexels.com/search/${encodeURIComponent(catSlug + ' banner')}/`
  },
  {
    name: 'Pixabay Vectors & Art',
    badge: 'Royalty Free',
    icon: 'compass',
    desc: 'Vibrant royalty-free illustrations, vectors and banners',
    getUrl: (catSlug) => `https://pixabay.com/images/search/${encodeURIComponent(catSlug + ' banner')}/`
  }
];

export const FREE_BANNERS = [
  // ── FOOD & DINING ──────────────────────────────────────────
  {
    id: 'food-burger-deluxe',
    category: 'food',
    title: 'Super Food Menu — Gourmet Burger Combo',
    tags: ['Burgers', 'Fast Food'],
    badge: 'Featured',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Delicious gourmet burger and french fries'
  },
  {
    id: 'food-pizza-classic',
    category: 'food',
    title: 'Delicious Food Menu — Hot Stonebaked Pizza',
    tags: ['Pizza', 'Fast Food'],
    badge: 'Hot Deal',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Freshly baked artisanal pizza'
  },
  {
    id: 'food-crispy-chicken',
    category: 'food',
    title: 'Golden Crispy Fried Chicken & Wings Special',
    tags: ['Fast Food', 'Burgers'],
    badge: 'Trending',
    url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Crispy fried chicken platter'
  },
  {
    id: 'food-bbq-steak',
    category: 'food',
    title: 'Chef Special BBQ Grill & Smoked Steaks',
    tags: ['BBQ', 'Fast Food'],
    badge: 'Best Seller',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Delicious smoked ribs and grill dishes'
  },
  {
    id: 'food-sushi-platter',
    category: 'food',
    title: 'Authentic Japanese Sushi & Sashimi Menu',
    tags: ['Sushi'],
    badge: 'Premium',
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Fresh sushi rolls and sashimi'
  },
  {
    id: 'food-asian-ramen',
    category: 'food',
    title: 'Hearty Asian Ramen & Street Noodles',
    tags: ['Fast Food', 'Sushi'],
    badge: 'Trending',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Warm bowl of delicious ramen'
  },
  {
    id: 'food-fresh-market',
    category: 'food',
    title: 'Fresh Organic Groceries & Farm Vegetables',
    tags: ['Groceries'],
    badge: 'Eco Fresh',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Fresh colorful grocery market display'
  },
  {
    id: 'food-bakery-pastry',
    category: 'food',
    title: 'Artisan Bakery & Morning Oven Breads',
    tags: ['Bakery'],
    badge: 'Morning Fresh',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Freshly baked croissants and bread loaves'
  },

  // ── FASHION & APPAREL ─────────────────────────────────────
  {
    id: 'fashion-streetwear',
    category: 'fashion',
    title: 'Urban Streetwear & Modern Sneaker Culture',
    tags: ['Streetwear', 'Shoes'],
    badge: 'Trending',
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Urban modern streetwear styling'
  },
  {
    id: 'fashion-boutique',
    category: 'fashion',
    title: 'Luxury Boutique Clothing & Seasonal Arrivals',
    tags: ['Boutique', 'Luxury'],
    badge: 'New Season',
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Minimalist clothing boutique rack'
  },
  {
    id: 'fashion-summer-vibe',
    category: 'fashion',
    title: 'Sunlit Summer Collection & Casual Elegance',
    tags: ['Summer', 'Boutique'],
    badge: 'Summer 2026',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Vibrant modern summer apparel'
  },
  {
    id: 'fashion-sneakers-footwear',
    category: 'fashion',
    title: 'Limited Edition Sneakers & Performance Shoes',
    tags: ['Shoes', 'Streetwear'],
    badge: 'Exclusive',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'High-end stylish shoes display'
  },
  {
    id: 'fashion-denim-jackets',
    category: 'fashion',
    title: 'Vintage Washed Denim & Outerwear',
    tags: ['Denim', 'Streetwear'],
    badge: 'Classic',
    url: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Denim jackets on rack'
  },

  // ── ELECTRONICS & TECH ────────────────────────────────────
  {
    id: 'tech-gadgets-desk',
    category: 'electronics',
    title: 'Next-Gen Smart Devices & Modern Electronics',
    tags: ['Phones', 'Smart Home'],
    badge: 'Featured',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Modern technology devices workspace'
  },
  {
    id: 'tech-audiophile-sound',
    category: 'electronics',
    title: 'High-Fidelity Audio, Headphones & Acoustics',
    tags: ['Audio'],
    badge: 'Hi-Res Audio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Studio wireless headphones on black background'
  },
  {
    id: 'tech-smartphones',
    category: 'electronics',
    title: 'Flagship Smartphones, Watches & Accessories',
    tags: ['Phones'],
    badge: 'Flagship',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Smartphone with glowing ambient background'
  },
  {
    id: 'tech-developer-laptop',
    category: 'electronics',
    title: 'Pro Laptops, Workstations & Creative Gear',
    tags: ['Laptops'],
    badge: 'Pro Tier',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Laptop and workspace'
  },
  {
    id: 'tech-smart-home',
    category: 'electronics',
    title: 'Smart Home Automation & Connected Living',
    tags: ['Smart Home'],
    badge: 'Smart AI',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Smart home device'
  },

  // ── BEAUTY & COSMETICS ────────────────────────────────────
  {
    id: 'beauty-serum-skincare',
    category: 'beauty',
    title: 'Pure Organic Serums & Botanical Skincare',
    tags: ['Skincare', 'Organic'],
    badge: 'Organic',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Luxury skincare serum dropper'
  },
  {
    id: 'beauty-makeup-cosmetics',
    category: 'beauty',
    title: 'Vibrant Glamour Makeup & Studio Cosmetics',
    tags: ['Makeup'],
    badge: 'Best Seller',
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Cosmetics and makeup brush set'
  },
  {
    id: 'beauty-botanical-spa',
    category: 'beauty',
    title: 'Holistic Spa, Essential Oils & Wellness Care',
    tags: ['Spa', 'Organic'],
    badge: 'Relaxation',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Spa essentials with warm stone background'
  },
  {
    id: 'beauty-perfume-fragrance',
    category: 'beauty',
    title: 'Artisan Perfume & Signature Eau De Parfum',
    tags: ['Fragrance'],
    badge: 'Luxury',
    url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Luxury perfume bottle with dramatic lighting'
  },

  // ── GAMING & ESPORTS ──────────────────────────────────────
  {
    id: 'gaming-rgb-battlestation',
    category: 'gaming',
    title: 'Ultimate RGB Neon Battlestation & Pro Gear',
    tags: ['RGB Setup', 'Gaming Tech'],
    badge: 'Trending',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Neon RGB gaming computer station'
  },
  {
    id: 'gaming-console-controller',
    category: 'gaming',
    title: 'Pro Esports Controllers & Console Gaming',
    tags: ['Consoles', 'Esports'],
    badge: 'Pro Tier',
    url: 'https://images.unsplash.com/photo-1612287271031-6b83f3607fae?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Wireless gaming controller with neon backlight'
  },
  {
    id: 'gaming-retro-arcade',
    category: 'gaming',
    title: 'Retro Arcade Nostalgia & Pixel Classics',
    tags: ['Arcade'],
    badge: 'Retro',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Retro arcade machine and neon lights'
  },
  {
    id: 'gaming-cyberpunk-horizon',
    category: 'gaming',
    title: 'Cyberpunk Worlds & Immersive Gaming Setups',
    tags: ['Cyberpunk', 'RGB Setup'],
    badge: 'Futuristic',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Cyberpunk inspired gaming atmosphere'
  },

  // ── HOME & LIVING ─────────────────────────────────────────
  {
    id: 'home-scandinavian-living',
    category: 'home',
    title: 'Warm Scandinavian Interior & Modern Living',
    tags: ['Living Room', 'Modern'],
    badge: 'Modern',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Clean scandinavian living room design'
  },
  {
    id: 'home-kitchen-culinary',
    category: 'home',
    title: 'Chef Kitchenware & Modern Dining Decor',
    tags: ['Kitchen', 'Modern'],
    badge: 'Culinary',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Modern aesthetic kitchen cookware'
  },
  {
    id: 'home-bedroom-cozy',
    category: 'home',
    title: 'Luxury Bedroom Comfort & Serene Bedding',
    tags: ['Bedroom'],
    badge: 'Comfort',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Cozy modern bedroom aesthetic'
  },
  {
    id: 'home-indoor-plants',
    category: 'home',
    title: 'Botanical Plants, Planters & Green Living',
    tags: ['Plants', 'Modern'],
    badge: 'Botanical',
    url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Lush green indoor house plants'
  },

  // ── SPORTS & FITNESS ──────────────────────────────────────
  {
    id: 'sports-gym-power',
    category: 'sports',
    title: 'High Performance Gym & Strength Training',
    tags: ['Gym', 'Athletics'],
    badge: 'Intense',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Gym fitness weights and equipment'
  },
  {
    id: 'sports-running-track',
    category: 'sports',
    title: 'Outdoor Running & Marathon Endurance Gear',
    tags: ['Running', 'Athletics'],
    badge: 'Endurance',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Runner track sprinting motion'
  },
  {
    id: 'sports-yoga-mindfulness',
    category: 'sports',
    title: 'Mindful Yoga, Pilates & Serene Wellness',
    tags: ['Yoga'],
    badge: 'Zen',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Yoga pose on clean mat'
  },
  {
    id: 'sports-athletic-sneakers',
    category: 'sports',
    title: 'Pro Cross-Training Footwear & Accessories',
    tags: ['Athletics', 'Gym'],
    badge: 'Popular',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Athletic cross training footwear'
  },

  // ── BOOKS & STATIONERY ────────────────────────────────────
  {
    id: 'books-classic-library',
    category: 'books',
    title: 'Grand Classic Library & Literary Treasury',
    tags: ['Library', 'Study'],
    badge: 'Bestseller',
    url: 'https://images.unsplash.com/photo-1507842229451-797185e8248a?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Library book shelves with classic volumes'
  },
  {
    id: 'books-journal-stationery',
    category: 'books',
    title: 'Artisan Journals, Calligraphy & Office Craft',
    tags: ['Journals', 'Art Supplies'],
    badge: 'Artisan',
    url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Leather notebook with fountain pen'
  },
  {
    id: 'books-cozy-reading-desk',
    category: 'books',
    title: 'Quiet Study Sanctuary & Academic Literature',
    tags: ['Study', 'Library'],
    badge: 'Academic',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Open books on warm wooden study desk'
  },

  // ── TOYS & KIDS ───────────────────────────────────────────
  {
    id: 'toys-creative-lego',
    category: 'toys',
    title: 'Colorful Building Bricks & Creative Kids Fun',
    tags: ['Lego', 'Creative'],
    badge: 'Kids Favorite',
    url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Colorful building blocks scattered'
  },
  {
    id: 'toys-plush-teddy',
    category: 'toys',
    title: 'Soft Plush Friends & Gentle Nursery Care',
    tags: ['Plush', 'Baby'],
    badge: 'Gentle Care',
    url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Cute teddy bear in sunny nursery'
  },
  {
    id: 'toys-playroom-adventures',
    category: 'toys',
    title: 'Imaginative Play, Board Games & Kids Magic',
    tags: ['Games', 'Creative'],
    badge: 'All Ages',
    url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Children playground toys setup'
  },

  // ── JEWELRY & LUXURY ──────────────────────────────────────
  {
    id: 'jewelry-diamond-ring',
    category: 'jewelry',
    title: 'Sparkling Solitaire Diamonds & Wedding Rings',
    tags: ['Diamonds', 'Luxury'],
    badge: 'Precious',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Diamond ring glistening on velvet'
  },
  {
    id: 'jewelry-gold-necklace',
    category: 'jewelry',
    title: 'Pure Gold Necklaces & Bespoke Fine Jewelry',
    tags: ['Gold', 'Necklaces'],
    badge: 'Fine Gold',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Golden chain and gemstone pendant'
  },
  {
    id: 'jewelry-chronograph-watch',
    category: 'jewelry',
    title: 'Luxury Swiss Chronograph Watches & Horology',
    tags: ['Watches', 'Luxury'],
    badge: 'Masterpiece',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Luxury automatic wrist watch'
  },

  // ── HEALTH & WELLNESS ─────────────────────────────────────
  {
    id: 'health-vitamins-organic',
    category: 'health',
    title: 'Clean Daily Vitamins & Natural Dietary Care',
    tags: ['Vitamins', 'Nutrition'],
    badge: 'Vitality',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Vitamin capsules and organic herbal herbs'
  },
  {
    id: 'health-herbal-tea-apothecary',
    category: 'health',
    title: 'Holistic Herbal Infusions & Wellness Remedies',
    tags: ['Herbal', 'Pharmacy'],
    badge: 'Natural',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Healthy green herbal wellness bowl'
  },
  {
    id: 'health-smoothie-nutrition',
    category: 'health',
    title: 'Superfood Smoothies & Nutritional Fitness',
    tags: ['Nutrition', 'Vitamins'],
    badge: 'Immunity',
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Immunity booster superfoods and herbs'
  },

  // ── AUTOMOTIVE & MOTORS ───────────────────────────────────
  {
    id: 'auto-supercar-performance',
    category: 'auto',
    title: 'High-Performance Supercars & Racing Dynamics',
    tags: ['Supercars', 'Parts'],
    badge: 'Performance',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Sleek luxury sports car on road'
  },
  {
    id: 'auto-detailing-garage',
    category: 'auto',
    title: 'Ceramic Coating, Auto Detailing & Care Garage',
    tags: ['Detailing', 'Parts'],
    badge: 'Precision',
    url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Professional car washing and detailing'
  },
  {
    id: 'auto-motorcycle-adventure',
    category: 'auto',
    title: 'Motorbike Freedom, Helmets & Touring Gear',
    tags: ['Bikes', 'Parts'],
    badge: 'Adventure',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Custom motorcycle parked at sunset'
  },

  // ── PETS & ANIMAL CARE ────────────────────────────────────
  {
    id: 'pets-happy-dogs',
    category: 'pets',
    title: 'Loyal Companions — Dog Treats, Toys & Care',
    tags: ['Dogs', 'Pet Food'],
    badge: 'Top Rated',
    url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Happy golden retriever running outdoors'
  },
  {
    id: 'pets-curious-cats',
    category: 'pets',
    title: 'Cat Comforts, Scratchers & Gourmet Wet Food',
    tags: ['Cats', 'Pet Food'],
    badge: 'Feline Love',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Cute tabby cat portrait'
  },
  {
    id: 'pets-accessories-wellness',
    category: 'pets',
    title: 'Holistic Pet Nutrition & Premium Leashes',
    tags: ['Accessories', 'Pet Food'],
    badge: 'Healthy Pets',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'French bulldog sitting proudly with stylish collar'
  },

  // ── CAFE & BAKERY ─────────────────────────────────────────
  {
    id: 'coffee-espresso-latte',
    category: 'coffee',
    title: 'Artisan Espresso, Creamy Latte Art & Beans',
    tags: ['Coffee', 'Cafe'],
    badge: 'Barista Choice',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Latte art in ceramic coffee cup'
  },
  {
    id: 'coffee-fresh-croissant',
    category: 'coffee',
    title: 'Warm French Croissants & Sweet Patisserie',
    tags: ['Croissants', 'Pastries'],
    badge: 'Freshly Baked',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Golden flaky croissants on wooden tray'
  },
  {
    id: 'coffee-shop-ambiance',
    category: 'coffee',
    title: 'Cozy Neighborhood Cafe & Specialty Roastery',
    tags: ['Cafe', 'Coffee'],
    badge: 'Cozy Vibe',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&h=450&q=80',
    alt: 'Warm lit coffee shop counter and tables'
  }
];

export function getBannersByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return FREE_BANNERS;
  return FREE_BANNERS.filter(b => b.category.toLowerCase() === categoryId.toLowerCase());
}
