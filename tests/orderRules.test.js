// Automated test for Rule 3 (minimum order value).
// Run with:  npm test   (which runs: node --test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkMinimumOrder, getDeliveryFee, MIN_ORDER } from '../src/rules/orderRules.js';

test('valid: a Rs 1200 order meets the minimum', () => {
  const result = checkMinimumOrder(1200);
  assert.equal(result.ok, true);
  assert.equal(result.shortBy, 0);
});

test('boundary: exactly Rs 800 is allowed', () => {
  const result = checkMinimumOrder(MIN_ORDER);
  assert.equal(MIN_ORDER, 800);
  assert.equal(result.ok, true);
});

test('invalid: Rs 799 is blocked and says how much to add', () => {
  const result = checkMinimumOrder(799);
  assert.equal(result.ok, false);
  assert.equal(result.shortBy, 1);
  assert.match(result.message, /Add Rs 1 more/);
});

test('delivery fee: Rs 150 below Rs 2000, free from exactly Rs 2000', () => {
  assert.equal(getDeliveryFee(1999), 150);
  assert.equal(getDeliveryFee(2000), 0);
});
