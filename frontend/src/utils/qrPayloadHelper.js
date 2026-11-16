/**
 * QR Payload Helper for W-Commerce
 * Standardized encoding & parsing for:
 * 1. Product
 * 2. Store
 * 3. Order
 * 4. Receipt
 * 5. Transaction
 */

export const QR_TYPES = {
  PRODUCT: 'product',
  STORE: 'store',
  ORDER: 'order',
  RECEIPT: 'receipt',
  TRANSACTION: 'transaction'
};

/**
 * Generate a standard URL + QR payload for an entity
 */
export function generateQRPayload({
  type,
  id,
  slug,
  title,
  subtitle,
  amount,
  currency = 'NGN',
  storeName,
  status,
  metadata = {}
}) {
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://w-commerce.app';

  let path = '';
  switch (type) {
    case QR_TYPES.PRODUCT:
      path = `/product/${id}`;
      break;
    case QR_TYPES.STORE:
      path = `/store/${slug || id}`;
      break;
    case QR_TYPES.ORDER:
      path = `/orders/${id}`;
      break;
    case QR_TYPES.RECEIPT:
      path = `/orders/${id}?view=receipt`;
      break;
    case QR_TYPES.TRANSACTION:
      path = `/wallet/transactions?ref=${encodeURIComponent(id)}`;
      break;
    default:
      path = `/`;
  }

  const url = new URL(path, origin);
  url.searchParams.set('qr_src', 'wcom');
  url.searchParams.set('qr_type', type);
  if (id) url.searchParams.set('qr_id', String(id));
  if (title) url.searchParams.set('qr_title', String(title));
  if (amount) url.searchParams.set('qr_amount', String(amount));
  if (currency) url.searchParams.set('qr_curr', String(currency));

  // JSON representation for digital transfer or raw scanners
  const jsonPayload = JSON.stringify({
    schema: 'wcom:v1',
    type,
    id,
    slug: slug || undefined,
    title,
    subtitle,
    amount,
    currency,
    storeName,
    status,
    url: url.toString(),
    ...metadata
  });

  return {
    url: url.toString(),
    jsonPayload,
    type,
    title,
    subtitle
  };
}

/**
 * Intelligent parser for scanned QR text.
 * Can parse W-Commerce URLs, JSON payloads, deep links, or raw IDs.
 */
export function parseQRData(rawScannedText) {
  if (!rawScannedText || typeof rawScannedText !== 'string') {
    return {
      recognized: false,
      type: 'unknown',
      title: 'Unrecognized Code',
      subtitle: 'The scanned code did not contain valid details.',
      rawText: rawScannedText
    };
  }

  const text = rawScannedText.trim();

  // 1. Try parsing as JSON
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.type && Object.values(QR_TYPES).includes(parsed.type)) {
        return buildRecognizedResult(parsed.type, {
          id: parsed.id || parsed.orderId || parsed.reference,
          slug: parsed.slug,
          title: parsed.title,
          subtitle: parsed.subtitle || parsed.storeName || parsed.desc,
          amount: parsed.amount,
          currency: parsed.currency,
          status: parsed.status,
          targetUrl: parsed.url || getEntityUrl(parsed.type, parsed.id || parsed.slug)
        }, text);
      }
    } catch (_) {}
  }

  // 2. Try parsing as URL
  try {
    const isFullUrl = text.startsWith('http://') || text.startsWith('https://');
    const urlObj = isFullUrl ? new URL(text) : null;

    if (urlObj) {
      const pathname = urlObj.pathname.toLowerCase();
      const params = urlObj.searchParams;

      // Direct QR query parameters
      const qrType = params.get('qr_type');
      const qrId = params.get('qr_id');
      const qrTitle = params.get('qr_title');

      if (qrType && Object.values(QR_TYPES).includes(qrType)) {
        return buildRecognizedResult(qrType, {
          id: qrId,
          title: qrTitle || `${capitalize(qrType)} Details`,
          targetUrl: text
        }, text);
      }

      // Check URL route patterns
      // /product/:id
      const productMatch = pathname.match(/^\/product\/([^/]+)/);
      if (productMatch) {
        return buildRecognizedResult(QR_TYPES.PRODUCT, {
          id: productMatch[1],
          title: qrTitle || 'Product Details',
          targetUrl: text
        }, text);
      }

      // /store/:slug
      const storeMatch = pathname.match(/^\/store\/([^/]+)/);
      if (storeMatch) {
        return buildRecognizedResult(QR_TYPES.STORE, {
          slug: storeMatch[1],
          title: qrTitle || `${storeMatch[1]} Storefront`,
          targetUrl: text
        }, text);
      }

      // Receipt pattern
      if (pathname.includes('/receipt') || params.get('view') === 'receipt') {
        const orderId = pathname.match(/\/receipt\/([^/]+)/)?.[1] || pathname.match(/\/orders\/([^/]+)/)?.[1] || qrId;
        return buildRecognizedResult(QR_TYPES.RECEIPT, {
          id: orderId,
          title: `Receipt #${String(orderId || '').slice(-8).toUpperCase()}`,
          targetUrl: text
        }, text);
      }

      // /orders/:id or /buyer/orders/:id
      const orderMatch = pathname.match(/^\/(?:buyer\/)?orders\/([^/]+)/);
      if (orderMatch) {
        return buildRecognizedResult(QR_TYPES.ORDER, {
          id: orderMatch[1],
          title: `Order #${String(orderMatch[1]).slice(-8).toUpperCase()}`,
          targetUrl: text
        }, text);
      }

      // /wallet/transactions or ref param
      if (pathname.includes('wallet') || pathname.includes('transaction')) {
        const ref = params.get('ref') || pathname.match(/\/transaction\/([^/]+)/)?.[1] || qrId;
        return buildRecognizedResult(QR_TYPES.TRANSACTION, {
          id: ref,
          title: `Transaction ${ref ? '#' + String(ref).slice(-8).toUpperCase() : ''}`,
          targetUrl: text
        }, text);
      }

      // Generic URL fallback
      return {
        recognized: true,
        type: 'url',
        title: 'Web Link',
        subtitle: urlObj.hostname + urlObj.pathname,
        badgeText: 'LINK',
        badgeColor: 'blue',
        primaryActionLabel: 'Open Link',
        targetUrl: text,
        rawText: text
      };
    }
  } catch (_) {}

  // 3. Fallback: Check raw code patterns
  // Order Code: e.g. ORD-12345 or starts with ORD
  if (/^ORD-[A-Z0-9]+/i.test(text)) {
    return buildRecognizedResult(QR_TYPES.ORDER, {
      id: text,
      title: `Order ${text}`,
      targetUrl: `/orders/${text}`
    }, text);
  }

  // UUID format (often an order ID or product ID)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(text)) {
    return buildRecognizedResult(QR_TYPES.ORDER, {
      id: text,
      title: `Order / Verification #${text.slice(-8).toUpperCase()}`,
      targetUrl: `/orders/${text}`
    }, text);
  }

  // Generic Plain Text
  return {
    recognized: false,
    type: 'text',
    title: 'Text Content',
    subtitle: text.length > 80 ? text.slice(0, 80) + '...' : text,
    badgeText: 'TEXT',
    badgeColor: 'gray',
    primaryActionLabel: 'Copy Text',
    rawText: text
  };
}

function buildRecognizedResult(type, details, rawText) {
  const meta = {
    [QR_TYPES.PRODUCT]: {
      badgeText: 'PRODUCT',
      badgeColor: 'purple',
      defaultTitle: 'Product Showcase',
      defaultSubtitle: 'Verified W-Commerce Product',
      actionLabel: 'View Product Details'
    },
    [QR_TYPES.STORE]: {
      badgeText: 'STOREFRONT',
      badgeColor: 'emerald',
      defaultTitle: 'Merchant Storefront',
      defaultSubtitle: 'Verified Merchant Portfolio',
      actionLabel: 'Visit Storefront'
    },
    [QR_TYPES.ORDER]: {
      badgeText: 'ORDER',
      badgeColor: 'amber',
      defaultTitle: 'Order Tracking & Escrow',
      defaultSubtitle: 'Escrow Secured Order',
      actionLabel: 'Track & View Order'
    },
    [QR_TYPES.RECEIPT]: {
      badgeText: 'RECEIPT',
      badgeColor: 'teal',
      defaultTitle: 'Official Payment Receipt',
      defaultSubtitle: 'Proof of Payment & Guarantee',
      actionLabel: 'Open Official Receipt'
    },
    [QR_TYPES.TRANSACTION]: {
      badgeText: 'TRANSACTION',
      badgeColor: 'indigo',
      defaultTitle: 'Wallet Transaction Proof',
      defaultSubtitle: 'Verified Platform Transfer',
      actionLabel: 'View Transaction'
    }
  }[type] || {
    badgeText: 'ITEM',
    badgeColor: 'blue',
    defaultTitle: 'Scanned Item',
    defaultSubtitle: 'W-Commerce Data',
    actionLabel: 'Open'
  };

  return {
    recognized: true,
    type,
    id: details.id,
    slug: details.slug,
    title: details.title || meta.defaultTitle,
    subtitle: details.subtitle || meta.defaultSubtitle,
    badgeText: meta.badgeText,
    badgeColor: meta.badgeColor,
    primaryActionLabel: meta.actionLabel,
    amount: details.amount,
    currency: details.currency || 'NGN',
    status: details.status,
    targetUrl: details.targetUrl || getEntityUrl(type, details.id || details.slug),
    rawText
  };
}

function getEntityUrl(type, idOrSlug) {
  switch (type) {
    case QR_TYPES.PRODUCT:
      return `/product/${idOrSlug}`;
    case QR_TYPES.STORE:
      return `/store/${idOrSlug}`;
    case QR_TYPES.ORDER:
      return `/orders/${idOrSlug}`;
    case QR_TYPES.RECEIPT:
      return `/orders/${idOrSlug}?view=receipt`;
    case QR_TYPES.TRANSACTION:
      return `/wallet/transactions?ref=${encodeURIComponent(idOrSlug || '')}`;
    default:
      return `/`;
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
