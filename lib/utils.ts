export const cn = (...classes: (string | undefined | null | false | 0)[]) => {
  return classes.filter(Boolean).join(" ")
}

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