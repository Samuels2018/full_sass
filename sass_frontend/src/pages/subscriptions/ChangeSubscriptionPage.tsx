import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../features/store';
import { changeSubscription } from '../../features/subscription/subscriptionThunks';
import SubscriptionForm from '../../components/subscriptions/SubscriptionForm';
import Loader from '../../components/subscriptions/Loader';
import Alert from '../../components/subscriptions/Alert';
import { useNavigate } from 'react-router-dom';
import subscriptionApi from '../../services/subscriptionApi'; // Asegúrate de que la ruta sea correcta

const ChangeSubscriptionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.subscription);
  const [plans, setPlans] = useState<any[]>([]);

  // Suponiendo que tenemos el userId del usuario autenticado
  const userId = 'user-id-from-auth'; // Reemplazar con tu lógica de autenticación

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const availablePlans = await subscriptionApi.getAvailablePlans();
        setPlans(availablePlans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };

    fetchPlans();
  }, []);

  const handleSubmit = async (planId: string, planData?: any) => {
    try {
      await dispatch(changeSubscription(
        userId,
        planId,
        'active',
        undefined,
        undefined,
        undefined
      ));
      navigate('/subscription');
    } catch (err) {
      console.error('Failed to change subscription:', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Change Subscription</h1>
      
      {error && <Alert type="error" message={error}/>}

      <div className="max-w-2xl mx-auto">
        <SubscriptionForm
          plans={plans}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ChangeSubscriptionPage;