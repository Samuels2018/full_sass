import React from 'react';
import { SubscriptionWithPlan, BillingInfo } from '../../types/suscriptionsTypes';

interface SubscriptionCardProps {
  subscription: SubscriptionWithPlan;
  billingInfo: BillingInfo;
  onUpgrade?: () => void;
  onCancel?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  billingInfo,
  onUpgrade,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{subscription.plan.name}</h2>
      <p className="text-gray-600 mb-4">{subscription.plan.description}</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Plan Details</h3>
        <ul className="list-disc pl-5">
          {subscription.plan.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Billing Information</h3>
        <p className="text-gray-700">
          <span className="font-medium">Price:</span> ${subscription.plan.price.toFixed(2)} / {subscription.plan.billingCycle}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Status:</span> {subscription.status}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Next Billing Date:</span> {new Date(billingInfo.nextBillingDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Days Until Renewal:</span> {billingInfo.daysUntilRenewal}
        </p>
      </div>

      <div className="flex space-x-4">
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Change Plan
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Cancel Subscription
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;