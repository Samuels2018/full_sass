import React from 'react';
import { Plan } from '../../types/suscriptionsTypes';

interface SubscriptionListProps {
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ plans, onSelectPlan }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-500 transition duration-200">
          <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          
          <div className="mb-4">
            <span className="text-2xl font-bold">${plan.price.toFixed(2)}</span>
            <span className="text-gray-500">/{plan.billingCycle}</span>
          </div>

          <ul className="mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan(plan.id)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            Select Plan
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionList;