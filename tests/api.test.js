const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Health Check', () => {
  it('should return 200 OK for health endpoint', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('Auth Endpoints', () => {
  let testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };
  
  // Clean up test users before tests
  beforeAll(async () => {
    await User.deleteMany({ email: { $regex: /test.*@example\.com/ } });
  });

  // Clean up test users after tests
  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /test.*@example\.com/ } });
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('should login an existing user', async () => {
    const credentials = {
      email: testUser.email,
      password: testUser.password
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
