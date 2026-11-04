'use strict';
const assert = require('assert');
const payaiOrchestrator = require('../backend/src/services/payai/payaiOrchestrator');
const aiService = require('../backend/src/services/aiService');

async function testAIAccuracy() {
  console.log('=== Testing PayAI Response Accuracy & Question Answering ===\n');

  // Exact prompt and context from the user's latest screenshot
  const screenshotPrompt = 'ohh thanks. are all ingredient available in stock';

  const simulatedContextWithFriedRice = {
    previousProducts: [
      {
        id: 'mock-fried-rice-id',
        productId: 'mock-fried-rice-id',
        title: 'fried rice and chicken',
        price: 10000,
        currency: 'NGN',
        stock: 3,
        seller: { name: "Fakunle Faruq's Shop" }
      }
    ],
    lastSessionProductId: 'mock-fried-rice-id',
    recentHistory: [
      { role: 'user', content: 'hi good to see you today. I have a rice in my kitchen, list out all ingredient i need to get fried rice prepare for my breakfast' },
      { role: 'assistant', content: 'Here is the recipe and ingredients for fried rice...' }
    ]
  };

  // Test 1: Intent detection on "ohh thanks. are all ingredient available in stock"
  console.log('1. Testing Intent Detection for recipe ingredients availability query...');
  const detected = payaiOrchestrator._detectIntent(screenshotPrompt, { marketCode: 'NIGERIA' }, simulatedContextWithFriedRice);
  console.log('Detected Tool:', detected.toolName);
  assert.strictEqual(detected.toolName, 'check_recipe_ingredients_stock', 'Must route to check_recipe_ingredients_stock');
  console.log('✔ Test 1 Passed: Routed to check_recipe_ingredients_stock instead of check_product_stock\n');

  // Test 2: Execution and response generation for check_recipe_ingredients_stock
  console.log('2. Testing Response for check_recipe_ingredients_stock...');
  const toolResult = await payaiOrchestrator.executeTool({
    toolName: detected.toolName,
    toolArgs: detected.toolArgs,
    sessionId: 'test-session-accuracy',
    marketCode: 'NIGERIA',
    session: { marketCode: 'NIGERIA' }
  });

  const response = payaiOrchestrator._generateResponse('check_recipe_ingredients_stock', toolResult, screenshotPrompt);
  console.log('--- Response Preview ---');
  console.log(response.slice(0, 400) + '...\n');

  assert.ok(!response.includes('Low Stock Alert: Only 3 units remain in stock'), 'Must NOT trigger low stock alert for fried rice and chicken');
  assert.ok(response.includes('Live Ingredient Availability') || response.includes('In Stock & Available Now'), 'Must include ingredient availability');
  assert.ok(response.includes('Rice Base') || response.includes('already have rice in your kitchen'), 'Must recognize rice already in kitchen');
  console.log('✔ Test 2 Passed: Accurate ingredient inventory response without false product alert\n');

  // Test 3: Referential pronoun check still works for previous product ("is it finished?")
  console.log('3. Testing referential pronoun stock check ("is it finished?")...');
  const pronounDetected = payaiOrchestrator._detectIntent('is it finished?', { marketCode: 'NIGERIA' }, simulatedContextWithFriedRice);
  console.log('Pronoun detected tool:', pronounDetected.toolName, 'productId:', pronounDetected.toolArgs?.productId);
  assert.strictEqual(pronounDetected.toolName, 'check_product_stock');
  assert.strictEqual(pronounDetected.toolArgs?.productId, 'mock-fried-rice-id');
  console.log('✔ Test 3 Passed: Referential pronoun correctly checks previous item\n');

  // Test 4: Explicit subject stock check ("is the hungry box meal in stock?")
  console.log('4. Testing explicit subject stock check ("is the hungry box meal in stock?")...');
  const explicitDetected = payaiOrchestrator._detectIntent('is the hungry box meal in stock?', { marketCode: 'NIGERIA' }, simulatedContextWithFriedRice);
  console.log('Explicit detected tool:', explicitDetected.toolName, 'productQuery:', explicitDetected.toolArgs?.productQuery);
  assert.strictEqual(explicitDetected.toolName, 'check_product_stock');
  assert.strictEqual(explicitDetected.toolArgs?.productQuery, 'hungry box meal');
  console.log('✔ Test 4 Passed: Explicit product subject overrides previous product\n');

  // Test 5: aiService chat response for ingredient stock
  console.log('5. Testing aiService chat response for ingredient stock...');
  const aiReply = await aiService.generateChatResponse([
    { role: 'user', content: 'ohh thanks. are all ingredient available in stock' }
  ], {});
  console.log('--- aiService Reply Preview ---');
  console.log(aiReply.slice(0, 300) + '...\n');
  assert.ok(!aiReply.includes('Only 3 units remain in stock with verified seller Fakunle Faruq'), 'aiService must not claim fried rice and chicken low stock');
  assert.ok(
    aiReply.toLowerCase().includes('ingredient') ||
    aiReply.toLowerCase().includes('grocery') ||
    aiReply.toLowerCase().includes('market') ||
    aiReply.toLowerCase().includes('stock'),
    'aiService must address ingredient / grocery stock'
  );
  console.log('✔ Test 5 Passed: aiService response correctly addresses ingredients without meal confusion\n');

  console.log('🎉 ALL AI ACCURACY & INGREDIENT INVENTORY TESTS PASSED SUCCESSFULLY!');
}

testAIAccuracy().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
