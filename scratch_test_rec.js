const RecommendationService = require('./backend/src/services/recommendationService');
const prisma = require('./backend/src/utils/prismaClient');

async function main() {
  const productId = '22c36768-279a-466f-8cba-7b9c3e2cd4d5';
  console.log('Testing getRecommendationBundle for Hisense:');
  const bundle = await RecommendationService.getRecommendationBundle(productId);
  console.log('Bundle recommended count:', bundle.recommended?.length);
  console.log('Bundle recommended titles:', bundle.recommended?.map(p => ({ title: p.title, category: p.category })));
  console.log('Bundle similar count:', bundle.similar?.length);
  console.log('Bundle similar titles:', bundle.similar?.map(p => ({ title: p.title, category: p.category })));
  console.log('Bundle personalized count:', bundle.personalized?.length);
  console.log('Bundle personalized titles:', bundle.personalized?.map(p => ({ title: p.title, category: p.category })));
  console.log('Bundle peopleAlsoBought count:', bundle.peopleAlsoBought?.length);
  console.log('Bundle peopleAlsoBought titles:', bundle.peopleAlsoBought?.map(p => ({ title: p.title, category: p.category })));

  console.log('\nTesting getRecommendations with category "Interactive Boards":');
  const recs = await RecommendationService.getRecommendations(null, [productId], 6, [], 'Interactive Boards');
  console.log('Recs count:', recs.length);
  console.log('Recs titles:', recs.map(p => ({ title: p.title, category: p.category })));

  console.log('\nTesting getRecommendations with NO category:');
  const recsNoCat = await RecommendationService.getRecommendations(null, [], 6, []);
  console.log('Recs no cat count:', recsNoCat.length);
  console.log('Recs no cat titles:', recsNoCat.map(p => ({ title: p.title, category: p.category })));

  await prisma.$disconnect();
}

main();
