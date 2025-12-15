const request = require('supertest');
const app = require('../src/server');

describe('API Health Check', () => {
  it('should return 200 OK for health endpoint', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('should login an existing user', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
