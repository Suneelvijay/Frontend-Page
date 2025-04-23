"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Trash2, UserPlus, Shield, ShieldAlert, Search, Check, X, History, Power } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [requestHistory, setRequestHistory] = useState([])
  const [error, setError] = useState(null)
  const [showAddDealerDialog, setShowAddDealerDialog] = useState(false)
  const [showPromoteDialog, setShowPromoteDialog] = useState(false)
  const [showDemoteDialog, setShowDemoteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("ALL")
  const [activeTab, setActiveTab] = useState("users")
  const [newDealer, setNewDealer] = useState({
    username: "",
    password: "",
    dealershipName: "",
    fullName: "",
    email: "",
    dealershipAddress: "",
    phoneNumber: ""
  })
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch("http://localhost:8080/api/admin/users", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        
        if (!data.content || !Array.isArray(data.content)) {
          console.error("Invalid API response structure:", data)
          throw new Error("Invalid data format received from server")
        }

        setUsers(data.content)
        setFilteredUsers(data.content)
        setPagination({
          pageNumber: data.pageable.pageNumber,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          size: data.size
        })
        setError(null)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError(error.message || "Failed to load users")
        toast.error(error.message || "Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = [...users]

    // Apply role filter
    if (selectedRole !== "ALL") {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
    }

    setFilteredUsers(filtered)
  }, [searchQuery, selectedRole, users])

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch("http://localhost:8080/api/user/admin-requests", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again")
          }
          if (response.status === 403) {
            throw new Error("Forbidden: You don't have permission to view admin requests")
          }
          throw new Error("Failed to fetch pending requests")
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format from server")
        }
        setPendingRequests(data)
      } catch (error) {
        console.error("Error fetching pending requests:", error)
        toast.error(error.message || "Failed to load pending requests")
        if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
          router.push("/login")
        }
      }
    }

    const fetchRequestHistory = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch("http://localhost:8080/api/user/admin-requests/history", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again")
          }
          if (response.status === 403) {
            throw new Error("Forbidden: You don't have permission to view request history")
          }
          throw new Error("Failed to fetch request history")
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format from server")
        }
        setRequestHistory(data)
      } catch (error) {
        console.error("Error fetching request history:", error)
        toast.error(error.message || "Failed to load request history")
        if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
          router.push("/login")
        }
      }
    }

    if (activeTab === "requests") {
      fetchPendingRequests()
    } else if (activeTab === "history") {
      fetchRequestHistory()
    }
  }, [activeTab, router])

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:8080/api/user/delete", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId
        })
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      toast.success("User deleted successfully")
      setShowDeleteDialog(false)
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error("Delete error:", error)
      toast.error(error.message || "Failed to delete user")
    }
  }

  const handleAddDealer = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:8080/api/user/dealer", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newDealer)
      })

      if (!response.ok) {
        throw new Error("Failed to add dealer")
      }

      toast.success("Dealer added successfully")
      setShowAddDealerDialog(false)
      setNewDealer({
        username: "",
        password: "",
        dealershipName: "",
        fullName: "",
        email: "",
        dealershipAddress: "",
        phoneNumber: ""
      })
      // Refresh users list
      const fetchResponse = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await fetchResponse.json()
      setUsers(data.content)
    } catch (error) {
      console.error("Add dealer error:", error)
      toast.error(error.message || "Failed to add dealer")
    }
  }

  const handlePromoteToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:8080/api/user/promote-to-admin/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to promote user")
      }

      toast.success("User promoted to admin successfully")
      setShowPromoteDialog(false)
      // Refresh users list
      const fetchResponse = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await fetchResponse.json()
      setUsers(data.content)
    } catch (error) {
      console.error("Promote error:", error)
      toast.error(error.message || "Failed to promote user")
    }
  }

  const handleDemoteToDealer = async (userId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:8080/api/user/demote-to-dealer/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to demote user")
      }

      toast.success("User demoted to dealer successfully")
      setShowDemoteDialog(false)
      // Refresh users list
      const fetchResponse = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await fetchResponse.json()
      setUsers(data.content)
    } catch (error) {
      console.error("Demote error:", error)
      toast.error(error.message || "Failed to demote user")
    }
  }

  const handleStatusToggle = async (userId, currentStatus, targetStatus) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const newStatus = targetStatus || (currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE")

      const response = await fetch("http://localhost:8080/api/user/status", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update user status to ${newStatus}`)
      }

      // Update the users list with the new status
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, accountStatus: newStatus }
          : user
      ))

      toast.success(`User status updated to ${newStatus.toLowerCase()} successfully`)
      setShowStatusDialog(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error(error.message || "Failed to update user status")
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success"
      case "REJECTED":
        return "destructive"
      case "PENDING":
        return "warning"
      default:
        return "secondary"
    }
  }

  const getStatusButtonVariant = (status) => {
    return status === "ACTIVE" ? "destructive" : "success"
  }

  const getStatusButtonText = (status) => {
    return status === "ACTIVE" ? "Deactivate" : "Activate"
  }

  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:8080/api/user/admin-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          response: "Request approved. You have been granted temporary admin access for 7 days."
        })
      })

      const result = await response.json()
      
      if (response.ok || result?.status === "APPROVED") {
        toast.success("Request approved successfully")
        setPendingRequests(pendingRequests.filter(request => request.id !== requestId))
        
        if (activeTab === "history") {
          const historyResponse = await fetch("http://localhost:8080/api/user/admin-requests/history", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
          if (historyResponse.ok) {
            const historyData = await historyResponse.json()
            setRequestHistory(historyData)
          }
        }
      } else {
        throw new Error(result?.message || "Failed to approve request")
      }
    } catch (error) {
      console.error("Approve error:", error)
      toast.error(error.message || "Error occurred while approving request")
    }
  }

  const handleDenyRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:8080/api/user/admin-requests/${requestId}/deny`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          response: "Request rejected. Please contact customer care."
        })
      })

      const result = await response.json()
      
      if (response.ok || result?.status === "REJECTED") {
        toast.success("Request denied successfully")
        setPendingRequests(pendingRequests.filter(request => request.id !== requestId))
        
        if (activeTab === "history") {
          const historyResponse = await fetch("http://localhost:8080/api/user/admin-requests/history", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
          if (historyResponse.ok) {
            const historyData = await historyResponse.json()
            setRequestHistory(historyData)
          }
        }
      } else {
        throw new Error(result?.message || "Failed to deny request")
      }
    } catch (error) {
      console.error("Deny error:", error)
      toast.error(error.message || "Error occurred while denying request")
    }
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "default"
      case "DEALER":
        return "secondary"
      case "CUSTOMER":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => router.push("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          </div>
          <Dialog open={showAddDealerDialog} onOpenChange={setShowAddDealerDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Dealer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Dealer</DialogTitle>
                <DialogDescription>Enter the details of the new dealer to add to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">Username</Label>
                  <Input
                    id="username"
                    value={newDealer.username}
                    onChange={(e) => setNewDealer({ ...newDealer, username: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newDealer.password}
                    onChange={(e) => setNewDealer({ ...newDealer, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dealershipName" className="text-right">Dealership Name</Label>
                  <Input
                    id="dealershipName"
                    value={newDealer.dealershipName}
                    onChange={(e) => setNewDealer({ ...newDealer, dealershipName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">Full Name</Label>
                  <Input
                    id="fullName"
                    value={newDealer.fullName}
                    onChange={(e) => setNewDealer({ ...newDealer, fullName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDealer.email}
                    onChange={(e) => setNewDealer({ ...newDealer, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dealershipAddress" className="text-right">Address</Label>
                  <Input
                    id="dealershipAddress"
                    value={newDealer.dealershipAddress}
                    onChange={(e) => setNewDealer({ ...newDealer, dealershipAddress: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                  <Input
                    id="phoneNumber"
                    value={newDealer.phoneNumber}
                    onChange={(e) => setNewDealer({ ...newDealer, phoneNumber: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDealerDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDealer}>Add Dealer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="requests">Pending Requests</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in the system. Showing {filteredUsers.length} of {pagination.totalElements} users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="DEALER">Dealer</SelectItem>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.fullName}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(user.accountStatus)}>
                                  {user.accountStatus}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex space-x-2">
                                  {/* For deactivated accounts, only show delete button */}
                                  {user.accountStatus === "DEACTIVATED" ? (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUser(user)
                                        setShowDeleteDialog(true)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <>
                                      {/* Status management buttons for non-admin users */}
                                      {user.role !== "ADMIN" && (
                                        <>
                                          {user.accountStatus === "ACTIVE" && (
                                            <>
                                              <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedUser(user)
                                                  setShowStatusDialog(true)
                                                }}
                                                title="Block User"
                                              >
                                                <Power className="h-4 w-4 mr-1" />
                                                Block
                                              </Button>
                                              <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedUser({...user, targetStatus: "DEACTIVATED"})
                                                  setShowStatusDialog(true)
                                                }}
                                                title="Deactivate User"
                                              >
                                                <Power className="h-4 w-4 mr-1" />
                                                Deactivate
                                              </Button>
                                            </>
                                          )}
                                          {user.accountStatus === "BLOCKED" && (
                                            <>
                                              <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedUser({...user, targetStatus: "ACTIVE"})
                                                  setShowStatusDialog(true)
                                                }}
                                                title="Activate User"
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <Power className="h-4 w-4 mr-1" />
                                                Activate
                                              </Button>
                                              <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedUser({...user, targetStatus: "DEACTIVATED"})
                                                  setShowStatusDialog(true)
                                                }}
                                                title="Deactivate User"
                                              >
                                                <Power className="h-4 w-4 mr-1" />
                                                Deactivate
                                              </Button>
                                            </>
                                          )}
                                        </>
                                      )}
                                      
                                      {/* Promote button only for dealers */}
                                      {user.role === "DEALER" && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedUser(user)
                                            setShowPromoteDialog(true)
                                          }}
                                        >
                                          <Shield className="h-4 w-4 mr-1" />
                                          Promote to Admin
                                        </Button>
                                      )}
                                      
                                      {/* Demote button only for admin users */}
                                      {user.role === "ADMIN" && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedUser(user)
                                            setShowDemoteDialog(true)
                                          }}
                                        >
                                          <ShieldAlert className="h-4 w-4 mr-1" />
                                          Demote to Dealer
                                        </Button>
                                      )}

                                      {/* Delete button for active accounts */}
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUser(user)
                                          setShowDeleteDialog(true)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Pending Admin Requests</CardTitle>
                <CardDescription>
                  Review and manage requests for admin access. Showing {pendingRequests.length} pending requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                      {pendingRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No pending requests
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingRequests.map((request) => (
                            <TableRow key={request.id}>
                            <TableCell>{request.userName || 'N/A'}</TableCell>
                            <TableCell>{request.userEmail || 'N/A'}</TableCell>
                              <TableCell>
                              <Badge variant={getRoleBadgeVariant(request.userRole || 'CUSTOMER')}>
                                {request.userRole || 'CUSTOMER'}
                              </Badge>
                              </TableCell>
                              <TableCell>
                              <Badge variant={getStatusBadgeVariant(request.status)}>
                                {request.status}
                              </Badge>
                              </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApproveRequest(request.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDenyRequest(request.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                        ))
                      )}
                        </TableBody>
                      </Table>
                    </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Admin Request History</CardTitle>
                <CardDescription>
                  View the history of all admin access requests. Showing {requestHistory.length} requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No request history found
                          </TableCell>
                        </TableRow>
                      ) : (
                        requestHistory.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.userName || 'N/A'}</TableCell>
                            <TableCell>{request.userEmail || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(request.status)}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{request.response || 'N/A'}</TableCell>
                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.targetStatus || (selectedUser?.accountStatus === "ACTIVE" ? "Block" : "Activate")} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedUser?.targetStatus?.toLowerCase() || (selectedUser?.accountStatus === "ACTIVE" ? "block" : "activate")} this user?
              {selectedUser?.targetStatus === "DEACTIVATED" 
                ? " This action cannot be undone." 
                : selectedUser?.accountStatus === "ACTIVE"
                ? " This will temporarily prevent them from accessing the system."
                : " This will restore their access to the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusToggle(selectedUser?.id, selectedUser?.accountStatus, selectedUser?.targetStatus)}
              className={
                selectedUser?.targetStatus === "ACTIVE"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive hover:bg-destructive/90"
              }
            >
              {selectedUser?.targetStatus || (selectedUser?.accountStatus === "ACTIVE" ? "Block" : "Activate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.role === "ADMIN" ? "Demote from Admin" : "Promote to Admin"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedUser?.role === "ADMIN" ? "demote this admin to dealer" : "promote this user to admin"}?
              This will {selectedUser?.role === "ADMIN" ? "remove" : "grant"} them administrative privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser?.role === "ADMIN" 
                ? handleDemoteToDealer(selectedUser?.id)
                : handlePromoteToAdmin(selectedUser?.id)
              }
            >
              {selectedUser?.role === "ADMIN" ? "Demote" : "Promote"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(selectedUser?.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDemoteDialog} onOpenChange={setShowDemoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demote Admin to Dealer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote this admin to dealer? This will remove their administrative privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDemoteToDealer(selectedUser?.id)}
            >
              Demote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
