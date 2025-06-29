"use client"

import { useState, useCallback } from "react"
import type { AuthState, LoginFormData, SignupFormData, OtpFormData, AuthResponse, User } from "@/types/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    user: null,
  })

  const setLoading = useCallback((loading: boolean) => {
    setAuthState((prev) => ({ ...prev, isLoading: loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setAuthState((prev) => ({ ...prev, error }))
  }, [])

  const setUser = useCallback((user: User | null) => {
    setAuthState((prev) => ({ ...prev, user }))
  }, [])

  const login = useCallback(
    async (data: LoginFormData): Promise<AuthResponse> => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock successful login
        const mockUser: User = {
          id: "1",
          email: data.email,
          firstName: "John",
          lastName: "Doe",
          createdAt: new Date(),
        }

        setUser(mockUser)
        return { success: true, message: "Login successful", user: mockUser }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Login failed"
        setError(errorMessage)
        return { success: false, message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setUser],
  )

  const signup = useCallback(
    async (data: SignupFormData): Promise<AuthResponse> => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock successful signup
        const mockUser: User = {
          id: "1",
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: new Date(),
        }

        setUser(mockUser)
        return { success: true, message: "Account created successfully", user: mockUser }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Signup failed"
        setError(errorMessage)
        return { success: false, message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setUser],
  )

  const verifyOtp = useCallback(
    async (data: OtpFormData): Promise<AuthResponse> => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (data.otp !== "123456") {
          throw new Error("Invalid OTP")
        }

        // Mock successful verification
        const mockUser: User = {
          id: "1",
          phone: data.phone,
          firstName: "John",
          lastName: "Doe",
          createdAt: new Date(),
        }

        setUser(mockUser)
        return { success: true, message: "Phone verified successfully", user: mockUser }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "OTP verification failed"
        setError(errorMessage)
        return { success: false, message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setUser],
  )

  const googleLogin = useCallback(async (): Promise<AuthResponse> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email: "user@gmail.com",
        firstName: "John",
        lastName: "Doe",
        createdAt: new Date(),
      }

      setUser(mockUser)
      return { success: true, message: "Google login successful", user: mockUser }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setUser])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
  }, [setUser, setError])

  return {
    ...authState,
    login,
    signup,
    verifyOtp,
    googleLogin,
    logout,
  }
}