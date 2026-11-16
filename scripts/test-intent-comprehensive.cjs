const orchestrator = require('../backend/src/services/payai/payaiOrchestrator');

const mockContext = {
  previousProducts: [
    {
      id: '8ba5e1b8-48a6-4f94-879a-e39c66f3b074',
      productId: '8ba5e1b8-48a6-4f94-879a-e39c66f3b074',
      title: 'fried rice and chicken',
      price: 10000,
      currency: 'NGN',
      stock: 3
    }
  ],
  lastSessionProductId: '8ba5e1b8-48a6-4f94-879a-e39c66f3b074',
  productId: '8ba5e1b8-48a6-4f94-879a-e39c66f3b074'
};

const testCases = [
  {
    prompt: 'hi good to see you today. I have a rice in my kitchen, list out all ingredient i need to get fried rice prepare for my breakfast',
    expected: 'advise_culinary_recipe'
  },
  {
    prompt: 'ohh thanks. are all ingredient available in stock',
    expected: 'check_recipe_ingredients_stock'
  },
  {
    prompt: 'can i buy all the ingredients here in w-commerce',
    expected: 'check_recipe_ingredients_stock'
  },
  {
    prompt: 'how to cook jollof rice at home for lunch',
    expected: 'advise_culinary_recipe'
  },
  {
    prompt: 'recipe for egusi soup and pounded yam',
    expected: 'advise_culinary_recipe'
  },
  {
    prompt: 'only 3 remain in stock',
    expected: 'check_product_stock'
  },
  {
    prompt: 'is it finished?',
    expected: 'check_product_stock'
  },
  {
    prompt: 'is fried rice and chicken in stock?',
    expected: 'check_product_stock'
  }
];

let failed = 0;
for (const tc of testCases) {
  const result = orchestrator._detectIntent(tc.prompt, {}, mockContext);
  const pass = result.toolName === tc.expected;
  console.log(`${pass ? '✔' : '✖'} Prompt: "${tc.prompt}" -> Got: ${result.toolName} (Expected: ${tc.expected})`);
  if (!pass) failed++;
}

if (failed === 0) {
  console.log('\nAll actual payaiOrchestrator intent tests PASSED!');
} else {
  console.log(`\n${failed} actual payaiOrchestrator intent tests FAILED!`);
  process.exit(1);
}
