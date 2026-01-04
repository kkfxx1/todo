export interface User {
  id: number;
  username: string;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}


export interface AuthRequest {
  username: string;
  password: string;
}


export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
}