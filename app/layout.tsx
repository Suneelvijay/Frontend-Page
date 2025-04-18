import { Inter } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import ClientOnly from "@/components/client-only"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kia DMS",
  description: "Kia Dealer Management System",
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ClientOnly>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  )
}