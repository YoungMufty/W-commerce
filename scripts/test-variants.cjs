const { getCategoryFallbackImage } = require('../backend/src/utils/productImageHelper');

function repairMarkdownImagesLineBased(text) {
  if (!text || typeof text !== 'string') return text || '';
  const lines = text.split('\n');
  const resultLines = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // 1. Check if line has an unclosed markdown image tag: ![alt](http...
    const unclosedMatch = line.match(/^(\s*!\[([^\]]+)\]\((https?:\/\/[^\s)]*))$/);
    if (unclosedMatch && !line.includes(')')) {
      const alt = unclosedMatch[2];
      const urlPart1 = unclosedMatch[3];

      let fullUrl = urlPart1;
      // Check if next line is the rest of the URL
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (/^[a-zA-Z0-9_?&=%-]+(\))?$/.test(nextLine)) {
          fullUrl += nextLine.replace(/\)$/, '');
          i++; // skip next line as it was consumed
        }
      }

      // If Unsplash URL is truncated, get full high-res fallback image
      if (fullUrl.includes('images.unsplash.com') && (!fullUrl.includes('?') || fullUrl.length < 55)) {
        fullUrl = getCategoryFallbackImage(alt, '') || fullUrl;
      }

      resultLines.push(`![${alt}](${fullUrl})`);
      continue;
    }

    // 2. Check if line has a closed markdown image tag: ![alt](url)
    const completeMatch = line.match(/^(\s*)!\[([^\]]+)\]\((https?:\/\/[^)]+)\)(\s*)$/);
    if (completeMatch) {
      const indent = completeMatch[1];
      const alt = completeMatch[2];
      let url = completeMatch[3].trim();
      const trailing = completeMatch[4];
      if (url.includes('images.unsplash.com') && (!url.includes('?') || url.length < 55)) {
        url = getCategoryFallbackImage(alt, '') || url;
      }
      resultLines.push(`${indent}![${alt}](${url})${trailing}`);
      continue;
    }

    // 3. Check for any inline truncated unsplash images: ![alt](https://images.unsplash.com/...
    if (line.includes('![') && line.includes('images.unsplash.com')) {
      const repairedLine = line.replace(/!\[([^\]]+)\]\((https?:\/\/images\.unsplash\.com\/[^\s)]+)\)/g, (match, alt, url) => {
        if (!url.includes('?') || url.length < 55) {
          const fallback = getCategoryFallbackImage(alt, '') || url;
          return `![${alt}](${fallback})`;
        }
        return match;
      });
      resultLines.push(repairedLine);
      continue;
    }

    resultLines.push(rawLine);
  }

  return resultLines.join('\n');
}

const tests = [
  'Featured Recommendation:\n![W-Commerce Wireless Noise-Cancelling Headphones](https://images.unsplash.com/photo-1505740420928-\n5e560c06d3',
  'Featured Recommendation:\n![W-Commerce Wireless Noise-Cancelling Headphones](https://images.unsplash.com/photo-1505740420928-5e560c06d3)',
  'Featured Recommendation:\n![W-Commerce Wireless Noise-Cancelling Headphones](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80)'
];

tests.forEach((t, i) => {
  console.log('--- Test ' + (i+1) + ' ---');
  console.log(repairMarkdownImagesLineBased(t));
});
