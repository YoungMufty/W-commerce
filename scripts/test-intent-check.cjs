const orchestrator = require('../backend/src/services/payai/payaiOrchestrator');

const prompt1 = 'hi good to see you today. I have a rice in my kitchen, list out all ingredient i need to get fried rice prepare for my breakfast';
const res1 = orchestrator._detectIntent(prompt1, {}, {});
console.log('Result 1 (no prev items):', JSON.stringify(res1, null, 2));

// Test with previousProducts having "fried rice and chicken"
const mockContext = {
  previousProducts: [
    {
      id: 'mock-fried-rice-id',
      productId: 'mock-fried-rice-id',
      title: 'fried rice and chicken',
      price: 10000,
      currency: 'NGN',
      stock: 3
    }
  ],
  lastSessionProductId: 'mock-fried-rice-id',
  productId: 'mock-fried-rice-id'
};

const res1WithPrev = orchestrator._detectIntent(prompt1, {}, mockContext);
console.log('Result 1 (WITH prev items):', JSON.stringify(res1WithPrev, null, 2));

const prompt2 = 'ohh thanks. are all ingredient available in stock';
const res2WithPrev = orchestrator._detectIntent(prompt2, {}, mockContext);
console.log('Result 2 (WITH prev items):', JSON.stringify(res2WithPrev, null, 2));
