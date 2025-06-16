const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const { expect } = chai;
const { mockRequest, mockResponse } = require('mock-req-res');

chai.use(chaiAsPromised);

// Importamos el controlador y las dependencias
const suscribePlanController = require('../src/controllers/suscribePlanController');
const suscriptionsService = require('../src/services/suscriptionsService');
const planService = require('../src/services/planService');
const calculateNextBilling = require('../src/helpers/calculateNextBilling');

describe('suscribePlanController', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = mockRequest();
    res = mockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  
  describe('Success cases', () => {
    it('should create subscription successfully with monthly billing', async () => {
      const mockPlan = { id: 1, name: 'Premium', billingCycle: 'monthly' };
      const mockSubscription = { 
        id: 1, 
        userId: 'user123', 
        planId: 1,
        toJSON: () => ({ id: 1, userId: 'user123', planId: 1 })
      };
  
      req.body = { userId: 'user123', planId: 1 };
      sandbox.stub(planService, 'getPlansById').resolves(mockPlan);
      sandbox.stub(suscriptionsService, 'existingSubscription').resolves(null);
      sandbox.stub(suscriptionsService, 'suscribePlanService').resolves(mockSubscription);
      sandbox.stub(calculateNextBilling, 'calculateNextBillingDate').returns(new Date('2023-12-01'));
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal('Subscription created successfully');
      expect(response.suscription).to.have.property('plan');
      expect(response.suscription.plan).to.deep.equal(mockPlan);
    });
  
    it('should calculate correct billing dates for annual plan', async () => {
      const mockPlan = { id: 2, name: 'Annual', billingCycle: 'annual' };
      req.body = { userId: 'user123', planId: 2 };
      
      sandbox.stub(planService, 'getPlansById').resolves(mockPlan);
      sandbox.stub(suscriptionsService, 'existingSubscription').resolves(null);
      sandbox.stub(suscriptionsService, 'suscribePlanService').resolves({ 
        id: 2,
        toJSON: () => ({ id: 2 })
      });
  
      const calculateStub = sandbox.stub(calculateNextBilling, 'calculateNextBillingDate');
      calculateStub.returns(new Date('2024-11-01'));
  
      await suscribePlanController(req, res);
  
      expect(calculateStub.calledOnce).to.be.true;
      const [startDate, billingCycle] = calculateStub.getCall(0).args;
      expect(billingCycle).to.equal('annual');
    });
  });


  describe('Error cases', () => {
    it('should return 400 if planId is missing', async () => {
      req.body = { userId: 'user123' };
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Plan ID is required' })).to.be.true;
    });
  
    it('should return 404 if plan is not found', async () => {
      req.body = { userId: 'user123', planId: 999 };
      sandbox.stub(planService, 'getPlansById').resolves(null);
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Plan not found' })).to.be.true;
    });
  
    it('should return 400 if user already has active subscription', async () => {
      req.body = { userId: 'user123', planId: 1 };
      sandbox.stub(planService, 'getPlansById').resolves({ id: 1, billingCycle: 'monthly' });
      sandbox.stub(suscriptionsService, 'existingSubscription').resolves({ id: 1 });
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'User already has an active subscription' })).to.be.true;
    });
  
    it('should return 500 if subscription creation fails', async () => {
      req.body = { userId: 'user123', planId: 1 };
      sandbox.stub(planService, 'getPlansById').resolves({ id: 1, billingCycle: 'monthly' });
      sandbox.stub(suscriptionsService, 'existingSubscription').resolves(null);
      sandbox.stub(suscriptionsService, 'suscribePlanService').resolves(null);
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Error creating subscription' })).to.be.true;
    });
  });

  describe('Internal server errors', () => {
    it('should handle errors from getPlansById', async () => {
      req.body = { userId: 'user123', planId: 1 };
      sandbox.stub(planService, 'getPlansById').rejects(new Error('DB Error'));
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Internal server error' })).to.be.true;
    });
  
    it('should handle errors from existingSubscription', async () => {
      req.body = { userId: 'user123', planId: 1 };
      sandbox.stub(planService, 'getPlansById').resolves({ id: 1 });
      sandbox.stub(suscriptionsService, 'existingSubscription').rejects(new Error('DB Error'));
  
      await suscribePlanController(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

});