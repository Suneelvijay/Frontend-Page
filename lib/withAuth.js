import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from './auth-utils'

export function withAuth(WrappedComponent, allowedRoles) {
  return function ProtectedRoute(props) {
    const router = useRouter()
    const user = getCurrentUser()

    useEffect(() => {
      // If no user is logged in, redirect to login
      if (!user) {
        router.push('/login')
        return
      }

      // If user's role is not in allowed roles, redirect to appropriate page
      if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
          case 'ADMIN':
            router.push('/admin')
            break
          case 'DEALER':
            router.push('/dealer')
            break
          case 'CUSTOMER':
            router.push('/customer')
            break
          default:
            router.push('/login')
        }
      }
    }, [user, router])

    // If no user or user's role is not allowed, don't render the component
    if (!user || !allowedRoles.includes(user.role)) {
      return null
    }

    // If user is authenticated and has the correct role, render the component
    return <WrappedComponent {...props} />
  }
} 