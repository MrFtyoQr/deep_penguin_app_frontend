"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, Book, Plus, LogOut, User, Settings, ChevronRight, Trash2 } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/app/lib/auth" // Verificar que esta ruta sea correcta

// Define types for our study guides
interface Question {
  question: string
  options: string[]
  correct_answer: {
    index: number
    explanation: string
  }
}

interface StudyGuide {
  id: string
  title: string
  description: string
  level: string
  learning_style: string
  created_at: string
  questions: Question[]
}

// Determine if we're in development or production
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://deep-penguin-0f0b8241d682.herokuapp.com" : "http://localhost:8000"

export default function ProfilePage() {
  const { user, logout, loading } = useAuth()
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Fetch user's study guides
    const fetchStudyGuides = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${API_BASE_URL}/user/study-guides`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth0_token")}`,
            accept: "application/json",
          },
        })

        setStudyGuides(response.data)
      } catch (error) {
        console.error("Error fetching study guides:", error)
        setError("No se pudieron cargar tus guías de estudio")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchStudyGuides()
    }
  }, [user])

  const handleDeleteGuide = async (guideId: string, level: string, style: string) => {
    if (!user) return

    setIsDeleting(guideId)
    setError("")
    setSuccessMessage("")

    try {
      // Send the DELETE request
      await axios.delete(`${API_BASE_URL}/study-guide/${user.id}/${level}/${style}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth0_token")}`,
        },
      })

      // Remove the deleted guide from the state
      setStudyGuides((prev) => prev.filter((guide) => guide.id !== guideId))
      setSuccessMessage("Guía eliminada correctamente")

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    } catch (error) {
      console.error("Error al eliminar la guía de estudio:", error)
      setError("Error al eliminar la guía de estudio")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-xl">Deep Penguin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600" href="/study-guide">
            Nueva Guía
          </Link>
          <button onClick={handleLogout} className="text-sm font-medium hover:text-blue-600 flex items-center gap-1">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* User profile sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center justify-between p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Mis Guías
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/profile/settings"
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configuración
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="w-full md:w-3/4 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mis Guías de Estudio</h1>
                <Link href="/study-guide">
                  <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    Nueva Guía
                  </button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : studyGuides.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Book className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tienes guías de estudio</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Crea tu primera guía de estudio para comenzar a aprender
                    </p>
                    <Link href="/study-guide">
                      <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Crear guía de estudio
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/study-guide/${guide.id}`} className="block">
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                            <Book className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {guide.level}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{guide.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {guide.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{guide.questions.length} preguntas</span>
                          <span>
                            {new Date(guide.created_at).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleDeleteGuide(guide.id, guide.level, guide.learning_style)}
                        disabled={isDeleting === guide.id}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                        title="Eliminar guía"
                      >
                        {isDeleting === guide.id ? (
                          <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Deep Penguin. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-blue-600" href="#">
            Términos de servicio
          </Link>
          <Link className="text-xs hover:text-blue-600" href="#">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  )
}

