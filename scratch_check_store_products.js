const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const products = await prisma.product.findMany({
    where: {
      storeId: 'e0aaf673-baba-4d17-a1af-23875bef6ff0'
    },
    select: {
      id: true,
      title: true,
      category: true,
      price: true
    }
  });
  console.log(`Store e0aaf673 has ${products.length} products:`);
  console.log(JSON.stringify(products.slice(0, 20), null, 2));

  await prisma.$disconnect();
}

main();
