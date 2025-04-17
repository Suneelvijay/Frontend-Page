"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OTPDialogProps {
  isOpen: boolean
  email: string
  onClose: () => void
  onVerify?: (otp: string) => Promise<void>
  isLogin?: boolean
}

export function OTPDialog({ isOpen, email, onClose, onVerify, isLogin = false }: OTPDialogProps) {
  const router = useRouter()
  const [otp, setOtp] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (onVerify) {
        await onVerify(otp)
        return
      }

      const response = await fetch(
        isLogin 
          ? "http://localhost:8080/api/auth/verify-login"
          : "http://localhost:8080/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Verification failed")
      }

      // OTP verification successful
      if (isLogin) {
        // Login verification is handled by the auth context
        onClose()
      } else {
        // Registration verification successful, redirect to login
        router.push("/login")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit OTP sent to {email}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}