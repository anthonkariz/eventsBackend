const http = require('node:http');
const test = require('node:test');
const assert = require('node:assert/strict');

require('dotenv').config();

const app = require('../src/app');

function makeRequest(server, method, path, body) {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : null;

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
            }
          : undefined,
      },
      (res) => {
        let data = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        });
      }
    );

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

function makeRawRequest(server, method, path, payload, headers) {
  const address = server.address();

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers,
      },
      (res) => {
        let data = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        });
      }
    );

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

test('GET /health returns ok status', async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, 'GET', '/health');
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { status: 'ok' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /auth/login validates required fields before DB access', async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, 'POST', '/auth/login', { email: '' });
    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, { error: 'Email and password are required' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /auth/register validates required fields before DB access', async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, 'POST', '/auth/register', { email: '' });
    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, { error: 'Name, email and password are required' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /auth/register returns descriptive error for malformed JSON', async () => {
  const server = app.listen(0);

  try {
    const invalidPayload = '{"email":"x@example.com"';
    const response = await makeRawRequest(server, 'POST', '/auth/register', invalidPayload, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(invalidPayload),
    });

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, { error: 'Invalid JSON payload' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});