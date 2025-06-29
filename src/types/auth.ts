export type AuthMode = "login" | "signup" | "otp" | "email"
export type SignupMethod = "email" | "phone"
export type LoginMethod = "email" | "otp"

export interface LoginFormData {
  email?: string
  password?: string
  phone?: string
  otp?: string
}

export interface SignupFormData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export interface OtpFormData {
  otp: string
  phone: string
}

export interface AuthState {
  isLoading: boolean
  error: string | null
  user: User | null
}

export interface User {
  id: string
  email?: string
  phone?: string
  firstName: string
  lastName: string
  createdAt: Date
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}