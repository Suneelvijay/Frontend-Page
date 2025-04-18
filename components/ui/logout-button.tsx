 "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { handleLogout } from "@/lib/auth-utils"
import { toast } from "sonner"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function LogoutButton({ 
  variant = "outline", 
  size = "default", 
  className = "",
  showIcon = true
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onLogout = async () => {
    setIsLoading(true)

    try {
      await handleLogout(() => {
        // Redirect to login page after logout
        router.push("/login")
      })
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Failed to logout")
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onLogout}
      disabled={isLoading}
    >
      {isLoading ? "Logging out..." : (
        <>
          {showIcon && <LogOut className="mr-2 h-4 w-4" />}
          Logout
        </>
      )}
    </Button>
  )
}