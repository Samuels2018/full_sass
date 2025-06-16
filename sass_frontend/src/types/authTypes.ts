export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access_token: string;
  expires_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
  re_password: string;
  first_name?: string;
  last_name?: string;
}

export interface ProfileData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  re_password?: string;
}