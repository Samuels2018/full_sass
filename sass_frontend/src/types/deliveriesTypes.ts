export interface Delivery {
  id: number;
  route_id: number;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  package_weight: number;
  package_description: string;
  scheduled_at: string;
  delivery_instructions?: string;
  status: {
    code: string;
    name: string;
  };
}

export interface DeliveryFormData {
  route_id: number;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  package_weight: number;
  package_description: string;
  scheduled_at: string;
  delivery_instructions?: string;
  status_code?: string;
}

export interface StatusUpdateData {
  status_code: string;
  notes?: string;
}

export interface DeliveriesState {
  items: Delivery[];
  loading: boolean;
  error: string | null;
  success: boolean;
  currentPage: number;
  totalPages: number;
  filters: {
    status?: string;
    route_id?: number;
  };
}