#!/usr/bin/env node

/**
 * Comprehensive API Route Testing Script
 * Tests all endpoints to ensure they work correctly
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/v1`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0
};

let authToken = null;
let testUserId = null;
let testVehicleId = null;
let testStoryId = null;

// Helper functions
function log(type, message) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    test: '🧪'
  };
  
  const colorMap = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.cyan,
    test: colors.blue
  };
  
  console.log(`${colorMap[type]}${icons[type]} ${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60) + '\n');
}

async function testEndpoint(name, fn) {
  testResults.total++;
  try {
    log('test', `Testing: ${name}`);
    await fn();
    testResults.passed++;
    log('success', `PASSED: ${name}`);
    return true;
  } catch (error) {
    testResults.failed++;
    log('error', `FAILED: ${name}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

// Test functions
async function testHealthCheck() {
  const response = await axios.get(`${API_URL}/health`);
  if (response.data.success !== true) {
    throw new Error('Health check failed');
  }
}

async function testWelcome() {
  const response = await axios.get(`${BASE_URL}/`);
  if (!response.data.success || !response.data.endpoints) {
    throw new Error('Welcome route failed');
  }
}

async function testRegister() {
  const timestamp = Date.now();
  const response = await axios.post(`${API_URL}/auth/register`, {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'TestPass123!',
    role: 'user'
  });
  
  if (!response.data.success || !response.data.token) {
    throw new Error('Registration failed - no token');
  }
  
  authToken = response.data.token;
  testUserId = response.data.data?.id || response.data.data?._id;
  log('info', `Auth token obtained: ${authToken.substring(0, 20)}...`);
}

async function testLogin() {
  // Use the registered user
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!'
  });
  
  // This might fail if user doesn't exist yet, which is OK
  if (response.data.token) {
    authToken = response.data.token;
  }
}

async function testGetCurrentUser() {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Get current user failed');
  }
}

async function testCreateVehicle() {
  const response = await axios.post(`${API_URL}/vehicles`, {
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    type: 'electric',
    specifications: {
      engine: {
        type: 'Electric',
        horsepower: 1020
      },
      performance: {
        acceleration_0_60: 1.99,
        topSpeed: 200
      },
      battery: {
        capacity: 100,
        range: 396
      }
    }
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Create vehicle failed');
  }
  
  testVehicleId = response.data.data._id || response.data.data.id;
  log('info', `Created vehicle ID: ${testVehicleId}`);
}

async function testGetVehicles() {
  const response = await axios.get(`${API_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error('Get vehicles failed');
  }
  
  log('info', `Found ${response.data.data.length} vehicles`);
}

async function testGetVehicleById() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  const response = await axios.get(`${API_URL}/vehicles/${testVehicleId}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Get vehicle by ID failed');
  }
}

async function testCreateStory() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  const response = await axios.post(`${API_URL}/stories/generate`, {
    vehicleId: testVehicleId,
    useMockMode: true // Use mock mode to avoid API costs
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Create story failed');
  }
  
  testStoryId = response.data.data._id || response.data.data.id;
  log('info', `Created story ID: ${testStoryId}`);
}

async function testGetStories() {
  const response = await axios.get(`${API_URL}/stories`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error('Get stories failed');
  }
  
  log('info', `Found ${response.data.data.length} stories`);
}

async function testGetStoryById() {
  if (!testStoryId) {
    throw new Error('No test story ID available');
  }
  
  const response = await axios.get(`${API_URL}/stories/${testStoryId}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Get story by ID failed');
  }
}

async function testExportHTML() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  // Export as Marketing Deck (HTML-based)
  const response = await axios.post(`${API_URL}/export/${testVehicleId}/deck`, {}, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Export HTML/Deck failed');
  }
  
  log('info', `Exported Marketing Deck: ${response.data.data.filename}`);
}

async function testExportPDF() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  const response = await axios.post(`${API_URL}/export/${testVehicleId}/pdf`, {}, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Export PDF failed');
  }
  
  log('info', `Exported PDF: ${response.data.data.filename}`);
}

async function testExportVideo() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  const response = await axios.post(`${API_URL}/export/${testVehicleId}/video`, {
    useAI: false // Use fast animated version
  }, {
    headers: { Authorization: `Bearer ${authToken}` },
    timeout: 60000 // 60 second timeout for video generation
  });
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Export video failed');
  }
  
  log('info', `Exported video: ${response.data.data.filename} (${(response.data.data.size / 1024 / 1024).toFixed(2)} MB)`);
}

async function testUpdateVehicle() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  const response = await axios.put(`${API_URL}/vehicles/${testVehicleId}`, {
    make: 'Tesla',
    model: 'Model S Plaid+',
    year: 2025
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success) {
    throw new Error('Update vehicle failed');
  }
}

async function testDeleteStory() {
  if (!testStoryId) {
    throw new Error('No test story ID available');
  }
  
  const response = await axios.delete(`${API_URL}/stories/${testStoryId}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success) {
    throw new Error('Delete story failed');
  }
}

async function testDeleteVehicle() {
  if (!testVehicleId) {
    throw new Error('No test vehicle ID available');
  }
  
  const response = await axios.delete(`${API_URL}/vehicles/${testVehicleId}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!response.data.success) {
    throw new Error('Delete vehicle failed');
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n');
  console.log('🚀 AutoStory API Comprehensive Test Suite');
  console.log('==========================================\n');
  console.log(`Testing API at: ${BASE_URL}\n`);
  
  // Test 1: Health & Welcome
  logSection('1. HEALTH & INFO ENDPOINTS');
  await testEndpoint('Health Check', testHealthCheck);
  await testEndpoint('Welcome Route', testWelcome);
  
  // Test 2: Authentication
  logSection('2. AUTHENTICATION ENDPOINTS');
  await testEndpoint('User Registration', testRegister);
  await testEndpoint('Get Current User', testGetCurrentUser);
  
  // Test 3: Vehicles
  logSection('3. VEHICLE ENDPOINTS');
  await testEndpoint('Create Vehicle', testCreateVehicle);
  await testEndpoint('Get All Vehicles', testGetVehicles);
  await testEndpoint('Get Vehicle by ID', testGetVehicleById);
  await testEndpoint('Update Vehicle', testUpdateVehicle);
  
  // Test 4: Stories
  logSection('4. STORY ENDPOINTS');
  await testEndpoint('Create Story (Mock Mode)', testCreateStory);
  await testEndpoint('Get All Stories', testGetStories);
  await testEndpoint('Get Story by ID', testGetStoryById);
  
  // Test 5: Export
  logSection('5. EXPORT ENDPOINTS');
  await testEndpoint('Export HTML', testExportHTML);
  await testEndpoint('Export PDF', testExportPDF);
  log('info', 'Video export will take 30-40 seconds...');
  await testEndpoint('Export Video', testExportVideo);
  
  // Test 6: Cleanup
  logSection('6. CLEANUP (DELETE OPERATIONS)');
  await testEndpoint('Delete Story', testDeleteStory);
  await testEndpoint('Delete Vehicle', testDeleteVehicle);
  
  // Summary
  logSection('TEST SUMMARY');
  console.log(`Total Tests:  ${testResults.total}`);
  log('success', `Passed:       ${testResults.passed}`);
  log('error', `Failed:       ${testResults.failed}`);
  log('warning', `Skipped:      ${testResults.skipped}`);
  
  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  console.log(`\nPass Rate:    ${passRate}%`);
  
  if (testResults.failed === 0) {
    log('success', '\n🎉 ALL TESTS PASSED! API is working perfectly!');
  } else {
    log('error', `\n⚠️  ${testResults.failed} test(s) failed. Please review the errors above.`);
  }
  
  console.log('\n');
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServerStatus() {
  try {
    await axios.get(`${BASE_URL}/api/v1/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Start tests
(async () => {
  const isRunning = await checkServerStatus();
  
  if (!isRunning) {
    console.log('\n');
    log('error', 'Server is not running!');
    log('info', 'Please start the server first:');
    console.log('\n  npm start\n  or\n  npm run dev\n');
    process.exit(1);
  }
  
  runAllTests().catch(error => {
    console.error('\n❌ Test suite encountered an error:', error.message);
    process.exit(1);
  });
})();
