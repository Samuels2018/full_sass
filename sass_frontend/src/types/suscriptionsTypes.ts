// types.ts

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlansState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}


export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'paused';
  startDate: string;
  endDate: string | null;
  nextBillingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionWithPlan extends Subscription {
  plan: Plan;
}

export interface BillingInfo {
  nextBillingDate: string;
  billingCycle: string;
  daysUntilRenewal: number;
}

export interface SubscriptionState {
  currentSubscription: SubscriptionWithPlan | null;
  loading: boolean;
  error: string | null;
}