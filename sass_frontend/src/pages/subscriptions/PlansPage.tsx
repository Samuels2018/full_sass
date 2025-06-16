// pages/PlansPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../features/store';
import { fetchPlans } from '../../features/subscription/plansThunks';
import SubscriptionList from '../../components/subscriptions/SubscriptionList';
import Loader from '../../components/subscriptions/Loader';
import Alert from '../../components/subscriptions/Alert';
import { useNavigate } from 'react-router-dom';

const PlansPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { plans, loading, error } = useSelector((state: RootState) => state.plans);

  // Suponiendo que tenemos el userId del usuario autenticado
  const userId = 'user-id-from-auth'; // Reemplazar con tu lógica de autenticación

  useEffect(() => {
    dispatch(fetchPlans(userId));
  }, [dispatch, userId]);

  const handleSelectPlan = (planId: string) => {
    navigate(`/subscribe/${planId}`);
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Plans</h1>
      
      {plans.length > 0 ? (
        <SubscriptionList 
          plans={plans.filter(plan => plan.isActive)} 
          onSelectPlan={handleSelectPlan} 
        />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Plans Available</h2>
          <p className="text-gray-600">There are no subscription plans available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default PlansPage;