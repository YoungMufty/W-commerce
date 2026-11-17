const catalogSearchService = require('./backend/src/services/payai/catalogSearchService');
const prisma = require('./backend/src/utils/prismaClient');

async function test() {
  console.log('Testing search for "hisense" in catalogSearchService:');
  const hisenseRes = await catalogSearchService.search({ query: 'hisense', limit: 5 });
  console.log('Hisense items count:', hisenseRes.items?.length);
  if (hisenseRes.items?.length > 0) {
    console.log('First Hisense item:', JSON.stringify(hisenseRes.items[0], null, 2));
  }

  await prisma.$disconnect();
}

test();
