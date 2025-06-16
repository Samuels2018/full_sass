'use strict'

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { mockRequest, mockResponse } = require('mock-req-res');

// Importamos el controlador y dependencias
const { changeSubscriptionController } = require('../controllers/subscriptionController');
const subscriptionService = require('../services/suscriptionsService');
const planService = require('../services/planService');

describe('changeSubscriptionController', () => {
  let req, res, sandbox;
  const mockDate = new Date('2023-01-01');

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = mockRequest();
    res = mockResponse();
    sandbox.useFakeTimers(mockDate); // Para fechas consistentes en pruebas
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Validation errors', () => {
    it('should return 400 if userId is missing', async () => {
      req.body = { planId: 1 };
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'User ID is required' })).to.be.true;
    });

    it('should return 400 if planId is missing', async () => {
      req.body = { userId: 'user123' };
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Plan ID is required' })).to.be.true;
    });
  });

  describe('Business logic errors', () => {
    beforeEach(() => {
      req.body = { userId: 'user123', planId: 1 };
    });

    it('should return 404 if plan is not found', async () => {
      sandbox.stub(planService, 'getPlansById').resolves(null);
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Plan not found' })).to.be.true;
    });

    it('should return 400 if user has no active subscription', async () => {
      sandbox.stub(planService, 'getPlansById').resolves({ id: 1 });
      sandbox.stub(subscriptionService, 'existingSubscription').resolves(null);
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'User does not have an active subscription' })).to.be.true;
    });

    it('should return 500 if update fails', async () => {
      sandbox.stub(planService, 'getPlansById').resolves({ id: 1 });
      sandbox.stub(subscriptionService, 'existingSubscription').resolves({ 
        id: 1,
        planId: 2,
        startDate: mockDate,
        endDate: null,
        nextBillingDate: mockDate,
        status: 'active',
        toJSON: () => ({ id: 1 })
      });
      sandbox.stub(subscriptionService, 'updatePlanService').resolves(null);
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Error updating subscription' })).to.be.true;
    });
  });

  describe('Successful updates', () => {
    const mockPlan = { id: 1, name: 'Premium', price: 9.99 };
    const mockSubscription = {
      id: 1,
      userId: 'user123',
      planId: 2,
      startDate: mockDate,
      endDate: null,
      nextBillingDate: mockDate,
      status: 'active',
      toJSON: () => ({
        id: 1,
        userId: 'user123',
        planId: 2,
        status: 'active'
      })
    };

    beforeEach(() => {
      req.body = { 
        userId: 'user123', 
        planId: 1,
        status: 'paused',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-12-31'),
        nextBillingDate: new Date('2023-03-01')
      };
      sandbox.stub(planService, 'getPlansById').resolves(mockPlan);
      sandbox.stub(subscriptionService, 'existingSubscription').resolves(mockSubscription);
      sandbox.stub(subscriptionService, 'updatePlanService').resolves({
        ...mockSubscription,
        planId: 1,
        status: 'paused',
        toJSON: () => ({
          ...mockSubscription.toJSON(),
          planId: 1,
          status: 'paused'
        })
      });
    });

    it('should successfully update subscription plan', async () => {
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal('Subscription updated successfully');
      expect(response.subscription.planId).to.equal(1);
      expect(response.subscription.plan).to.deep.equal(mockPlan);
    });

    it('should maintain original values when no new values provided', async () => {
      req.body = { userId: 'user123', planId: 1 };
      await changeSubscriptionController(req, res);
      
      const updateArgs = subscriptionService.updatePlanService.getCall(0).args;
      expect(updateArgs[0]).to.equal('user123'); // userId
      expect(updateArgs[1]).to.equal(1); // new planId
      expect(updateArgs[2]).to.equal('active'); // original status
      expect(updateArgs[3]).to.deep.equal(mockDate); // original startDate
    });

    it('should update only changed fields', async () => {
      req.body = { 
        userId: 'user123', 
        planId: 1,
        status: 'paused'
      };
      await changeSubscriptionController(req, res);
      
      const updateArgs = subscriptionService.updatePlanService.getCall(0).args;
      expect(updateArgs[2]).to.equal('paused'); // new status
      expect(updateArgs[3]).to.deep.equal(mockDate); // original startDate
    });
  });

  describe('Error handling', () => {
    it('should return 500 if service throws unexpected error', async () => {
      req.body = { userId: 'user123', planId: 1 };
      sandbox.stub(planService, 'getPlansById').rejects(new Error('DB Error'));
      await changeSubscriptionController(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Internal server error' })).to.be.true;
    });
  });
});