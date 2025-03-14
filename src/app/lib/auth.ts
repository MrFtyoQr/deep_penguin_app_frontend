"use client"

// Auth0 integration
import { useRouter } from "next/navigation"
import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  signup: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Check for Auth0 token in localStorage or session
        const token = localStorage.getItem("auth0_token")

        if (token) {
          // In a real implementation, you would validate the token
          // and fetch user data from Auth0

          // For now, we'll simulate a logged-in user
          setUser({
            id: "Auth0", // Using 'Auth0' as the user_id to match your DELETE endpoint
            name: "Usuario de Deep Penguin",
            email: "usuario@ejemplo.com",
          })
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = () => {
    // In a real implementation, this would redirect to Auth0 login page
    // For now, we'll simulate a successful login

    // Redirect to Auth0 login
    // window.location.href = 'https://your-auth0-domain.auth0.com/authorize?...'

    // For demo purposes, simulate successful login
    localStorage.setItem("auth0_token", "simulated_token")
    setUser({
      id: "Auth0",
      name: "Usuario de Deep Penguin",
      email: "usuario@ejemplo.com",
    })
    router.push("/profile")
  }

  const signup = () => {
    // In a real implementation, this would redirect to Auth0 signup page
    // For now, we'll simulate a successful signup

    // Redirect to Auth0 signup
    // window.location.href = 'https://your-auth0-domain.auth0.com/authorize?screen_hint=signup&...'

    // For demo purposes, simulate successful signup
    localStorage.setItem("auth0_token", "simulated_token")
    setUser({
      id: "Auth0",
      name: "Usuario de Deep Penguin",
      email: "usuario@ejemplo.com",
    })
    router.push("/profile")
  }

  const logout = () => {
    // In a real implementation, this would call Auth0 logout endpoint
    // For now, we'll just clear the token

    localStorage.removeItem("auth0_token")
    setUser(null)

    // In a real implementation, you would redirect to Auth0 logout URL
    // window.location.href = 'https://your-auth0-domain.auth0.com/v2/logout?...'

    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

