const RecommendationService = require('./backend/src/services/recommendationService');
const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const productId = '47d5bc28-b9ff-4069-a791-3ac9fe54bcb5';
  console.log('Testing getRecommendationBundle for Fakunle Faruq Hisense:');
  try {
    const bundle = await RecommendationService.getRecommendationBundle(productId);
    console.log('Bundle recommended count:', bundle.recommended?.length);
    console.log('Bundle recommended:', bundle.recommended?.map(p => ({ title: p.title, category: p.category })));
    console.log('Bundle similar count:', bundle.similar?.length);
    console.log('Bundle similar:', bundle.similar?.map(p => ({ title: p.title, category: p.category })));
  } catch (err) {
    console.error('Bundle error:', err);
  }

  await prisma.$disconnect();
}

main();
