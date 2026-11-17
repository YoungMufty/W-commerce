const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { fullName: { contains: 'Fakunle' } },
        { fullName: { contains: 'Faruq' } }
      ]
    },
    include: {
      store: true
    }
  });
  console.log('Users found:', JSON.stringify(users, null, 2));

  const stores = await prisma.store.findMany({
    where: {
      storeName: { contains: 'Fakunle' }
    }
  });
  console.log('Stores found:', JSON.stringify(stores, null, 2));

  await prisma.$disconnect();
}

main();
