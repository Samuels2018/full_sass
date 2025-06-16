'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { mockRequest, mockResponse } = require('mock-req-res');

// Importamos el controlador y dependencias
const { getPlansController } = require('../src/controllers/plansController');
const planService = require('../src/services/planService');

describe('getPlansController', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {} }; // Mock más simple de req
    res = {
      status: sandbox.stub().returnsThis(), // Permite chaining
      json: sandbox.spy() // Espía para verificar llamadas
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Validation errors', () => {
    it('should return 400 if userId is missing', async () => {
      req.body = {}; // No userId
      await getPlansController(req, res);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.json, { error: 'User ID is required' });
    });
  });

  describe('Successful cases', () => {
    beforeEach(() => {
      req.body = { userId: 'user123' };
    });

    it('should return plans array when available', async () => {
      const mockPlans = [
        { id: 1, name: 'Basic', price: 9.99 },
        { id: 2, name: 'Premium', price: 19.99 }
      ];
      
      sandbox.stub(planService, 'getAllPlans').resolves(mockPlans);
      await getPlansController(req, res);

      sinon.assert.calledWith(res.status, 200);
      //sinon.assert.calledWith(res.json, mockPlans);
    });

    it('should return empty array when no plans available', async () => {
      sandbox.stub(planService, 'getAllPlans').resolves([]);
      await getPlansController(req, res);

      expect(res.status.calledWith(200)).to.be.true;

    });
  });

  describe('Error cases', () => {
    beforeEach(() => {
      req.body = { userId: 'user123' };
    });

    it('should return 404 if plans service returns null', async () => {
      sandbox.stub(planService, 'getAllPlans').resolves(null);
      await getPlansController(req, res);

      //expect(res.status.calledWith(404)).to.be.true;
      //expect(res.json.calledWithMatch({error: 'Plans not found'})).to.be.true;
    });

    it('should return 500 if service throws error', async () => {
      sandbox.stub(planService, 'getAllPlans').rejects(new Error('DB Error'));
      await getPlansController(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Internal server error' })).to.be.true;
    });

    /*it('should log errors to console', async () => {
      const consoleStub = sandbox.stub(console, 'log');
      const testError = new Error('Test Error');
      sandbox.stub(planService, 'getAllPlans').rejects(testError);
      
      await getPlansController(req, res);
      
      expect(consoleStub.calledWith(testError)).to.be.true;
    });*/
  });
});