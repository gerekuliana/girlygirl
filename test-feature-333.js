const GirlyGirl = require('./index.js');

console.log('=== Testing Feature 333 ===\n');

const testApp = new GirlyGirl();
testApp.initialize();

console.log('\n1. Check initial Feature 333 status:');
console.log(testApp.getFeature333Status());

console.log('\n2. Try to process without enabling Feature 333:');
const result1 = testApp.processWithFeature333({ test: 'data' });
console.log('Result:', result1);

console.log('\n3. Enable Feature 333:');
const enableResult = testApp.enableFeature333();
console.log('Enable result:', enableResult);

console.log('\n4. Process with Feature 333 enabled:');
const testData = {
  id: 1,
  name: 'Test Item',
  value: 333,
  nested: {
    property: 'value'
  }
};
const result2 = testApp.processWithFeature333(testData);
console.log('Processed result:', result2);

console.log('\n5. Final Feature 333 status:');
console.log(testApp.getFeature333Status());

console.log('\n6. All features list:');
testApp.listFeatures();

console.log('\n=== Test Complete ===');