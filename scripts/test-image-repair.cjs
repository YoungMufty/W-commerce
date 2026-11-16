const { getCategoryFallbackImage, resolveBackendProductImage } = require('../backend/src/utils/productImageHelper');

const brokenText = `Featured Recommendation:
![W-Commerce Wireless Noise-Cancelling Headphones](https://images.unsplash.com/photo-1505740420928-
5e560c06d3`;

function repairMarkdownImages(text) {
  if (!text || typeof text !== 'string') return text;
  let res = text;

  // 1. Join split URLs: ![alt](url_prefix\nurl_suffix)
  res = res.replace(/!\[([^\]\n]*)\]\((https?:\/\/[^\s)\n]+)\s*[\r\n]+\s*([a-zA-Z0-9_?&=%-]+)\s*\)/g, '![$1]($2$3)');

  // 2. Fix unclosed/truncated markdown image (including multi-line): ![alt](url_prefix\nurl_suffix (without closing paren)
  res = res.replace(/!\[([^\]\n]+)\]\((https?:\/\/[^\s)\n]+)(?:\s*[\r\n]+\s*([a-zA-Z0-9_?&=%-]+))?(?!\))/g, (match, alt, p1, p2) => {
    const raw = (p1 || '') + (p2 || '');
    let valid = raw;
    if (raw.includes('images.unsplash.com') && (!raw.includes('?') || raw.length < 55)) {
      valid = getCategoryFallbackImage(alt, '') || raw;
    }
    return `![${alt}](${valid})`;
  });

  // 3. Complete any remaining truncated unsplash images with closing paren
  res = res.replace(/!\[([^\]\n]+)\]\((https?:\/\/images\.unsplash\.com\/[^\s)]+)\)/g, (fullMatch, alt, url) => {
    if (!url.includes('?') || url.length < 55) {
      const valid = getCategoryFallbackImage(alt, '') || url;
      return `![${alt}](${valid})`;
    }
    return fullMatch;
  });

  return res;
}

const repaired = repairMarkdownImages(brokenText);
console.log('Original:\n' + brokenText);
console.log('\n--- Repaired ---:\n' + repaired);
