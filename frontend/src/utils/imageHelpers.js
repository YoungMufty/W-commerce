export const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(url)) return false;
  return /\.(mp4|mov|webm|ogg|m4v)(\?|$)/i.test(url) || (url.includes('/video/upload/') && !url.includes('/video/upload/so_')) || url.startsWith('data:video/');
};

export const convertVideoToImageUrl = (url) => {
  if (!url) return url;
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(url)) return url;
  if (!isVideoUrl(url)) return url;
  // Cloudinary video → frame thumbnail at 0s
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    let clean = url;
    if (!clean.includes('/video/upload/so_0/')) {
      clean = clean.replace('/video/upload/', '/video/upload/so_0/');
    }
    return clean.replace(/\.(mp4|mov|webm|ogg|m4v)(\?.*)?$/i, '.jpg');
  }
  // Non-Cloudinary video: return null so caller uses category fallback
  return null;
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('data:image')) return url;
  if (url.startsWith('data:video')) return url;
  if (url.startsWith('blob:')) return url;
  
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');
  
  return `${baseUrl || window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

export function decodeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number(dec);
      if (code === 8243) return '″';
      if (code === 8242) return '′';
      if (code === 8211) return '–';
      if (code === 8212) return '—';
      if (code === 8216 || code === 8217) return "'";
      if (code === 8220 || code === 8221) return '"';
      if (code === 8230) return '…';
      if (code === 8358) return '₦';
      try {
        return String.fromCharCode(code);
      } catch (_) {
        return '';
      }
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch (_) {
        return '';
      }
    })
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#8358;/gi, '₦')
    .replace(/&pound;/gi, '£')
    .replace(/&euro;/gi, '€');
}

export const FALLBACK_SMARTWATCH_ID = 'photo-1523275335684-37898b6baf30';
export const FALLBACK_PACKAGE_BOX_IMG = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';

export const CATEGORY_IMAGE_PRESETS = [
  { id: 'biscuits', label: 'Biscuits & Cookies', keywords: ['biscuit', 'biscuits', 'cookie', 'cookies', 'cracker', 'wafer', 'shortbread'], url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80' },
  { id: 'crisps', label: 'Crisps & Chips', keywords: ['crisp', 'crisps', 'chips', 'potato crisps', 'pretzel', 'popcorn'], url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80' },
  { id: 'noodles', label: 'Noodles & Pasta', keywords: ['noodle', 'noodles', 'pasta', 'spaghetti', 'macaroni', 'indomie', 'ramen'], url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { id: 'cereal', label: 'Cereals & Corn Flakes', keywords: ['cornflake', 'corn flake', 'cornflakes', 'cereal', 'cereals', 'flakes', 'kellogg'], url: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=800&q=80' },
  { id: 'oats', label: 'Instant Oats & Oatmeal', keywords: ['oat', 'oats', 'oatmeal', 'quaker', 'porridge'], url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80' },
  { id: 'meals', label: 'Cooked Meals & Fast Food', keywords: ['meal', 'crunch meal', 'box meal', 'crunch box', 'feast box', 'bbq', 'inferno', 'sauce', 'burger', 'pizza', 'fried chicken', 'fried rice', 'jollof', 'fried rice and chicken', 'rice and chicken', 'chicken and rice'], url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80' },
  { id: 'water', label: 'Bottled Water', keywords: ['water', 'bottled water', 'pure water', 'eva', 'mineral water'], url: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=800&q=80' },
  { id: 'soda', label: 'Sodas & Cold Beverages', keywords: ['coca-cola', 'coca cola', 'coke', 'fanta', 'sprite', 'pepsi', 'soft drink', 'carbonated'], url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
  { id: 'dairy', label: 'Milk & Dairy', keywords: ['milk', 'dairy', 'cheese', 'butter', 'yogurt', 'cream'], url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80' },
  { id: 'eggs', label: 'Fresh Eggs', keywords: ['egg', 'eggs'], url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80' },
  { id: 'produce', label: 'Fresh Vegetables & Produce', keywords: ['tomato', 'tomatoes', 'vegetable', 'fresh produce', 'salad', 'onion', 'carrot', 'pepper', 'potato'], url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { id: 'fruit', label: 'Fresh Fruits', keywords: ['banana', 'apple', 'orange', 'fruit', 'berries', 'grape', 'lemon', 'citrus'], url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80' },
  { id: 'bakery', label: 'Bakery & Bread', keywords: ['bread', 'bakery', 'loaf', 'toast', 'bun', 'croissant', 'bagel'], url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { id: 'foil', label: 'Foil & Food Storage', keywords: ['foil', 'aluminium', 'wrap', 'baking sheet', 'food storage', 'parchment'], url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80' },
  { id: 'tissue', label: 'Toilet Tissue & Paper', keywords: ['tissue', 'toilet', 'paper towel', 'napkin', 'wipes', 'facial tissue'], url: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=800&q=80' },
  { id: 'cleaner', label: 'Household Cleaners', keywords: ['cleaner', 'bleach', 'detergent', 'spray', 'sponge', 'wash', 'soap', 'disinfectant'], url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80' },
  { id: 'meat', label: 'Meat & Poultry', keywords: ['chicken', 'beef', 'meat', 'pork', 'sausage', 'fish', 'seafood', 'steak'], url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80' },
  { id: 'rice', label: 'Rice, Pasta & Grains', keywords: ['rice', 'grain', 'grains', 'flour', 'wheat', 'beans', 'lentil'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { id: 'vitamins', label: 'Vitamins & Health', keywords: ['vitamin', 'supplement', 'capsule', 'tablet', 'pill', 'calcium', 'omega', 'multivitamin'], url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { id: 'plaster', label: 'First Aid & Plasters', keywords: ['plaster', 'bandage', 'first aid', 'medical', 'gauze', 'wound', 'adhesive'], url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80' },
  { id: 'baby', label: 'Baby & Childcare', keywords: ['diaper', 'nappy', 'baby', 'pacifier', 'infant', 'wipes'], url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80' },
  { id: 'beverages', label: 'Coffee, Tea & Beverages', keywords: ['coffee', 'tea', 'latte', 'espresso', 'beverage', 'juice', 'drink'], url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80' },
  { id: 'oil', label: 'Cooking Oils & Condiments', keywords: ['oil', 'olive oil', 'cooking oil', 'sunflower oil', 'vinegar', 'sauce', 'ketchup'], url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
  { id: 'snacks', label: 'Snacks & Sweets', keywords: ['snack', 'candy', 'chocolate'], url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80' },
  { id: 'personal_care', label: 'Personal Care & Beauty', keywords: ['shampoo', 'conditioner', 'lotion', 'cream', 'skincare', 'cosmetic', 'deodorant', 'body wash'], url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80' },
  { id: 'headphones', label: 'Headphones & Audio', keywords: ['headphone', 'headphones', 'earphone', 'earphones', 'airpod', 'earbuds', 'audio', 'headset', 'sound'], url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { id: 'smartwatch', label: 'Smartwatches & Tech', keywords: ['watch', 'smartwatch', 'chronograph', 'timepiece'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { id: 'electronics', label: 'Computers & Electronics', keywords: ['laptop', 'macbook', 'computer', 'notebook', 'phone', 'iphone', 'samsung', 'gadget', 'charger', 'tech'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' },
  { id: 'gymshark', label: 'Gym & Activewear', keywords: ['gymshark', 'activewear', 'sportswear', 'fitness', 'workout', 'leggings', 'gym'], url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80' },
  { id: 'apparel', label: 'Clothing & Apparel', keywords: ['men wear', 'mens wear', 'clothing', 'apparel', 'shirt', 'hoodie', 'pants', 'jacket', 'wear', 't-shirt', 'fashion', 'dress', 'shoe', 'sneaker'], url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
  { id: 'fries', label: 'French Fries & Sides', keywords: ['fries', 'french fries', 'fry', 'loaded fries', 'regular fries', 'large fries'], url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' },
  { id: 'groceries', label: 'General Groceries', keywords: ['raw grocer', 'raw grocery', 'fresh market food', 'supermarket food'], url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80' }
];

export function resolveProductImage(productOrUrl, title = '', category = '') {
  let rawUrl = '';
  let fullText = '';

  if (productOrUrl && typeof productOrUrl === 'object') {
    if (Array.isArray(productOrUrl.images) && productOrUrl.images.length > 0) {
      const nonVideoImage = productOrUrl.images.find(img => {
        const u = typeof img === 'string' ? img : img?.url || img?.src;
        return u && !isVideoUrl(u);
      });
      if (nonVideoImage) {
        rawUrl = typeof nonVideoImage === 'string' ? nonVideoImage : nonVideoImage?.url || nonVideoImage?.src;
      } else {
        const first = productOrUrl.images[0];
        rawUrl = typeof first === 'string' ? first : first?.url || first?.src;
      }
    }
    if (!rawUrl) {
      rawUrl = productOrUrl.imageUrl || productOrUrl.image || '';
    }
    fullText = `${productOrUrl.title || title || ''} ${productOrUrl.category || category || ''}`.toLowerCase();
  } else {
    rawUrl = typeof productOrUrl === 'string' ? productOrUrl : '';
    fullText = `${title} ${category}`.toLowerCase();
  }

  const isBrokenPhotoId = rawUrl.includes('1576107232684');
  const isWrongGroceryPhoto = rawUrl.includes('1542838132-92c53300491e') && !/(vegetable|produce|tomato|onion|grocery|groceries|fresh market)/i.test(fullText);
  const isSmartwatchFallback = rawUrl.includes(FALLBACK_SMARTWATCH_ID);
  const isActualWatch = fullText.includes('watch') || fullText.includes('chronograph');
  const isTruncatedUnsplash = rawUrl.includes('images.unsplash.com') && (!rawUrl.includes('?') || rawUrl.length < 55);
  const isGenericPlaceholder = rawUrl.includes('placeholder') || rawUrl.includes('via.placeholder') || rawUrl.includes('data:image/svg+xml') || isBrokenPhotoId || isWrongGroceryPhoto || isTruncatedUnsplash;

  if (rawUrl && (!isSmartwatchFallback || isActualWatch) && !isGenericPlaceholder) {
    // If the stored URL is a video, convert to a thumbnail image if possible (Cloudinary snapshot)
    if (isVideoUrl(rawUrl)) {
      const thumbnailUrl = convertVideoToImageUrl(rawUrl);
      if (thumbnailUrl) return thumbnailUrl;
      // Keep the video URL — do NOT discard the video and replace it with a placeholder
      return getImageUrl(rawUrl);
    } else {
      return getImageUrl(rawUrl);
    }
  }

  for (const preset of CATEGORY_IMAGE_PRESETS) {
    if (preset.keywords.some(kw => fullText.includes(kw))) {
      return preset.url;
    }
  }

  // High quality neutral retail order packaging default instead of random vegetables
  return FALLBACK_PACKAGE_BOX_IMG;
}

/**
 * Identify the high-level retail domain of a product to prevent cross-domain mismatch
 * (e.g. recommending fast food / soup for an interactive digital board or laptop).
 */
export function categorizeProductDomain(productOrCategory, title = '') {
  let text = '';
  if (productOrCategory && typeof productOrCategory === 'object') {
    text = `${productOrCategory.category || ''} ${productOrCategory.title || productOrCategory.name || ''} ${productOrCategory.description || ''}`.toLowerCase();
  } else {
    text = `${productOrCategory || ''} ${title || ''}`.toLowerCase();
  }

  if (/\b(food|meal|meals|combo|combos|drink|drinks|beverage|beverages|snack|snacks|sauce|sauces|fries|burger|burgers|chicken|strips|pizza|soup|yam|catfish|pepper|tomato|tomatoes|onion|onions|vegetable|vegetables|groceries|grocery|rice|noodles|pasta|cereal|corn flakes|oats|porridge|biscuits|cookies|crisps|chips|dairy|milk|eggs|bakery|bread|beef|meat)\b/i.test(text)) {
    return 'FOOD';
  }

  if (/\b(tech|electronic|electronics|gadget|gadgets|interactive board|digital board|smart board|board|screen|display|displays|tv|television|smart tv|monitor|monitors|computer|computers|laptop|laptops|phone|phones|smartphone|smartphones|tablet|audio|headphone|headphones|earbuds|smartwatch|smartwatches|charger|chargers|cables|playstation|ps5|console|quest|camera|oppo|samsung|hisense|huawei|yealink|dell|riversong|vibe)\b/i.test(text)) {
    return 'TECH';
  }

  if (/\b(fashion|apparel|clothing|clothes|wear|shirt|shirts|t-shirt|top|tops|blouse|blouses|dress|dresses|hoodie|hoodies|pants|shorts|jacket|jackets|leggings|sneaker|sneakers|shoes|shoe|activewear|gymshark|sportswear)\b/i.test(text)) {
    return 'FASHION';
  }

  if (/\b(beauty|skincare|cosmetics|makeup|lotion|moisturiser|moisturizing|body wash|bath & body|shampoo|haircare|fragrance|perfume|oral care|toothpaste)\b/i.test(text)) {
    return 'BEAUTY';
  }

  if (/\b(vitamin|vitamins|supplement|supplements|first aid|plaster|plasters|medical|bandage)\b/i.test(text)) {
    return 'HEALTH';
  }

  if (/\b(baby|diaper|diapers|baby wipes|nappy|infant)\b/i.test(text)) {
    return 'BABY';
  }

  if (/\b(furniture|couch|sofa|table|chair|bed|decor|lighting|kitchenware|cleaner|surface & floor cleaners|laundry care|laundry detergent)\b/i.test(text)) {
    return 'HOME';
  }

  return 'OTHER';
}

/**
 * Domain-compatibility guardrail: returns true only if two products belong to the same
 * commercial domain (or at least one cannot be definitively restricted).
 */
export function isCategoryCompatible(prodA, prodB) {
  if (!prodA || !prodB) return true;
  const domA = categorizeProductDomain(prodA);
  const domB = categorizeProductDomain(prodB);

  // If both have identified domains and they don't match, strictly reject
  if (domA !== 'OTHER' && domB !== 'OTHER') {
    return domA === domB;
  }
  return true;
}

