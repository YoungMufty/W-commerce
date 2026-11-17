const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: 'Spicy Crunch Meal' } },
        { title: { contains: 'Double Crunch Meal' } },
        { title: { contains: 'Crunch Box' } },
        { title: { contains: 'Native Soup' } }
      ]
    },
    include: {
      store: true
    }
  });
  console.log('Found products in DB:', products.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    storeId: p.storeId,
    storeName: p.store?.storeName,
    createdAt: p.createdAt
  })));

  await prisma.$disconnect();
}

main();
