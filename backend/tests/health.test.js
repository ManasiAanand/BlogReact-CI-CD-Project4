const request = require('supertest');
const app = require('../src/server');

describe('Blog API Health Check', () => {
  test('GET /healthz should return 200 and status ok', async () => {
    const response = await request(app).get('/healthz');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
