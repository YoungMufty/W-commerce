'use strict';
const assert = require('assert');
const payaiOrchestrator = require('../backend/src/services/payai/payaiOrchestrator');
const aiService = require('../backend/src/services/aiService');

async function testRecipeIntentFix() {
  console.log('=== Testing Recipe & Ingredient Query Fix ===\n');

  // Exact prompt from the user's screenshot
  const screenshotPrompt = 'hi good to see you today. I have a rice in my kitchen, list out all ingredient i need to get fried rice prepare for my breakfast';

  // Simulating the exact context where 'fried rice and chicken' was previously viewed in the session
  const simulatedContext = {
    previousProducts: [
      {
        id: 'mock-fried-rice-id',
        productId: 'mock-fried-rice-id',
        title: 'fried rice and chicken',
        price: 10000,
        currency: 'NGN',
        stock: 10,
        seller: { name: "TIRIMISIYU KALID's Shop" }
      }
    ],
    lastSessionProductId: 'mock-fried-rice-id',
    productId: null,
    recentNegotiation: false
  };

  console.log('1. Testing Intent Detection with exact screenshot prompt and existing session products...');
  const detected = payaiOrchestrator._detectIntent(screenshotPrompt, { marketCode: 'NIGERIA' }, simulatedContext);
  console.log('Detected Tool:', detected.toolName);
  assert.strictEqual(detected.toolName, 'advise_culinary_recipe', 'Must detect advise_culinary_recipe intent');
  assert.notStrictEqual(detected.toolName, 'select_product_preference', 'Must NOT trigger select_product_preference');
  console.log('✔ Test 1 Passed: Correct toolName advise_culinary_recipe detected\n');

  console.log('2. Testing Response Generation for advise_culinary_recipe...');
  const toolResult = await payaiOrchestrator.executeTool({
    toolName: 'advise_culinary_recipe',
    toolArgs: { prompt: screenshotPrompt },
    sessionId: 'test-session',
    marketCode: 'NIGERIA',
    destinationCountry: 'NG'
  });

  const response = payaiOrchestrator._generateResponse('advise_culinary_recipe', toolResult, screenshotPrompt);
  console.log('--- Generated Response Preview ---');
  console.log(response.slice(0, 350) + '...\n');

  // Assertions on generated response content
  assert.ok(response.includes('Ingredients Checklist'), 'Must include ingredients checklist');
  assert.ok(response.includes('Curry Powder'), 'Must mention curry powder');
  assert.ok(response.includes('Carrots') || response.includes('Vegetables'), 'Must mention vegetables');
  assert.ok(response.includes('Preparation') || response.includes('Stir-Fry'), 'Must include preparation steps');
  assert.ok(!response.includes('How many would you like to order?'), 'Must NEVER ask how many to order!');
  assert.ok(!response.includes('I see you prefer the fried rice and chicken'), 'Must NEVER say "I see you prefer..."');
  console.log('✔ Test 2 Passed: Full ingredient list & cooking instructions generated without order checkout\n');

  console.log('3. Verifying Genuine Product Selection still works properly...');
  const preferPrompt = 'i prefer the hungry box meal';
  const preferContext = {
    previousProducts: [
      { id: 'hb-1', title: 'Hungry Box Meal', price: 3500 }
    ]
  };
  const preferDetected = payaiOrchestrator._detectIntent(preferPrompt, { marketCode: 'NIGERIA' }, preferContext);
  console.log('Detected Tool for "i prefer the hungry box meal":', preferDetected.toolName);
  assert.strictEqual(preferDetected.toolName, 'select_product_preference', 'Explicit preference must still trigger select_product_preference');
  console.log('✔ Test 3 Passed: Genuine product selection preserved\n');

  console.log('4. Testing aiService fallback for culinary/recipe queries...');
  const aiReply = await aiService.generateChatResponse([
    { role: 'user', content: screenshotPrompt }
  ]);
  console.log('--- aiService Response Preview ---');
  console.log(aiReply.slice(0, 300) + '...\n');
  assert.ok(aiReply.includes('Ingredients Checklist') || aiReply.includes('Curry Powder'), 'aiService fallback must include ingredients');
  assert.ok(!aiReply.includes('How many would you like to order?'), 'aiService fallback must not ask to order');
  console.log('✔ Test 4 Passed: aiService culinary handler verified\n');

  console.log('🎉 ALL RECIPE INTENT TESTS PASSED SUCCESSFULLY!');
}

testRecipeIntentFix().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
