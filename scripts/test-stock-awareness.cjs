'use strict';
const assert = require('assert');
const payaiOrchestrator = require('../backend/src/services/payai/payaiOrchestrator');
const catalogSearchService = require('../backend/src/services/payai/catalogSearchService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runStockTests() {
  console.log('=== Testing PayAI Product Finish, Not Found, Out of Stock & Scarcity Awareness ===\n');

  // Find or create test products to test the 3 stock states
  let store = await prisma.store.findFirst();
  if (!store) {
    const user = await prisma.user.findFirst({ where: { role: 'SELLER' } });
    store = await prisma.store.create({
      data: {
        storeName: 'Test Stock Store',
        sellerId: user ? user.id : 'test-seller-id',
        isVerified: true
      }
    });
  }

  // 1. Finished Product (stock = 0)
  let finishedProduct = await prisma.product.findFirst({ where: { title: 'Test Finished Product' } });
  if (!finishedProduct) {
    finishedProduct = await prisma.product.create({
      data: {
        title: 'Test Finished Product',
        description: 'A product that has finished and is out of stock',
        price: 8500,
        stock: 0,
        category: 'Food',
        storeId: store.id
      }
    });
  } else {
    await prisma.product.update({ where: { id: finishedProduct.id }, data: { stock: 0 } });
  }

  // 2. Low Stock Product (stock = 3)
  let lowStockProduct = await prisma.product.findFirst({ where: { title: 'Test Low Stock Product' } });
  if (!lowStockProduct) {
    lowStockProduct = await prisma.product.create({
      data: {
        title: 'Test Low Stock Product',
        description: 'Only 3 units remaining in stock',
        price: 12000,
        stock: 3,
        category: 'Gadgets',
        storeId: store.id
      }
    });
  } else {
    await prisma.product.update({ where: { id: lowStockProduct.id }, data: { stock: 3 } });
  }

  // Test 1: Detecting "product finish" / "is it finished"
  console.log('1. Testing Intent Detection for "product finish" and "is it finished"...');
  const finishIntent = payaiOrchestrator._detectIntent('is the Test Finished Product finished?', { marketCode: 'NIGERIA' }, {});
  console.log('Detected Tool for finish check:', finishIntent.toolName);
  assert.strictEqual(finishIntent.toolName, 'check_product_stock');
  console.log('✔ Test 1 Passed: "is it finished" correctly routed to check_product_stock\n');

  // Test 2: Check stock on finished product
  console.log('2. Testing stock check output for finished / out-of-stock product...');
  const finishRes = await catalogSearchService.checkProductStock(finishedProduct.id);
  assert.strictEqual(finishRes.isFinished, true, 'Must flag isFinished: true');
  assert.strictEqual(finishRes.isOutOfStock, true, 'Must flag isOutOfStock: true');
  assert.strictEqual(finishRes.stock, 0, 'Stock must be 0');

  const finishReply = payaiOrchestrator._generateResponse('check_product_stock', finishRes, 'is it finished?');
  console.log('--- Finish Response Preview ---');
  console.log(finishReply.slice(0, 300) + '...\n');
  assert.ok(finishReply.includes('Finished / Out of Stock'), 'Must state Product Finished / Out of Stock');
  assert.ok(finishReply.includes('0 units remaining'), 'Must mention 0 units remaining');
  assert.ok(finishReply.includes('Alert Me When Restocked'), 'Must provide restock notification prompt');
  console.log('✔ Test 2 Passed: Finished product explains 0 stock & offers restock alert\n');

  // Test 3: Low stock inquiry: "only 3 remain in stock"
  console.log('3. Testing stock check for low stock product (stock = 3)...');
  const lowStockRes = await catalogSearchService.checkProductStock(lowStockProduct.id);
  assert.strictEqual(lowStockRes.isLowStock, true, 'Must flag isLowStock: true');
  assert.strictEqual(lowStockRes.stock, 3, 'Stock must be exactly 3');

  const lowStockReply = payaiOrchestrator._generateResponse('check_product_stock', lowStockRes, 'how many remain in stock?');
  console.log('--- Low Stock Response Preview ---');
  console.log(lowStockReply.slice(0, 300) + '...\n');
  assert.ok(lowStockReply.includes('Only 3 units remain in stock'), 'Must highlight "Only 3 units remain in stock"');
  assert.ok(lowStockReply.includes('Low Stock Alert'), 'Must display Low Stock Alert');
  console.log('✔ Test 3 Passed: Low stock urgency clearly communicated\n');

  // Test 4: Product Not Found in W-Commerce market
  console.log('4. Testing product not found in W-Commerce market...');
  const notFoundRes = await catalogSearchService.checkProductStock('NonExistentQuantumTeleporter999');
  assert.strictEqual(notFoundRes.found, false, 'Must flag found: false');
  assert.strictEqual(notFoundRes.notFound, true, 'Must flag notFound: true');

  const notFoundReply = payaiOrchestrator._generateResponse('check_product_stock', notFoundRes, 'is NonExistentQuantumTeleporter999 in stock?');
  console.log('--- Not Found Response Preview ---');
  console.log(notFoundReply.slice(0, 300) + '...\n');
  assert.ok(notFoundReply.includes('Product Not Found in W-Commerce Market'), 'Must state Product Not Found in W-Commerce Market');
  assert.ok(notFoundReply.includes('Amazon, AliExpress, Jumia, or Konga'), 'Must provide global sourcing guidance');
  console.log('✔ Test 4 Passed: Unlisted product explains not found & gives import guidance\n');

  // Test 5: Attempting to add an out-of-stock product to cart
  console.log('5. Testing add_to_cart rejection on out-of-stock / finished item...');
  const cartRes = await payaiOrchestrator.executeTool({
    toolName: 'add_to_cart',
    toolArgs: {
      userPrompt: `add ${finishedProduct.title} to cart`,
      productId: finishedProduct.id
    },
    sessionId: 'test-session',
    marketCode: 'NIGERIA'
  });
  console.log('Cart add success status:', cartRes.success);
  assert.strictEqual(cartRes.success, false, 'Cart add must fail when product is finished');
  assert.strictEqual(cartRes.isOutOfStock, true, 'Must flag isOutOfStock');
  const cartReply = payaiOrchestrator._generateResponse('add_to_cart', cartRes, `add ${finishedProduct.title} to cart`);
  assert.ok(cartReply.includes('Finished / Out of Stock'), 'Cart response must state Finished / Out of Stock');
  console.log('✔ Test 5 Passed: Finished product cannot be added to cart\n');

  // Test 6: Requesting 10 units of an item with only 3 units in stock
  console.log('6. Testing add_to_cart quantity capping when requestedQty exceeds stock...');
  const cappedCartRes = await payaiOrchestrator.executeTool({
    toolName: 'add_to_cart',
    toolArgs: {
      userPrompt: `buy 10 ${lowStockProduct.title}`,
      productId: lowStockProduct.id,
      quantity: 10
    },
    sessionId: 'test-session',
    marketCode: 'NIGERIA'
  });
  console.log('Capped Cart result:', {
    success: cappedCartRes.success,
    isPartialStock: cappedCartRes.isPartialStock,
    requestedQuantity: cappedCartRes.requestedQuantity,
    actualQuantity: cappedCartRes.actualQuantity
  });
  assert.strictEqual(cappedCartRes.success, true);
  assert.strictEqual(cappedCartRes.isPartialStock, true, 'Must flag isPartialStock');
  assert.strictEqual(cappedCartRes.actualQuantity, 3, 'Must cap actualQuantity to remaining stock (3)');
  assert.strictEqual(cappedCartRes.requestedQuantity, 10, 'Must record requestedQuantity (10)');
  console.log('✔ Test 6 Passed: Quantity capped to remaining stock with partial stock alert\n');

  console.log('🎉 ALL STOCK AWARENESS TESTS PASSED SUCCESSFULLY!');
}

runStockTests()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Stock test failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
