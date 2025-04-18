/**
 * Authentication utilities for the application
 */

/**
 * Handles user logout by clearing localStorage and calling the logout API
 * @param callback Optional callback function to execute after logout (e.g., for redirection)
 */
export const handleLogout = async (callback?: () => void) => {
    try {
      // Get the auth token
      const token = localStorage.getItem("authToken")
      
      if (token) {
        // Call the logout API
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({})
        }).catch(err => console.error("Logout API error:", err))
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear localStorage regardless of API success
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      
      // Execute callback if provided (e.g., redirect to login page)
      if (callback) {
        callback()
      }
    }
  }
  
  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is authenticated
   */
  export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false
    
    return !!localStorage.getItem("authToken")
  }
  
  /**
   * Get current user data from localStorage
   * @returns User data object or null if not authenticated
   */
  export const getCurrentUser = () => {
    if (typeof window === 'undefined') return null
    
    const userData = localStorage.getItem("userData")
    
    if (!userData) return null
    
    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }
  
  /**
   * Get user role from localStorage
   * @returns User role or null if not authenticated
   */
  export const getUserRole = (): string | null => {
    const user = getCurrentUser()
    return user?.role || null
  }