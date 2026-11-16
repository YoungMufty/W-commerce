const { getCategoryFallbackImage } = require('../backend/src/utils/productImageHelper');

const sampleText = `**Featured Recommendation:**
![W-Commerce Wireless Noise-Cancelling Headphones](https://images.unsplash.com/photo-1505740420928-
5e560c06d3`;

function repairMarkdownImagesLineBased(text) {
  if (!text || typeof text !== 'string') return text || '';
  const lines = text.split('\n');
  const resultLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line has unclosed markdown image tag: ![alt](http... without closing paren
    const unclosedMatch = line.match(/^(\s*!\[([^\]]+)\]\((https?:\/\/[^\s)]*))$/);
    if (unclosedMatch && !line.includes(')')) {
      const prefix = unclosedMatch[1];
      const alt = unclosedMatch[2];
      const urlPart1 = unclosedMatch[3];

      let fullUrl = urlPart1;
      // Check if next line is the rest of the URL (e.g. "5e560c06d3" or "5e560c06d30e...)")
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

    // Also check if line has a truncated unsplash image that was closed: ![alt](url)
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

    resultLines.push(line);
  }

  return resultLines.join('\n');
}

const repaired = repairMarkdownImagesLineBased(sampleText);
console.log('Original:\n' + sampleText);
console.log('\n--- Repaired ---:\n' + repaired);
