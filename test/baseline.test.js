const { beforeEach, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app, resetState } = require('../src/app');

beforeEach(resetState);

describe('POST /orders - comportamento existente', () => {
  test('creates an order paid by credit card', async () => {
    const response = await request(app).post('/orders').send({
      customer: { name: 'Ana', email: 'ana@example.com', type: 'regular' },
      items: [{ sku: 'BOOK', quantity: 1 }],
      shipping: { type: 'delivery', state: 'SP' },
      payment: { method: 'credit_card', token: 'valid-token' },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.subtotalInCents, 5000);
    assert.equal(response.body.shippingInCents, 1500);
    assert.equal(response.body.paymentFeeInCents, 130);
    assert.equal(response.body.totalInCents, 6630);
    assert.equal(response.body.paymentStatus, 'paid');
  });

  test('applies VIP and coupon discounts in sequence', async () => {
    const response = await request(app).post('/orders').send({
      customer: { name: 'Bia', email: 'bia@example.com', type: 'vip' },
      items: [{ sku: 'TSHIRT', quantity: 1 }],
      coupon: 'WELCOME10',
      shipping: { type: 'pickup' },
      payment: { method: 'boleto' },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.discountInCents, 1520);
    assert.equal(response.body.totalInCents, 6480);
    assert.equal(response.body.paymentStatus, 'pending');
  });

  test('rejects an order when stock is insufficient', async () => {
    const response = await request(app).post('/orders').send({
      customer: { name: 'Caio', email: 'caio@example.com', type: 'regular' },
      items: [{ sku: 'MUG', quantity: 6 }],
      shipping: { type: 'pickup' },
      payment: { method: 'boleto' },
    });

    assert.equal(response.status, 409);
    assert.match(response.body.error, /Insufficient stock/);
  });
});
