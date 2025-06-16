import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './subscription/subscriptionSlice';
import plansReducer from './subscription/plansSlice';
import deliveryReducer from './servicesApi/deliveriesSlice';
import routerReducer from './servicesApi/routesSlice';

export const store = configureStore({
  reducer: {
    subscription: subscriptionReducer,
    plans: plansReducer,
    deliveries: deliveryReducer,
    routes: routerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;