"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Car, Clock, MapPin, Phone } from "lucide-react"

// Sample schedule data
const scheduleData = {
  "2023-05-15": [
    {
      id: 1,
      type: "test-drive",
      customerName: "Rahul Sharma",
      customerPhone: "+91 98765 43210",
      vehicle: "Kia Seltos",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      type: "test-drive",
      customerName: "Priya Patel",
      customerPhone: "+91 87654 32109",
      vehicle: "Kia Sonet",
      time: "2:30 PM",
      status: "confirmed",
    },
  ],
  "2023-05-16": [
    {
      id: 3,
      type: "test-drive",
      customerName: "Amit Kumar",
      customerPhone: "+91 76543 21098",
      vehicle: "Kia Carnival",
      time: "11:15 AM",
      status: "pending",
    },
  ],
  "2023-05-17": [
    {
      id: 4,
      type: "test-drive",
      customerName: "Sneha Reddy",
      customerPhone: "+91 65432 10987",
      vehicle: "Kia EV6",
      time: "4:00 PM",
      status: "confirmed",
    },
  ],
  "2023-05-18": [
    {
      id: 5,
      type: "delivery",
      customerName: "Vikram Singh",
      customerPhone: "+91 54321 09876",
      vehicle: "Kia Seltos",
      time: "11:00 AM",
      status: "confirmed",
    },
  ],
}

export default function SchedulePage() {
  const [date, setDate] = useState(new Date())
  const formattedDate = date.toISOString().split("T")[0]
  const events = scheduleData[formattedDate] || []

  // Function to highlight dates with events
  const isDayWithEvent = (day) => {
    const formattedDay = day.toISOString().split("T")[0]
    return formattedDay in scheduleData
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          Manage your daily schedule of test drives, deliveries, and appointments.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view scheduled events.</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
                modifiers={{
                  event: (day) => isDayWithEvent(day),
                }}
                modifiersStyles={{
                  event: { fontWeight: "bold", backgroundColor: "rgba(59, 130, 246, 0.1)" },
                }}
              />
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-blue-100"></div>
                  <span className="text-xs">Event</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Selected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                Events for{" "}
                {date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </CardTitle>
              <CardDescription>
                {events.length === 0
                  ? "No events scheduled for this day."
                  : `${events.length} event${events.length > 1 ? "s" : ""} scheduled.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {event.type === "test-drive" ? (
                            <Car className="h-5 w-5 text-blue-500" />
                          ) : (
                            <MapPin className="h-5 w-5 text-green-500" />
                          )}
                          <h3 className="font-medium">
                            {event.type === "test-drive" ? "Test Drive" : "Vehicle Delivery"}
                          </h3>
                        </div>
                        <Badge
                          variant={
                            event.status === "confirmed"
                              ? "outline"
                              : event.status === "completed"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{event.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{event.customerName}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {event.customerPhone}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm">
                            <Car className="mr-1 h-4 w-4 text-muted-foreground" />
                            {event.vehicle}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
