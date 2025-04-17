import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, FileText, User, Clock } from "lucide-react"

export default function CustomerDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-red-600" />
              <span>Vehicles</span>
            </CardTitle>
            <CardDescription>Browse available Kia vehicles</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Explore our latest models and find the perfect Kia for your needs.</p>
          </CardContent>
          <CardFooter>
            <Link href="/customer/vehicles" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">View Vehicles</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <span>Test Drives</span>
            </CardTitle>
            <CardDescription>Schedule and manage test drives</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Book a test drive for your preferred Kia model and check booking status.</p>
          </CardContent>
          <CardFooter>
            <Link href="/customer/test-drives" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">Manage Test Drives</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              <span>Quote Requests</span>
            </CardTitle>
            <CardDescription>Request and track price quotes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Request price quotes for Kia vehicles and check request status.</p>
          </CardContent>
          <CardFooter>
            <Link href="/customer/quotes" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">Manage Quotes</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-red-600" />
              <span>Profile</span>
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>View and update your personal information and security settings.</p>
          </CardContent>
          <CardFooter>
            <Link href="/customer/profile" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">View Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>View your recent interactions</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Check your recent test drives, quote requests, and other activities.</p>
          </CardContent>
          <CardFooter>
            <Link href="/customer/activity" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">View Activity</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
