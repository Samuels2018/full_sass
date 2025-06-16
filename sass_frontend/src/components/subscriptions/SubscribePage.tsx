// pages/SubscribePage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../features/store';
import { fetchPlans } from '../../features/subscription/plansThunks';
import { subscribeToPlan } from '../../features/subscription/subscriptionThunks';
import SubscriptionForm from './SubscriptionForm';
import Loader from './Loader';
import Alert from './Alert';
import { useNavigate, useParams } from 'react-router-dom';

const SubscribePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { planId } = useParams();
  const { plans, loading: plansLoading, error: plansError } = useSelector((state: RootState) => state.plans);
  const { loading: subscriptionLoading, error: subscriptionError } = useSelector((state: RootState) => state.subscription);

  // Suponiendo que tenemos el userId del usuario autenticado
  const userId = 'user-id-from-auth'; // Reemplazar con tu lógica de autenticación

  useEffect(() => {
    dispatch(fetchPlans(userId));
  }, [dispatch, userId]);

  const handleSubmit = async (selectedPlanId: string, planData?: any) => {
    try {
      await dispatch(subscribeToPlan(userId, selectedPlanId, planData));
      navigate('/subscription');
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  if (plansLoading) return <Loader />;
  if (plansError) return <Alert type="error" message={plansError} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscribe to a Plan</h1>
      
      {subscriptionError && <Alert type="error" message={subscriptionError} />}

      <div className="max-w-2xl mx-auto">
        <SubscriptionForm
          plans={plans.filter(plan => plan.isActive)}
          onSubmit={handleSubmit}
          initialPlanId={planId}
          loading={subscriptionLoading}
        />
      </div>
    </div>
  );
};

export default SubscribePage;