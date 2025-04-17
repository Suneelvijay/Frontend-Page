"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, Car, Calculator, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Effect to handle window resize and initial mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sample vehicle data
  const vehicles = [
    { id: 1, name: "Kia Seltos", image: "/vehicle1.png?height=200&width=300", price: "₹10.89 - 19.65 Lakh" },
    { id: 2, name: "Kia Sonet", image: "/vehicle2.png?height=200&width=300", price: "₹7.79 - 14.89 Lakh" },
    { id: 3, name: "Kia Carens", image: "/vehicle3.png?height=200&width=300", price: "₹10.45 - 19.45 Lakh" },
    { id: 4, name: "Kia EV6", image: "/vehicle4.png?height=200&width=300", price: "₹60.95 - 65.95 Lakh" },
    { id: 5, name: "Kia Carnival", image: "/vehicle5.png?height=200&width=300", price: "₹24.95 - 33.99 Lakh" },
    { id: 6, name: "Kia Sportage", image: "/vehicle6.png?height=200&width=300", price: "₹25.95 - 30.95 Lakh" },
  ]

  const totalSlides = Math.ceil(vehicles.length / 3)

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (isMobile) {
        return prev === vehicles.length - 1 ? 0 : prev + 1
      } else {
        return prev === totalSlides - 1 ? 0 : prev + 1
      }
    })
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (isMobile) {
        return prev === 0 ? vehicles.length - 1 : prev - 1
      } else {
        return prev === 0 ? totalSlides - 1 : prev - 1
      }
    })
  }

  const handleActionButtonClick = (action) => {
    // In a real application, this would check if user is logged in
    // and redirect to the appropriate form or login page
    alert(`Please log in to ${action}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="#about" className="font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#services" className="font-medium transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="#contact" className="font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Image
              src="/kialogo-removebg.png?height=40&width=120"
              alt="Kia Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#BB162B] hover:bg-[#A01020]">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Banner Section */}
        <section className="w-full relative">
          <Image
            src="/hero-car.jpg?height=500&width=1920"
            alt="Kia Banner"
            width={1920}
            height={500}
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Welcome to Kia Dealer Management System
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                Discover the perfect Kia vehicle for your lifestyle
              </p>
            </div>
          </div>
        </section>

        {/* Vehicles Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Vehicles</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our range of stylish and innovative vehicles
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentSlide * (isMobile ? 100 : 33.333)}%)` 
                  }}
                >
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="min-w-full md:min-w-[33.333%] px-2">
                      <Card className="w-full flex flex-col">
                        <div className="relative h-[200px]">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                        <CardContent className="flex flex-col flex-grow p-4">
                          <h3 className="text-xl font-bold mb-1">{vehicle.name}</h3>
                          <p className="text-muted-foreground mb-4">{vehicle.price}</p>
                          <div className="mt-auto flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleActionButtonClick("request a demo ride")}
                            >
                              Request Demo Ride
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-[#BB162B] hover:bg-[#A01020]"
                              onClick={() => handleActionButtonClick("get a quote")}
                            >
                              Get Quote
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-0 rounded-full bg-white/80 hover:bg-white"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 rounded-full bg-white/80 hover:bg-white"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="flex justify-center mt-4 gap-1">
                {Array.from({ length: isMobile ? vehicles.length : totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-[#BB162B]" : "bg-gray-300"}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Kia Section */}
        <section id="about" className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex justify-center">
                <Image
                  src="/kia-seeklogo.png?height=600&width=600"
                  alt="Kia Logo"
                  width={600}
                  height={600}
                  className="max-w-full h-auto"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About Kia</h2>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Kia Corporation, commonly known as Kia, is a South Korean multinational automobile manufacturer
                  headquartered in Seoul, South Korea. It is South Korea's second-largest automobile manufacturer after
                  its parent company, Hyundai Motor Company.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Kia India, a subsidiary of Kia Corporation, has quickly established itself as one of the leading
                  automotive companies in India. With a commitment to innovation, quality, and customer satisfaction,
                  Kia India offers a range of SUVs, MPVs, and electric vehicles designed to meet the diverse needs of
                  Indian consumers.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Our state-of-the-art manufacturing facility in Anantapur, Andhra Pradesh, produces world-class
                  vehicles with cutting-edge technology and features. We are dedicated to providing exceptional service
                  through our extensive dealer network across the country.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8">Our Services</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 items-center">
              <div className="flex justify-center">
                <Image
                  src="/serviceimg.png?height=1000&width=1000"
                  alt="Kia Service"
                  width={1000}
                  height={1000}
                  className="rounded-lg"
                />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="flex flex-col items-center text-center p-6">
                  <Calendar className="h-12 w-12 text-[#BB162B] mb-4" />
                  <h3 className="text-xl font-bold mb-2">Book Test Drive</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule a test drive at your convenience with your preferred Kia vehicle.
                  </p>
                  <Button className="mt-auto bg-[#BB162B] hover:bg-[#A01020]">Book Now</Button>
                </Card>

                <Card className="flex flex-col items-center text-center p-6">
                  <Car className="h-12 w-12 text-[#BB162B] mb-4" />
                  <h3 className="text-xl font-bold mb-2">Book a Car</h3>
                  <p className="text-muted-foreground mb-4">
                    Reserve your Kia vehicle online with a simple booking process.
                  </p>
                  <Button className="mt-auto bg-[#BB162B] hover:bg-[#A01020]">Book Now</Button>
                </Card>

                <Card className="flex flex-col items-center text-center p-6">
                  <Calculator className="h-12 w-12 text-[#BB162B] mb-4" />
                  <h3 className="text-xl font-bold mb-2">EMI Calculator</h3>
                  <p className="text-muted-foreground mb-4">
                    Calculate your monthly installments based on your preferred financing options.
                  </p>
                  <Button className="mt-auto bg-[#BB162B] hover:bg-[#A01020]">Calculate</Button>
                </Card>

                <Card className="flex flex-col items-center text-center p-6">
                  <FileText className="h-12 w-12 text-[#BB162B] mb-4" />
                  <h3 className="text-xl font-bold mb-2">Download Brochure</h3>
                  <p className="text-muted-foreground mb-4">
                    Get detailed information about our vehicles with downloadable brochures.
                  </p>
                  <Button className="mt-auto bg-[#BB162B] hover:bg-[#A01020]">Download</Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Contact Us</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get in touch with our team for any inquiries or assistance
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Corporate Office</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Kia India Private Limited</p>
                  <p>NH-44, SY.No. 151-2, Erramanchi, Anantapur</p>
                  <p>Andhra Pradesh, 515002, India</p>
                  <p className="pt-2">Email: customer.care@kia.com</p>
                  <p>Toll-Free: 1800-108-5000</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 5:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="pt-2">Customer Support: 24/7</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-[#05141F] text-white">
        <div className="container py-6 md:py-8">
          <div className="text-center">
            <p>© {new Date().getFullYear()} Kia India. All Rights Reserved.</p>
            <p className="text-sm mt-1 text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
