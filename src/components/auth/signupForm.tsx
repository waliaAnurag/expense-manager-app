"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SignupFormData, SignupMethod } from "@/types/auth"

interface SignupFormProps {
  onSubmit: (data: SignupFormData, method: SignupMethod) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function SignupForm({ onSubmit, isLoading, error }: SignupFormProps) {
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email")
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SignupFormData, string>> = {}

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (signupMethod === "email") {
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

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    } else {
      if (!formData.phone) {
        errors.phone = "Phone number is required"
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        errors.phone = "Phone number is invalid"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    await onSubmit(formData, signupMethod)
  }

  const handleInputChange = (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleMethodChange = (method: SignupMethod) => {
    setSignupMethod(method)
    setValidationErrors({})
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={signupMethod === "email" ? "default" : "outline"}
          size="sm"
          onClick={() => handleMethodChange("email")}
          className={`flex-1 ${
            signupMethod === "email" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          }`}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button
          type="button"
          variant={signupMethod === "phone" ? "default" : "outline"}
          size="sm"
          onClick={() => handleMethodChange("phone")}
          className={`flex-1 ${
            signupMethod === "phone" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          }`}
        >
          <Phone className="h-4 w-4 mr-2" />
          Phone
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange("firstName")}
              className={validationErrors.firstName ? "border-red-500" : ""}
              required
            />
            {validationErrors.firstName && <p className="text-sm text-red-500">{validationErrors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange("lastName")}
              className={validationErrors.lastName ? "border-red-500" : ""}
              required
            />
            {validationErrors.lastName && <p className="text-sm text-red-500">{validationErrors.lastName}</p>}
          </div>
        </div>

        {signupMethod === "email" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
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
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  className={validationErrors.confirmPassword ? "border-red-500" : ""}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="signup-phone">Phone Number</Label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              className={validationErrors.phone ? "border-red-500" : ""}
              required
            />
            {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
          </div>
        )}

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
          {isLoading ? "Processing..." : signupMethod === "phone" ? "Send OTP" : "Create Account"}
        </Button>
      </form>
    </div>
  )
}