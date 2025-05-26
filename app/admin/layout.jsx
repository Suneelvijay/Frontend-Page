"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Add this import
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Car, FileSpreadsheet, Users, LogOut, Menu, X, User, Bell, Code } from "lucide-react"
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
import { ChevronLeft, ChevronRight } from "lucide-react"

// Remove the hardcoded navItems
const iconMap = {
  "BarChart3": BarChart3,
  "Users": Users,
  "Car": Car,
  "FileSpreadsheet": FileSpreadsheet,
  "Code": Code
}

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState({ username: "Admin", email: "admin@kia.com" })
  const [menuItems, setMenuItems] = useState([])
  
  // Modify the useEffect for menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // First check local storage for menu config
        const localConfig = localStorage.getItem('adminMenuConfig')
        if (localConfig) {
          const parsedConfig = JSON.parse(localConfig)
          const enabledItems = parsedConfig
            .filter(item => item.enabled)
            .sort((a, b) => a.order - b.order)
            .map(item => ({
              name: item.title,
              href: item.path,
              icon: iconMap[item.icon] || BarChart3
            }))
          setMenuItems(enabledItems)
          return
        }

        // Fallback to API if no local config
        const token = localStorage.getItem("authToken")
        if (!token) return

        const response = await fetch("http://localhost:8080/api/admin/menu-config", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error("Failed to fetch menu items")

        const data = await response.json()
        const enabledItems = data.filter(item => item.enabled)
          .sort((a, b) => a.order - b.order)
          .map(item => ({
            name: item.title,
            href: item.path,
            icon: iconMap[item.icon] || BarChart3
          }))
        setMenuItems(enabledItems)
      } catch (error) {
        console.error("Error fetching menu items:", error)
      }
    }

    fetchMenuItems()
  }, [])
  
  // Get user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({
          username: parsedUser.username || parsedUser.fullName || "Admin",
          email: parsedUser.email || "admin@kia.com"
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])
  
  const onLogout = async () => {
    await handleLogout(() => {
      router.push("/")
    })
  }

  const onProfile = async () => {
    router.push("/admin/profile")
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
              {menuItems.map((item) => {
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
      <div className={`hidden md:flex md:flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "md:w-20" : "md:w-64"
      }`}>
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Image
              src="/kialogo-removebg.png"
              alt="Kia Logo"
              width={80}
              height={40}
              className={`transition-all duration-300 ease-in-out ${
                sidebarCollapsed ? "h-6 w-auto mx-auto" : "h-8 w-auto"
              }`}
            />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`flex-shrink-0 ${
                        sidebarCollapsed ? "h-5 w-5 mx-auto" : "mr-3 h-5 w-5"
                      } ${
                        isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
            <div className="px-2 pb-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <>
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    <span>Collapse Sidebar</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-0">
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
              <h1 className="text-2xl font-semibold text-gray-900 self-center">Kia Admin Panel</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      2
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <Users className="h-5 w-5 mt-1 text-blue-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">New Dealer Registration</p>
                        <p className="text-xs text-muted-foreground">
                          New dealer account &quot;Delhi Motors&quot; awaiting approval
                        </p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <Car className="h-5 w-5 mt-1 text-green-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Vehicle Database Update</p>
                        <p className="text-xs text-muted-foreground">Vehicle database update completed successfully</p>
                        <p className="text-xs text-muted-foreground">3 hours ago</p>
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
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
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
                  <DropdownMenuItem onClick={onProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
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
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}