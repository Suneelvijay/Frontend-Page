"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  username: string
  email: string
  fullName: string
  role: string
}

interface AuthHeaders {
  Authorization: string
  "Content-Type": string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  verifyLoginOTP: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
  getAuthHeaders: () => AuthHeaders | {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored token and user on mount
    const storedToken = sessionStorage.getItem("authToken")
    const storedUser = sessionStorage.getItem("user")
    console.log("AuthProvider mounted - storedToken:", storedToken)
    console.log("AuthProvider mounted - storedUser:", storedUser)
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Redirect based on role
      const userRole = JSON.parse(storedUser).role
      if (userRole === "ADMIN") {
        router.push("/admin")
      } else if (userRole === "CUSTOMER") {
        router.push("/customer/dashboard")
      }
    }
  }, [router])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }
  
      // Store the email for OTP verification
      sessionStorage.setItem("pendingEmail", data.email || username)
      
      // Return the response data
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyLoginOTP = async (email: string, otp: string) => {
    setIsLoading(true)
    setError(null)
  
    try {
      const pendingEmail = sessionStorage.getItem("pendingEmail")
  
      if (!pendingEmail || pendingEmail !== email) {
        throw new Error("Email mismatch. Please try logging in again.")
      }
  
      const response = await fetch("http://localhost:8080/api/auth/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp.toString()
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed")
      }
  
      // Format the user data according to our interface
      const userData: User = {
        username: data.username,
        email: data.email,
        fullName: data.username,
        role: data.role,
      }
  
      console.log("Storing token in sessionStorage:", data.token)
      // Store the final token and user data in sessionStorage
      sessionStorage.setItem("authToken", data.token)
      sessionStorage.setItem("user", JSON.stringify(userData))
      sessionStorage.removeItem("pendingEmail")
      setToken(data.token)
      setUser(userData)
  
      // Redirect based on role
      if (data.role === "ADMIN") {
        router.push("/admin")
      } else if (data.role === "CUSTOMER") {
        router.push("/customer/dashboard")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "OTP verification failed"
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (token) {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      }

      // Clear stored data
      sessionStorage.removeItem("authToken")
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("pendingEmail")
      setToken(null)
      setUser(null)
      router.push("/login")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("authToken")
    if (!token) return {}
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    } as AuthHeaders
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    verifyLoginOTP,
    logout,
    isLoading,
    error,
    getAuthHeaders
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}