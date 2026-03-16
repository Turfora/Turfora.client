import client from './client'
import { User } from '../types/user.types'

interface RegisterPayload {
  fullName: string
  email: string
  password: string
  role: 'USER' | 'OWNER'
}

interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: User
  }
  token?: string
  user?: User
}

interface LoginPayload {
  email: string
  password: string
  /** Optional role hint sent by the login screen's role selector */
  role?: 'USER' | 'OWNER' | 'ADMIN'
}

export const registerUser = async (payload: RegisterPayload) => {
  try {
    console.log('[Auth API] Registering user:', {
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role
    })
    
    const response = await client.post<RegisterResponse>('/auth/register', payload)
    
    console.log('[Auth API] Registration successful')
    console.log('[Auth API] Response:', response.data)
    
    return response
  } catch (error: any) {
    console.error('[Auth API] Registration failed')
    console.error('[Auth API] Error:', error.response?.data || error.message)
    throw error
  }
}

export const loginUser = async (payload: LoginPayload) => {
  try {
    console.log('[Auth API] Logging in user:', payload.email)
    
    const response = await client.post<RegisterResponse>('/auth/login', payload)
    
    console.log('[Auth API] Login successful')
    console.log('[Auth API] Response:', response.data)
    
    return response
  } catch (error: any) {
    console.error('[Auth API] Login failed')
    console.error('[Auth API] Error:', error.response?.data || error.message)
    throw error
  }
}