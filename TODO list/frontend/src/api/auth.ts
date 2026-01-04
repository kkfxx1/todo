import axios from 'axios'
import type { AuthRequest, AuthResponse } from '@/types/auth'

const authApiInstance = axios.create({
  baseURL: '/api/auth',
  timeout: 10000,
})

export const authApi = {
  login: (credentials: AuthRequest) => authApiInstance.post<AuthResponse>('/login', credentials),
  register: (credentials: AuthRequest) => authApiInstance.post<string>('/register', credentials),
}
