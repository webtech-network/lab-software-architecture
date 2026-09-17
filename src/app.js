const express = require('express');

const app = express();
app.use(express.json());

// Este arquivo e ruim de proposito. Nao use como referencia para producao.
// Durante o workshop, vamos descobrir juntos por que ele se torna dificil de mudar.
const products = [
  { sku: 'BOOK', name: 'Livro de JavaScript', priceInCents: 5000, stock: 10 },
  { sku: 'MUG', name: 'Caneca', priceInCents: 3000, stock: 5 },
  { sku: 'TSHIRT', name: 'Camiseta', priceInCents: 8000, stock: 3 },
];

const orders = [];
const sentEmails = [];
let nextOrderId = 1;

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/orders', (request, response) => {
  const { customer, items, coupon, shipping, payment } = request.body;

  if (!customer || !customer.name || !customer.email) {
    return response.status(400).json({ error: 'Customer is required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ error: 'Order must have at least one item' });
  }

  if (!shipping || !['pickup', 'delivery'].includes(shipping.type)) {
    return response.status(400).json({ error: 'Invalid shipping type' });
  }

  if (!payment || !['credit_card', 'boleto','pix'].includes(payment.method)) {
    return response.status(400).json({ error: 'Invalid payment method' });
  }

  const orderItems = [];
  let subtotalInCents = 0;

  for (const requestedItem of items) {
    const product = products.find((candidate) => candidate.sku === requestedItem.sku);

    if (!product) {
      return response.status(404).json({ error: `Product ${requestedItem.sku} not found` });
    }

    if (!Number.isInteger(requestedItem.quantity) || requestedItem.quantity <= 0) {
      return response.status(400).json({ error: 'Quantity must be a positive integer' });
    }

    if (product.stock < requestedItem.quantity) {
      return response.status(409).json({ error: `Insufficient stock for ${product.sku}` });
    }

    const itemTotalInCents = product.priceInCents * requestedItem.quantity;
    subtotalInCents += itemTotalInCents;
    orderItems.push({
      sku: product.sku,
      name: product.name,
      quantity: requestedItem.quantity,
      unitPriceInCents: product.priceInCents,
      totalInCents: itemTotalInCents,
    });
  }

  let discountInCents = 0;

  if (customer.type === 'vip') {
    discountInCents += Math.round(subtotalInCents * 0.1);
  } 
  
  if (customer.type === 'student') 
  {
    discountInCents += Math.round(subtotalInCents * 0.1);
  }

  if (coupon === 'WELCOME10') {
    discountInCents += Math.round((subtotalInCents - discountInCents) * 0.1);
  }

  if (payment.method === 'pix') 
  {
    discountInCents += Math.round((subtotalInCents - discountInCents) * 0.05);
  }

  let shippingInCents = 0;
  if (shipping.type === 'delivery' && (subtotalInCents - discountInCents) < 10000) {
    shippingInCents = shipping.state === 'SP' ? 1500 : 3000;
  }

  let paymentFeeInCents = 0;
  const amountBeforePaymentInCents = subtotalInCents - discountInCents + shippingInCents;

  if (payment.method === 'credit_card') {
    if (!payment.token) {
      return response.status(400).json({ error: 'Card token is required' });
    }

    if (payment.token === 'declined') {
      return response.status(422).json({ error: 'Payment was declined' });
    }

    paymentFeeInCents = Math.round(amountBeforePaymentInCents * 0.02);
  }

  const totalInCents = amountBeforePaymentInCents + paymentFeeInCents;

  for (const item of orderItems) {
    const product = products.find((candidate) => candidate.sku === item.sku);
    product.stock -= item.quantity;
  }

  const order = {
    id: nextOrderId++,
    customer,
    items: orderItems,
    coupon: coupon || null,
    shipping,
    paymentMethod: payment.method,
    paymentStatus: payment.method === 'boleto' ? 'pending' : 'paid',
    subtotalInCents,
    discountInCents,
    shippingInCents,
    paymentFeeInCents,
    totalInCents,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  sentEmails.push({
    to: customer.email,
    subject: `Pedido #${order.id} confirmado`,
    body: `O total do seu pedido e R$ ${(totalInCents / 100).toFixed(2)}`,
  });

  return response.status(201).json(order);
});

// Apoio apenas aos testes. O acoplamento deste reset com todos os dados tambem e intencional.
function resetState() {
  products.find((product) => product.sku === 'BOOK').stock = 10;
  products.find((product) => product.sku === 'MUG').stock = 5;
  products.find((product) => product.sku === 'TSHIRT').stock = 3;
  orders.length = 0;
  sentEmails.length = 0;
  nextOrderId = 1;
}

module.exports = { app, resetState };
