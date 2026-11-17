const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const p = await prisma.product.findFirst({
    where: {
      OR: [
        { title: { contains: 'Hisense' } },
        { title: { contains: 'Interactive' } }
      ]
    },
    include: {
      store: true,
      images: true
    }
  });
  console.log('Product:', JSON.stringify(p, null, 2));

  // Also check all distinct categories
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: { id: true }
  });
  console.log('Categories in DB:', categories);

  await prisma.$disconnect();
}

main();
