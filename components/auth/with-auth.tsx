import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { checkAuthStatus } from '@/lib/auth-utils'

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const router = useRouter()

    useEffect(() => {
      const isAuthenticated = checkAuthStatus(router, toast)
      if (!isAuthenticated) {
        return
      }
    }, [router])

    return <WrappedComponent {...props} />
  }
} 