// src/__tests__/app.test.js
const request = require('supertest');
const express = require('express');

let app;

beforeAll(() => {
  app = require('../../app');
});

describe('Health endpoint', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
