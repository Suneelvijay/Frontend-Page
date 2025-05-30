"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Car, FileText, Calendar, LogOut, Menu, X, User, Bell, MessageSquare, Shield, Home, CarFront } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { handleLogout } from "@/lib/auth-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import dealerApi from '@/app/api/dealer'

// Remove unused navItems array

export default function DealerLayout({ children }) {
  const pathname = usePathname() // Add this since it's used in navigation
  const router = useRouter()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState({ username: "Dealer Name", email: "dealer@kia.com" })
  const [loading, setLoading] = useState(true)
  
  // Get user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({
          username: parsedUser.username || parsedUser.fullName || parsedUser.dealershipName || "Dealer",
          email: parsedUser.email || "dealer@kia.com"
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])
  
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (!token || !userData) {
        router.push('/login')
        return
      }

      const parsedUserData = JSON.parse(userData)
      if (parsedUserData.role !== 'DEALER') {
        toast({
          title: "Error",
          description: "Unauthorized access",
          variant: "destructive",
        })
        router.push('/login')
        return
      }

      await fetchDealerProfile()
    } catch {
      toast({
        title: "Error",
        description: "Please login to continue",
        variant: "destructive",
      })
      router.push('/login')
    }
  }, [router, toast])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const fetchDealerProfile = async () => {
    try {
      const data = await dealerApi.getProfile()
      setDealerInfo(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        router.push('/login')
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dealer profile",
          variant: "destructive",
        })
      }
    }
  }

  const onLogout = async () => {
    await handleLogout(() => {
      router.push("/")
    })
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dealer",
      icon: Calendar,
      current: pathname === "/dealer",
    },
    {
      name: "Test Drives",
      href: "/dealer/test-drives",
      icon: Car,
      current: pathname === "/dealer/test-drives",
    },
    {
      name: "Profile",
      href: "/dealer/profile",
      icon: User,
      current: pathname === "/dealer/profile",
    },
  ]

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? "" : "hidden"}`} role="dialog">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center px-4">
            <Image
              src="/kialogo-removebg.png"
              alt="Kia Logo"
              width={80}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Image
              src="/kialogo-removebg.png"
              alt="Kia Logo"
              width={80}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dealer"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dealer/test-drives"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <CarFront className="h-4 w-4" />
                Test Drives
              </Link>
              <Link
                href="/dealer/quote-requests"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Quote Requests
              </Link>
              <Link
                href="/dealer/admin-requests"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Shield className="h-4 w-4" />
                Admin Requests
              </Link>
              <Link
                href="/dealer/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 self-center">Kia Dealer Portal</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <Car className="h-5 w-5 mt-1 text-blue-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">New Test Drive Request</p>
                        <p className="text-xs text-muted-foreground">
                          Rahul Sharma requested a test drive for Kia Seltos
                        </p>
                        <p className="text-xs text-muted-foreground">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <MessageSquare className="h-5 w-5 mt-1 text-green-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">New Quote Request</p>
                        <p className="text-xs text-muted-foreground">Priya Patel requested a quote for Kia Sonet</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <Car className="h-5 w-5 mt-1 text-blue-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Test Drive Reminder</p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled test drive with Amit Kumar for Kia Carnival at 2:00 PM
                        </p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dealer" />
                      <AvatarFallback>DL</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}