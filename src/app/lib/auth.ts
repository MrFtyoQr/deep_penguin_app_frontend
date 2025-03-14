"use client"

// This is a placeholder for Auth0 integration
// You'll need to replace this with actual Auth0 configuration

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
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      // Validate token with your backend
      // For now, we'll just simulate a logged-in user
      setUser({
        id: "1",
        name: "Usuario de Ejemplo",
        email: "usuario@ejemplo.com",
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Replace with actual Auth0 login
      // const response = await fetch('your-auth-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })

      // if (!response.ok) throw new Error('Invalid credentials')

      // const data = await response.json()
      // localStorage.setItem('token', data.token)

      // Simulate successful login
      localStorage.setItem("token", "fake-token")
      setUser({
        id: "1",
        name: "Usuario de Ejemplo",
        email: email,
      })

      router.push("/profile")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Replace with actual Auth0 signup
      // const response = await fetch('your-auth-endpoint/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // })

      // if (!response.ok) throw new Error('Error creating account')

      // const data = await response.json()
      // localStorage.setItem('token', data.token)

      // Simulate successful signup
      localStorage.setItem("token", "fake-token")
      setUser({
        id: "1",
        name: name,
        email: email,
      })

      router.push("/profile")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
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

