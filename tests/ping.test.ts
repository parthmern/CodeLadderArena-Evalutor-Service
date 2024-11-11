import request from 'supertest';

import app from "../src/index";


describe('GET /ping', () => {
    it('should return 200 and respond with "pong"', async () => {
      const response = await request(app).get('/api/v1/ping');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'PING check ok' });
    });
  });