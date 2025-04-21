import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isAuthenticated, getCurrentUser } from "@/lib/auth-utils"
import { LogoutButton } from "@/components/ui/logout-button"

export function Navbar() {
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check authentication status on client side
  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setUser(getCurrentUser())
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            Kia DMS
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          
          {authenticated && user?.role === "USER" && (
            <>
              <Link 
                href="/customer/vehicles"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/customer/vehicles") ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Vehicles
              </Link>
              <Link 
                href="/customer/quotes"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/customer/quotes") ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                My Quotes
              </Link>
            </>
          )}
          
          {authenticated && user?.role === "DEALER" && (
            <Link 
              href="/dealer"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/dealer") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
          )}
          
          {authenticated && user?.role === "ADMIN" && (
            <Link 
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/admin") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {authenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium hidden md:block">
                <Link 
                  href="/customer/profile"
                  className="hover:text-primary transition-colors"
                >
                  Welcome, {user?.username || 'User'}
                </Link>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}