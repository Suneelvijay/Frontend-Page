"use client"

import { useState } from "react"
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
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Shield } from "lucide-react"

// Mock user data
const mockUserData = {
  username: "johndoe",
  email: "j****e@example.com",
  fullEmail: "johndoe@example.com",
  name: "John Doe",
  dob: "**/**/1990",
  fullDob: "15/05/1990",
  phone: "+91 ******7890",
  fullPhone: "+91 9876547890",
  address: "123 Main Street, Bangalore, Karnataka",
  twoFactorEnabled: false,
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    name: userData.name,
    address: userData.address,
  })
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showDob, setShowDob] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otpEmail, setOtpEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(userData.twoFactorEnabled)

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData({
        ...userData,
        name: editedData.name,
        address: editedData.address,
      })
    } else {
      // Start editing
      setEditedData({
        name: userData.name,
        address: userData.address,
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

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      alert("Password changed successfully!")
    }, 1500)
  }

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      // Enable 2FA - show OTP dialog
      document.getElementById("enable-2fa-dialog").click()
    } else {
      // Disable 2FA
      setTwoFactorEnabled(false)
      setUserData({
        ...userData,
        twoFactorEnabled: false,
      })
    }
  }

  const verifyOtp = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setOtpEmail("")
      setTwoFactorEnabled(true)
      setUserData({
        ...userData,
        twoFactorEnabled: true,
      })
      document.getElementById("close-2fa-dialog").click()
    }, 1500)
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
                      className={isEditing ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
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
                        value={showEmail ? userData.fullEmail : userData.email}
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={isEditing ? editedData.name : userData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="dob">Date of Birth</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="dob"
                        value={showDob ? userData.fullDob : userData.dob}
                        disabled
                        className="bg-muted pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowDob(!showDob)}
                      >
                        {showDob ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="phone">Phone Number</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="phone"
                        value={showPhone ? userData.fullPhone : userData.phone}
                        disabled
                        className="bg-muted pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPhone(!showPhone)}
                      >
                        {showPhone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={isEditing ? editedData.address : userData.address}
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
                          newPassword !== confirmPassword
                        }
                      >
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Two-Factor Authentication
                      </h3>
                      <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled
                        ? "Two-factor authentication is enabled. You will receive an email with a verification code when signing in."
                        : "Enable two-factor authentication for an extra layer of security. You will receive an email with a verification code when signing in."}
                    </p>
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
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
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
                  <span className="font-medium">January 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-medium">Today, 10:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Two-Factor Auth</span>
                  <span className="font-medium">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-red-600 pl-4 py-1">
                  <p className="font-medium">Password Changed</p>
                  <p className="text-sm text-muted-foreground">2 weeks ago</p>
                </div>
                <div className="border-l-2 border-red-600 pl-4 py-1">
                  <p className="font-medium">Test Drive Booked</p>
                  <p className="text-sm text-muted-foreground">3 weeks ago</p>
                </div>
                <div className="border-l-2 border-red-600 pl-4 py-1">
                  <p className="font-medium">Quote Requested</p>
                  <p className="text-sm text-muted-foreground">1 month ago</p>
                </div>
                <div className="border-l-2 border-red-600 pl-4 py-1">
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">3 months ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/customer/activity" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Two-Factor Authentication Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button id="enable-2fa-dialog" className="hidden">
            Open
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              We'll send a verification code to your email address to confirm setup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              A verification code has been sent to {userData.email}. Please enter the code below to enable two-factor
              authentication.
            </p>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button id="close-2fa-dialog" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={verifyOtp}
              disabled={isSubmitting || otpEmail.length !== 6}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Verifying..." : "Verify & Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
