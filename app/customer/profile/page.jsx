"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react"
import { toast } from "sonner"
import { customerAPI } from "@/lib/api"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    fullName: "",
  })
  const [showEmail, setShowEmail] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await customerAPI.getProfile()
        setUserData(data)
        setEditedData({
          fullName: data.fullName,
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsSubmitting(true)
        await customerAPI.updateProfile({
          fullName: editedData.fullName,
        })
        setUserData({
          ...userData,
          fullName: editedData.fullName,
        })
        toast.success("Profile updated successfully")
      } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setEditedData({
        fullName: userData.fullName,
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData({
      ...editedData,
      [name]: value,
    })
  }

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    )
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (!validatePassword(newPassword)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    try {
      setIsSubmitting(true)
      await customerAPI.updatePassword({
        currentPassword,
        newPassword,
      })
      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    try {
      setIsSubmitting(true)
      await customerAPI.toggleTwoFactor(!twoFactorEnabled)
      setTwoFactorEnabled(!twoFactorEnabled)
      toast.success(`Two-factor authentication ${!twoFactorEnabled ? "enabled" : "disabled"} successfully`)
    } catch (error) {
      console.error("Error toggling two-factor authentication:", error)
      toast.error("Failed to update two-factor authentication settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Link href="/customer/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link href="/customer/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="w-full">
              <TabsTrigger value="personal" className="flex-1">
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={handleEditToggle}
                      disabled={isSubmitting}
                      className={isEditing ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : isEditing ? (
                        "Save Changes"
                      ) : (
                        "Edit Profile"
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="username">Username</Label>
                    </div>
                    <Input id="username" value={userData.username} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="email"
                        value={showEmail ? userData.email : userData.email.replace(/^(.)(.*)(@.*)$/, "$1****$3")}
                        disabled
                        className="bg-muted pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowEmail(!showEmail)}
                      >
                        {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={isEditing ? editedData.fullName : userData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Change Password
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={
                          isSubmitting ||
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword ||
                          newPassword !== confirmPassword ||
                          !validatePassword(newPassword)
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          {twoFactorEnabled
                            ? "Two-factor authentication is enabled for your account"
                            : "Enable two-factor authentication for additional security"}
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={handleTwoFactorToggle}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{userData.fullName}</h3>
                  <p className="text-muted-foreground">{userData.username}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-medium">
                    {new Date(userData.lastLogin).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Two-Factor Auth</span>
                  <span className="font-medium">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
