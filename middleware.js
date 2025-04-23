import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get the user data from localStorage
  const userData = request.cookies.get('userData')?.value
  let user = null
  
  try {
    user = userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error parsing user data:', error)
  }

  // Define protected routes and their required roles
  const protectedRoutes = {
    '/customer': ['CUSTOMER'],
    '/admin': ['ADMIN'],
    '/dealer': ['DEALER']
  }

  // Check if the current path starts with any protected route
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => path.startsWith(route))

  if (isProtectedRoute) {
    // If no user is logged in, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has the required role for the route
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) => path.startsWith(route))[1]
    
    if (!requiredRoles.includes(user.role)) {
      // If user doesn't have the required role, redirect to appropriate page
      switch (user.role) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/admin', request.url))
        case 'DEALER':
          return NextResponse.redirect(new URL('/dealer', request.url))
        case 'CUSTOMER':
          return NextResponse.redirect(new URL('/customer', request.url))
        default:
          return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    '/customer/:path*',
    '/admin/:path*',
    '/dealer/:path*'
  ]
} 