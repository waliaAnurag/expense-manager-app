"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/loginForm"
import { SignupForm } from "@/components/auth/signupForm"
import { OtpForm } from "@/components/auth/otpForm"
import { useAuth } from "@/hooks/useAuth"
import type { AuthMode, SignupMethod, SignupFormData, LoginFormData, OtpFormData, LoginMethod } from "@/types/auth"
import { Mail } from "lucide-react"

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [pendingPhone, setPendingPhone] = useState<string>("")
  const { isLoading, error, login, signup, verifyOtp, googleLogin } = useAuth()

  const handleLogin = async (data: LoginFormData, method: LoginMethod): Promise<void> => {
    const result = await login(data)
    if (result.success) {
      // Redirect to dashboard or handle success
      console.log("Login successful:", result.user)
    }
  }

  const handleSignup = async (data: SignupFormData, method: SignupMethod): Promise<void> => {
    if (method === "phone" && data.phone) {
      setPendingPhone(data.phone)
      setAuthMode("otp")
    } else {
      const result = await signup(data)
      if (result.success) {
        // Redirect to dashboard or handle success
        console.log("Signup successful:", result.user)
      }
    }
  }

  const handleOtpVerification = async (data: OtpFormData): Promise<void> => {
    const result = await verifyOtp(data)
    if (result.success) {
      // Redirect to dashboard or handle success
      console.log("OTP verification successful:", result.user)
    }
  }

  const handleGoogleLogin = async (): Promise<void> => {
    const result = await googleLogin()
    if (result.success) {
      // Redirect to dashboard or handle success
      console.log("Google login successful:", result.user)
    }
  }

  const handleResendOtp = async (): Promise<void> => {
    // Implement resend OTP logic
    console.log("Resending OTP to:", pendingPhone)
  }

  const handleBackToSignup = (): void => {
    setAuthMode("signup")
    setPendingPhone("")
  }
console.log(authMode)
  if (authMode === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md relative">
          <CardContent className="pt-6">
            <OtpForm
              phone={pendingPhone}
              onSubmit={handleOtpVerification}
              onBack={handleBackToSignup}
              onResendOtp={handleResendOtp}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">₹</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Expense Manager</CardTitle>
          <CardDescription>Track your expenses and manage your budget efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={(value: string) => setAuthMode(value as AuthMode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

              <div className="text-center">
                <Button variant="link" className="text-sm text-indigo-600">
                  Forgot your password?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <SignupForm onSubmit={handleSignup} isLoading={isLoading} error={error} />
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant={authMode === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setAuthMode("email")}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 bg-transparent"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Loading..." : "Continue with Google"}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}