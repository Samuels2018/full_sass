import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../features/store';
import { getActiveSubscription } from '../../features/subscription/subscriptionThunks';
import SubscriptionCard from '../../components/subscriptions/SubscriptionCard';
import Loader from '../../components/subscriptions/Loader';
import Alert from '../../components/subscriptions/Alert';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentSubscription, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );

  // Suponiendo que tenemos el userId del usuario autenticado
  const userId = 'user-id-from-auth'; // Reemplazar con tu lógica de autenticación

  useEffect(() => {
    dispatch(getActiveSubscription(userId));
  }, [dispatch, userId]);

  const handleUpgrade = () => {
    navigate('/change-subscription');
  };

  const handleCancel = async () => {
    // Lógica para cancelar suscripción
    try {
      // Aquí podrías despachar una acción para cancelar la suscripción
      // await dispatch(cancelSubscription(userId));
      alert('Subscription canceled successfully');
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Subscription</h1>
      
      {currentSubscription ? (
        <div className="max-w-2xl mx-auto">
          <SubscriptionCard
            subscription={currentSubscription}
            billingInfo={{
              nextBillingDate: currentSubscription.nextBillingDate,
              billingCycle: currentSubscription.plan.billingCycle,
              daysUntilRenewal: Math.ceil(
                (new Date(currentSubscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              ),
            }}
            onUpgrade={handleUpgrade}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Active Subscription</h2>
          <p className="text-gray-600 mb-6">You don't have an active subscription yet.</p>
          <button
            onClick={() => navigate('/subscribe')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;