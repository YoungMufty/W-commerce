const prisma = require('../backend/src/utils/prismaClient');
async function run() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { category: { in: ['Groceries', 'Food', 'Combos', 'Pantry', 'Spices'] } },
        { title: { contains: 'rice' } },
        { title: { contains: 'vegetable' } },
        { title: { contains: 'oil' } },
        { title: { contains: 'chicken' } },
        { title: { contains: 'pepper' } }
      ]
    },
    select: { id: true, title: true, category: true, price: true, stock: true }
  });
  console.log('Food & Grocery Products in DB (' + products.length + '):');
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}
run();
