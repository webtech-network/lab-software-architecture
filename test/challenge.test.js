const { beforeEach, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app, resetState } = require('../src/app');

beforeEach(resetState);

describe('desafio pre-workshop', () => {
  test('gives students a 10% discount', async () => {
    const response = await createOrder({
      customer: { name: 'Dani', email: 'dani@example.com', type: 'student' },
      items: [{ sku: 'BOOK', quantity: 1 }],
      shipping: { type: 'pickup' },
      payment: { method: 'boleto' },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.discountInCents, 500);
    assert.equal(response.body.totalInCents, 4500);
  });

  test('accepts PIX and applies another 5% after other discounts', async () => {
    const response = await createOrder({
      customer: { name: 'Eli', email: 'eli@example.com', type: 'student' },
      items: [{ sku: 'BOOK', quantity: 2 }],
      shipping: { type: 'pickup' },
      payment: { method: 'pix' },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.discountInCents, 1450);
    assert.equal(response.body.paymentFeeInCents, 0);
    assert.equal(response.body.paymentStatus, 'paid');
    assert.equal(response.body.totalInCents, 8550);
  });

  test('gives free delivery when merchandise after discounts is at least R$ 100', async () => {
    const response = await createOrder({
      customer: { name: 'Fabi', email: 'fabi@example.com', type: 'student' },
      items: [{ sku: 'BOOK', quantity: 3 }],
      shipping: { type: 'delivery', state: 'RJ' },
      payment: { method: 'pix' },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.discountInCents, 2175);
    assert.equal(response.body.shippingInCents, 0);
    assert.equal(response.body.totalInCents, 12825);
  });

  test('keeps delivery cost below the free-shipping threshold', async () => {
    const response = await createOrder({
      customer: { name: 'Gabi', email: 'gabi@example.com', type: 'student' },
      items: [{ sku: 'BOOK', quantity: 2 }],
      shipping: { type: 'delivery', state: 'RJ' },
      payment: { method: 'pix' },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.shippingInCents, 3000);
    assert.equal(response.body.totalInCents, 11550);
  });
});

function createOrder(payload) {
  return request(app).post('/orders').send(payload);
}
