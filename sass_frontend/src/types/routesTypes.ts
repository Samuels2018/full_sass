export interface RouteData {
  uuid?: string;
  name: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  vehicle_plate: string;
}

export interface RoutesState {
  loading: boolean;
  error: string | null;
  success: boolean;
}