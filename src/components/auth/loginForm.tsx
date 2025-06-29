"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { LoginFormData, LoginMethod } from "@/types/auth"

interface LoginFormProps {
  onSubmit: (data: LoginFormData, method: LoginMethod) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email")
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    phone: "",
    otp: "",
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({})

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {}

    if (loginMethod === "email") {
      if (!formData.email) {
        errors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid"
      }

      if (!formData.password) {
        errors.password = "Password is required"
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
      }
    } else {
      if (!formData.phone) {
        errors.phone = "Phone number is required"
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        errors.phone = "Phone number is invalid"
      }

      if (!formData.otp) {
        errors.otp = "OTP is required"
      } else if (formData.otp.length !== 6) {
        errors.otp = "OTP must be 6 digits"
      } else if (!/^\d{6}$/.test(formData.otp)) {
        errors.otp = "OTP must contain only numbers"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    await onSubmit(formData, loginMethod)
  }

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleMethodChange = (method: LoginMethod) => {
    setLoginMethod(method)
    setValidationErrors({})
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setFormData((prev) => ({ ...prev, otp: value }))
    if (validationErrors.otp) {
      setValidationErrors((prev) => ({ ...prev, otp: undefined }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={loginMethod === "email" ? "default" : "outline"}
          size="sm"
          onClick={() => handleMethodChange("email")}
          className={`flex-1 ${
            loginMethod === "email" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          }`}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button
          type="button"
          variant={loginMethod === "otp" ? "default" : "outline"}
          size="sm"
          onClick={() => handleMethodChange("otp")}
          className={`flex-1 ${
            loginMethod === "otp" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          }`}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          OTP
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loginMethod === "email" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange("email")}
                className={validationErrors.email ? "border-red-500" : ""}
                required
              />
              {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className={validationErrors.password ? "border-red-500" : ""}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="login-phone">Phone Number</Label>
              <Input
                id="login-phone"
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                className={validationErrors.phone ? "border-red-500" : ""}
                required
              />
              {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-otp">OTP Code</Label>
              <Input
                id="login-otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={formData.otp}
                onChange={handleOtpChange}
                maxLength={6}
                className={`text-center text-lg tracking-widest ${validationErrors.otp ? "border-red-500" : ""}`}
                required
              />
              {validationErrors.otp && <p className="text-sm text-red-500">{validationErrors.otp}</p>}
            </div>
          </>
        )}

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
          {isLoading ? "Signing In..." : loginMethod === "otp" ? "Verify OTP" : "Sign In"}
        </Button>
      </form>
    </div>
  )
}
