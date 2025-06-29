"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OtpFormData {
  otp: string
  phone: string
}

interface OtpFormProps {
  phone: string
  onSubmit: (data: OtpFormData) => Promise<void>
  onBack: () => void
  onResendOtp: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function OtpForm({ phone, onSubmit, onBack, onResendOtp, isLoading, error }: OtpFormProps) {
  const [otp, setOtp] = useState<string>("")
  const [validationError, setValidationError] = useState<string>("")

  const validateOtp = (): boolean => {
    if (!otp) {
      setValidationError("OTP is required")
      return false
    }
    if (otp.length !== 6) {
      setValidationError("OTP must be 6 digits")
      return false
    }
    if (!/^\d{6}$/.test(otp)) {
      setValidationError("OTP must contain only numbers")
      return false
    }
    setValidationError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateOtp()) return

    await onSubmit({ otp, phone })
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    if (validationError) {
      setValidationError("")
    }
  }

  const handleResendOtp = async () => {
    await onResendOtp()
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={onBack} type="button">
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
        <p className="text-gray-600 mt-2">
          Enter the 6-digit code sent to <span className="font-medium">{phone}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            className={`text-center text-lg tracking-widest ${validationError ? "border-red-500" : ""}`}
            required
          />
          {validationError && <p className="text-sm text-red-500">{validationError}</p>}
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleResendOtp}
          disabled={isLoading}
        >
          Resend OTP
        </Button>
      </form>
    </div>
  )
}