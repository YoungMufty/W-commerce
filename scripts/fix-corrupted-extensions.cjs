const prisma = require('../backend/src/utils/prismaClient');

async function fixCorruptedExtensions() {
  const messages = await prisma.payAIMessage.findMany({
    where: {
      content: { contains: ')' }
    }
  });

  let fixed = 0;
  for (const m of messages) {
    let text = m.content;
    const original = text;

    text = text.replace(/\.web\)p\)/g, '.webp)');
    text = text.replace(/&q=8\)0\)/g, '&q=80)');
    text = text.replace(/\.pn\)g\)/g, '.png)');
    text = text.replace(/\.jp\)g\)/g, '.jpg)');
    text = text.replace(/\.jpe\)g\)/g, '.jpeg)');

    if (text !== original) {
      await prisma.payAIMessage.update({
        where: { id: m.id },
        data: { content: text }
      });
      fixed++;
    }
  }

  console.log(`Cleaned up ${fixed} messages with corrupted extensions.`);
}

fixCorruptedExtensions().finally(() => prisma.$disconnect());
