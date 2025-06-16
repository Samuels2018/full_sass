'use strict'

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { mockRequest, mockResponse } = require('mock-req-res');

// Importamos el controlador y dependencias
const { getActiveSubscriptionController } = require('../controllers/subscriptionController');
const subscriptionService = require('../services/suscriptionsService');
const planService = require('../services/planService');

describe('getActiveSubscriptionController', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = mockRequest();
    res = mockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Error cases', () => {
    it('should return 400 if userId is missing', async () => {
      req.body = {}; // No userId

      await getActiveSubscriptionController(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'User ID is required' })).to.be.true;
    });

    it('should return 404 if no active subscription found', async () => {
      req.body = { userId: 'user123' };
      sandbox.stub(subscriptionService, 'existingSubscription').resolves(null);

      await getActiveSubscriptionController(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'No active subscription found for this user' })).to.be.true;
    });

    it('should return 404 if associated plan not found', async () => {
      req.body = { userId: 'user123' };
      const mockSubscription = {
        planId: 1,
        toJSON: () => ({ planId: 1 })
      };
      
      sandbox.stub(subscriptionService, 'existingSubscription').resolves(mockSubscription);
      sandbox.stub(planService, 'getPlansById').resolves(null);

      await getActiveSubscriptionController(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Plan not found' })).to.be.true;
    });

    it('should return 500 if service throws an error', async () => {
      req.body = { userId: 'user123' };
      sandbox.stub(subscriptionService, 'existingSubscription').rejects(new Error('DB Error'));

      await getActiveSubscriptionController(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Internal server error' })).to.be.true;
    });
  });

  describe('Success cases', () => {
    it('should return active subscription with plan details', async () => {
      const mockSubscription = {
        planId: 1,
        nextBillingDate: new Date(Date.now() + 86400000), // 1 día en el futuro
        toJSON: () => ({
          planId: 1,
          nextBillingDate: new Date(Date.now() + 86400000)
        })
      };

      const mockPlan = {
        id: 1,
        name: 'Premium',
        billingCycle: 'monthly',
        price: 9.99
      };

      req.body = { userId: 'user123' };
      sandbox.stub(subscriptionService, 'existingSubscription').resolves(mockSubscription);
      sandbox.stub(planService, 'getPlansById').resolves(mockPlan);

      await getActiveSubscriptionController(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      
      const response = res.json.getCall(0).args[0];
      expect(response.hasSubscription).to.be.true;
      expect(response.subscription.plan).to.deep.equal(mockPlan);
      expect(response.billingInfo.daysUntilRenewal).to.be.approximately(1, 0.1);
    });

    it('should calculate correct days until renewal', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5); // 5 días en el futuro

      const mockSubscription = {
        planId: 1,
        nextBillingDate: futureDate,
        toJSON: () => ({
          planId: 1,
          nextBillingDate: futureDate
        })
      };

      req.body = { userId: 'user123' };
      sandbox.stub(subscriptionService, 'existingSubscription').resolves(mockSubscription);
      sandbox.stub(planService, 'getPlansById').resolves({ id: 1 });

      await getActiveSubscriptionController(req, res);

      const response = res.json.getCall(0).args[0];
      expect(response.billingInfo.daysUntilRenewal).to.be.approximately(5, 0.1);
    });
  });
});