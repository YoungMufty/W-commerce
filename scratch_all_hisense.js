const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const products = await prisma.product.findMany({
    where: {
      title: { contains: 'Hisense' }
    },
    include: {
      store: true
    }
  });
  console.log(`Found ${products.length} Hisense products:`);
  products.forEach(p => {
    console.log({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      storeId: p.storeId,
      storeName: p.store?.storeName,
      tags: p.tags
    });
  });

  await prisma.$disconnect();
}

main();
