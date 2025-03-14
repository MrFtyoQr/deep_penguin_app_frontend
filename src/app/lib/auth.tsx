"use client"

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

// Auth0 URLs
const AUTH0_DOMAIN = "dev-xxxxxxxx.us.auth0.com" // Reemplaza con tu dominio de Auth0
const AUTH0_CLIENT_ID = "tu_client_id" // Reemplaza con tu Client ID de Auth0
const REDIRECT_URI = "https://deep-penguin-dwy9cfzwg-mrftyoqrs-projects.vercel.app/api/auth/callback"
const HOME_URL = "https://deep-penguin-dwy9cfzwg-mrftyoqrs-projects.vercel.app"

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
    // Redirect to Auth0 login page
    window.location.href = `https://${AUTH0_DOMAIN}/authorize?response_type=code&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email`
  }

  const signup = () => {
    // Redirect to Auth0 signup page
    window.location.href = `https://${AUTH0_DOMAIN}/authorize?response_type=code&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email&screen_hint=signup`
  }

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("auth0_token")
    setUser(null)

    // Redirect to Auth0 logout URL
    window.location.href = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(HOME_URL)}`
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

