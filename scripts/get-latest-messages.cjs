const prisma = require('../backend/src/utils/prismaClient');

async function main() {
  const msgs = await prisma.payAIMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(`Latest ${msgs.length} PayAI messages:`);
  msgs.forEach((m, i) => {
    console.log(`\n--- [${i + 1}] Role: ${m.role} | Created: ${m.createdAt} ---`);
    console.log('Content:\n' + m.content);
    if (m.toolResults) console.log('ToolResults preview:\n' + m.toolResults.slice(0, 200));
  });
}

main().finally(() => prisma.$disconnect());
