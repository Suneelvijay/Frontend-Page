"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowUpRight, ArrowDownRight, Car, FileText, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample data for charts
const testDriveData = [
  { day: "Mon", completed: 4, pending: 2 },
  { day: "Tue", completed: 3, pending: 1 },
  { day: "Wed", completed: 5, pending: 3 },
  { day: "Thu", completed: 2, pending: 2 },
  { day: "Fri", completed: 6, pending: 1 },
  { day: "Sat", completed: 8, pending: 4 },
  { day: "Sun", completed: 2, pending: 1 },
]

const quoteData = [
  { month: "Jan", quotes: 15 },
  { month: "Feb", quotes: 18 },
  { month: "Mar", quotes: 25 },
  { month: "Apr", quotes: 22 },
  { month: "May", quotes: 30 },
  { month: "Jun", quotes: 28 },
]

// Sample data for upcoming test drives
const upcomingTestDrives = [
  {
    id: 1,
    customerName: "Rahul Sharma",
    vehicle: "Kia Seltos",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
    contact: "+91 98765 43210",
  },
  {
    id: 2,
    customerName: "Priya Patel",
    vehicle: "Kia Sonet",
    date: "2023-05-15",
    time: "2:30 PM",
    status: "confirmed",
    contact: "+91 87654 32109",
  },
  {
    id: 3,
    customerName: "Amit Kumar",
    vehicle: "Kia Carnival",
    date: "2023-05-16",
    time: "11:15 AM",
    status: "pending",
    contact: "+91 76543 21098",
  },
]

// Sample data for recent quote requests
const recentQuoteRequests = [
  {
    id: 1,
    customerName: "Vikram Singh",
    vehicle: "Kia EV6",
    date: "2023-05-14",
    status: "pending",
    contact: "+91 65432 10987",
  },
  {
    id: 2,
    customerName: "Neha Gupta",
    vehicle: "Kia Seltos",
    date: "2023-05-13",
    status: "completed",
    contact: "+91 54321 09876",
  },
  {
    id: 3,
    customerName: "Rajesh Verma",
    vehicle: "Kia Carens",
    date: "2023-05-12",
    status: "pending",
    contact: "+91 43210 98765",
  },
]

export default function DealerDashboard() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dealer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Kia Dealer Portal. Here's an overview of your activities and requests.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Test Drives</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +12.5% <ArrowUpRight className="h-4 w-4 ml-1" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Test Drives</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 flex items-center">
                  +3.2% <ArrowUpRight className="h-4 w-4 ml-1" />
                </span>{" "}
                from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +8.3% <ArrowUpRight className="h-4 w-4 ml-1" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 flex items-center">
                  -2 <ArrowDownRight className="h-4 w-4 ml-1" />
                </span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-drives">Test Drives</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Weekly Test Drive Activity</CardTitle>
                  <CardDescription>Completed vs pending test drives for the current week.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      completed: {
                        label: "Completed",
                        color: "hsl(var(--chart-1))",
                      },
                      pending: {
                        label: "Pending",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={testDriveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Monthly Quote Requests</CardTitle>
                  <CardDescription>Number of quote requests received per month.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      quotes: {
                        label: "Quotes",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={quoteData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="quotes" stroke="var(--color-quotes)" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Test Drives</CardTitle>
                    <CardDescription>Your scheduled test drives for the next few days.</CardDescription>
                  </div>
                  <Link href="/dealer/test-drives">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTestDrives.map((testDrive) => (
                      <div key={testDrive.id} className="flex items-start space-x-4 rounded-md border p-3">
                        <Car className="mt-1 h-5 w-5 text-blue-500" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{testDrive.customerName}</p>
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${
                                testDrive.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {testDrive.status.charAt(0).toUpperCase() + testDrive.status.slice(1)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{testDrive.vehicle}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {testDrive.date} at {testDrive.time}
                            </div>
                            <Link href={`/dealer/test-drives/${testDrive.id}`}>
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Quote Requests</CardTitle>
                    <CardDescription>Latest quote requests from customers.</CardDescription>
                  </div>
                  <Link href="/dealer/quotes">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuoteRequests.map((quote) => (
                      <div key={quote.id} className="flex items-start space-x-4 rounded-md border p-3">
                        <FileText className="mt-1 h-5 w-5 text-green-500" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{quote.customerName}</p>
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${
                                quote.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{quote.vehicle}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {quote.date}
                            </div>
                            <Link href={`/dealer/quotes/${quote.id}`}>
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="test-drives" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Drive Analytics</CardTitle>
                <CardDescription>Detailed analysis of test drive requests and completions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Detailed test drive analytics will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quote Analytics</CardTitle>
                <CardDescription>Detailed analysis of quote requests and conversions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Detailed quote analytics will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
