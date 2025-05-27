"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { validatePassword } from "@/lib/password-validation"
import { OTPDialog } from "@/components/ui/otp-dialog"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPDialog, setShowOTPDialog] = useState(false)

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    
    // Clear errors when user types
    if (id === "password" || id === "confirmPassword") {
      setErrors(prev => ({ ...prev, [id]: "" }))
    }
  }

  const handlePasswordChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, password: value }))
    
    const validation = validatePassword(value)
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, password: validation.errors.join(", ") }))
    } else {
      setErrors(prev => ({ ...prev, password: "" }))
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, confirmPassword: value }))
    
    if (value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors(prev => ({ ...prev, general: "" }))
    
    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setErrors(prev => ({ ...prev, password: passwordValidation.errors.join(", ") }))
      setIsLoading(false)
      return
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch("http://192.168.125.84:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Show OTP dialog on successful registration
      setShowOTPDialog(true)
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message || "Registration failed" }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="text-sm text-destructive text-center">
                {errors.general}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                type="text" 
                placeholder="John Doe" 
                value={formData.fullName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              required
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>

      <OTPDialog
        isOpen={showOTPDialog}
        email={formData.email}
        onClose={() => setShowOTPDialog(false)}
      />
    </div>
  )
}