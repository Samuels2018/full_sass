import React, { useState, useEffect } from 'react';
import { Plan } from '../../types/suscriptionsTypes';

interface SubscriptionFormProps {
  plans: Plan[];
  onSubmit: (planId: string, planData?: any) => void;
  initialPlanId?: string;
  loading?: boolean;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  plans,
  onSubmit,
  initialPlanId,
  loading,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || '');
  const [customPlan, setCustomPlan] = useState(false);
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    price: 0,
    billingCycle: 'monthly',
    features: [''],
  });

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlanId(e.target.value);
    setCustomPlan(false);
  };

  const handleCustomPlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...planData.features];
    newFeatures[index] = value;
    setPlanData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setPlanData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...planData.features];
    newFeatures.splice(index, 1);
    setPlanData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPlan) {
      onSubmit('', planData);
    } else {
      onSubmit(selectedPlanId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select a Plan</label>
        <div className="flex items-center mb-4">
          <select
            value={selectedPlanId}
            onChange={handlePlanChange}
            disabled={customPlan}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a plan...</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.price}/{plan.billingCycle})
              </option>
            ))}
          </select>
          <span className="mx-4 text-gray-500">or</span>
          <button
            type="button"
            onClick={() => {
              setCustomPlan(!customPlan);
              setSelectedPlanId('');
            }}
            className={`px-4 py-2 rounded-md ${customPlan ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Create Custom Plan
          </button>
        </div>

        {customPlan && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="text-lg font-semibold mb-3">Custom Plan Details</h3>
            
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                name="name"
                value={planData.name}
                onChange={handleCustomPlanChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={planData.description}
                onChange={handleCustomPlanChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={planData.price}
                  onChange={handleCustomPlanChange}
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Billing Cycle</label>
                <select
                  name="billingCycle"
                  value={planData.billingCycle}
                  onChange={e => setPlanData(prev => ({ ...prev, billingCycle: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Features</label>
              {planData.features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                  {planData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                + Add Feature
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || (!customPlan && !selectedPlanId)}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
      >
        {loading ? 'Processing...' : customPlan ? 'Create Custom Plan' : 'Subscribe'}
      </button>
    </form>
  );
};

export default SubscriptionForm;