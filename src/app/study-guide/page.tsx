"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, ArrowRight, BookOpen, Save, Trash2, AlertCircle } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/app/lib/auth"

interface Option {
  index: number
  text: string
}

interface QuestionForAPI {
  text: string
  options: Option[]
  correct_answer: {
    index: number
    text: string
  }
}

interface Question {
  question: string
  options: string[]
  correct_answer: {
    index: number
    explanation: string
  }
}

interface Exam {
  title: string
  description: string
  questions: Question[]
}

// Determine if we're in development or production
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://deep-penguin-0f0b8241d682.herokuapp.com" : "http://localhost:8000"

export default function StudyGuidePage() {
  const { user, loading } = useAuth()
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [learningStyle, setLearningStyle] = useState("technical")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [exam, setExam] = useState<Exam | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Reset success/error messages after 5 seconds
  useEffect(() => {
    if (saveSuccess || saveError) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
        setSaveError("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess, saveError])

  const handleGenerate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setSaveSuccess(false)
      setSaveError("")

      try {
        // Format the URL according to the working curl example
        const response = await axios.get(
          `${API_BASE_URL}/study-guide/${encodeURIComponent(topic)}?level=${difficulty}&style=${learningStyle}`,
          {
            timeout: 60000,
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth0_token")}`, // Use Auth0 token
            },
          },
        )
        const data: Exam = response.data
        setExam(data)
        setUserAnswers(new Array(data.questions.length).fill(-1))
        setCurrentQuestionIndex(0)
        setShowResults(false)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.code === "ECONNABORTED") {
            console.error("La solicitud ha excedido el tiempo de espera")
            setSaveError("La solicitud ha excedido el tiempo de espera")
          } else {
            console.error("Error en la solicitud:", error.message)
            setSaveError(`Error en la solicitud: ${error.message}`)
          }
        } else {
          console.error("Error inesperado:", error)
          setSaveError("Error inesperado al generar la guía")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [topic, difficulty, learningStyle],
  )

  const handleSaveStudyGuide = useCallback(async () => {
    if (!exam || !user) return

    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError("")

    try {
      // Transform the exam data to match the API format
      const questionsForAPI: QuestionForAPI[] = exam.questions.map((q) => ({
        text: q.question,
        options: q.options.map((opt, idx) => ({
          index: idx,
          text: opt,
        })),
        correct_answer: {
          index: q.correct_answer.index,
          text: q.options[q.correct_answer.index],
        },
      }))

      // Create the payload
      const payload = {
        user_id: user.id,
        text: exam.title,
        questions: questionsForAPI,
      }

      // Send the POST request
      await axios.post(`${API_BASE_URL}/study-guide`, payload, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth0_token")}`, // Use Auth0 token
        },
      })

      setSaveSuccess(true)
    } catch (error) {
      console.error("Error al guardar la guía de estudio:", error)
      setSaveError("Error al guardar la guía de estudio")
    } finally {
      setIsSaving(false)
    }
  }, [exam, user])

  const handleDeleteStudyGuide = useCallback(async () => {
    if (!user) return

    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError("")

    try {
      // Send the DELETE request
      await axios.delete(`${API_BASE_URL}/study-guide/${user.id}/${difficulty}/${learningStyle}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth0_token")}`, // Use Auth0 token
        },
      })

      setSaveSuccess(true)
      // Optionally redirect to profile after deletion
      router.push("/profile")
    } catch (error) {
      console.error("Error al eliminar la guía de estudio:", error)
      setSaveError("Error al eliminar la guía de estudio")
    } finally {
      setIsSaving(false)
    }
  }, [user, difficulty, learningStyle, router])

  const handleAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[questionIndex] = answerIndex
      return newAnswers
    })
  }, [])

  const handleSubmit = useCallback(() => {
    setShowResults(true)
  }, [])

  const calculateScore = useCallback(() => {
    if (!exam) return 0
    return exam.questions.reduce((score, question, index) => {
      return score + (question.correct_answer.index === userAnswers[index] ? 1 : 0)
    }, 0)
  }, [exam, userAnswers])

  const handleReset = useCallback(() => {
    setExam(null)
    setTopic("")
    setDifficulty("medium")
    setLearningStyle("technical")
    setUserAnswers([])
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setSaveSuccess(false)
    setSaveError("")
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-xl">Deep Penguin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600" href="/profile">
            Mi Perfil
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {saveSuccess && (
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
              <span>Operación completada con éxito</span>
            </div>
          )}

          {saveError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{saveError}</span>
            </div>
          )}

          {!exam ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold">Crear Guía de Estudio</h1>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="topic" className="block text-sm font-medium">
                    ¿Qué tema quieres estudiar?
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ej: Historia de México, Cálculo Diferencial, Programación en Python..."
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="difficulty" className="block text-sm font-medium">
                      Nivel de dificultad
                    </label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="easy">Básico</option>
                      <option value="medium">Intermedio</option>
                      <option value="hard">Avanzado</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="learningStyle" className="block text-sm font-medium">
                      Estilo de aprendizaje
                    </label>
                    <select
                      id="learningStyle"
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="technical">Técnico</option>
                      <option value="visual">Visual</option>
                      <option value="practical">Práctico</option>
                      <option value="conceptual">Conceptual</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generando guía...</span>
                    </>
                  ) : (
                    <>
                      Generar guía de estudio <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : showResults ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Resultados</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveStudyGuide}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar guía
                  </button>
                  <button
                    onClick={handleDeleteStudyGuide}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Tu puntuación</p>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {calculateScore()} / {exam.questions.length}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round((calculateScore() / exam.questions.length) * 100)}% de respuestas correctas
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {exam.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className={`p-4 rounded-lg border ${
                      userAnswers[qIndex] === question.correct_answer.index
                        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                        : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                    }`}
                  >
                    <p className="font-medium mb-3">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-3 rounded-md ${
                            oIndex === question.correct_answer.index
                              ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                              : oIndex === userAnswers[qIndex]
                                ? "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                                : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium mb-1">Explicación:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{question.correct_answer.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Crear nueva guía
                </button>
                <Link href="/profile" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Ir a mi perfil
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{exam.title}</h2>
                <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                  Pregunta {currentQuestionIndex + 1} de {exam.questions.length}
                </span>
              </div>

              <div className="mb-8">
                <p className="text-lg font-medium mb-4">{exam.questions[currentQuestionIndex].question}</p>
                <div className="space-y-3">
                  {exam.questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestionIndex, index)}
                      className={`w-full text-left p-4 rounded-md border transition-colors ${
                        userAnswers[currentQuestionIndex] === index
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {currentQuestionIndex < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    disabled={userAnswers[currentQuestionIndex] === -1}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={userAnswers.some((answer) => answer === -1)}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ver resultados
                  </button>
                )}
              </div>
            </div>
          )}
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

