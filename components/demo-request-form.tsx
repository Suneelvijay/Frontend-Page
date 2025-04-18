 "use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { vehiclesAPI } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  preferredDate: z.date({
    required_error: "Please select a date for your test drive",
  }),
  notes: z.string().optional(),
});

export default function DemoRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data if authenticated
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      notes: "",
    },
  });

  // Check if user is authenticated, if not redirect to login
  if (!isAuthenticated) {
    router.push(`/login?returnUrl=/demo-ride?vehicleId=${vehicleId}`);
    return null;
  }

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!vehicleId) {
      toast.error("Vehicle information is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form data to API
      const response = await vehiclesAPI.requestDemoRide({
        vehicleId,
        customerId: user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: format(data.preferredDate, "yyyy-MM-dd"),
        notes: data.notes,
      });

      toast.success("Demo ride request submitted successfully");
      
      // Redirect to confirmation page
      router.push("/demo-ride/confirmation");
    } catch (error) {
      console.error("Failed to submit demo ride request:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule a Demo Ride</CardTitle>
          <CardDescription>Fill out the form below to request a test drive</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full flex justify-start items-center text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select your preferred date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            // Disable dates in the past and Sundays
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || date.getDay() === 0;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for your test drive (Sundays excluded)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any specific requirements or questions?" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-[#BB162B] hover:bg-[#A01020]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Schedule Demo Ride"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}