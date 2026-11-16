const prisma = require('../backend/src/utils/prismaClient');
const { getCategoryFallbackImage } = require('../backend/src/utils/productImageHelper');

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

async function main() {
  const messages = await prisma.payAIMessage.findMany({
    where: {
      content: { contains: '![' }
    }
  });

  console.log(`Found ${messages.length} messages with markdown images.`);
  let fixedCount = 0;

  for (const m of messages) {
    const repaired = repairMarkdownImages(m.content);
    if (repaired !== m.content) {
      await prisma.payAIMessage.update({
        where: { id: m.id },
        data: { content: repaired }
      });
      console.log(`✔ Fixed message [${m.id}] created at ${m.createdAt}`);
      console.log('--- Before ---\n' + m.content.slice(-200));
      console.log('--- After ---\n' + repaired.slice(-200));
      fixedCount++;
    }
  }

  console.log(`\nDone! Repaired ${fixedCount} messages in database.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
