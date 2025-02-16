"use client"

import type React from "react"
import axios from "axios"
import { useState, useCallback } from "react"
import { BookOpen, ChevronLeft, ChevronRight, Loader2, User, RefreshCw } from "lucide-react"
import Link from "next/link"

type Option = { index: number; text: string }
type Question = { text: string; options: Option[]; correct_answer: Option }
type Exam = { text: string; questions: Question[] }

export default function StudyGuidePage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [learningStyle, setLearningStyle] = useState("technical")
  const [isLoading, setIsLoading] = useState(false)
  const [exam, setExam] = useState<Exam | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  // Simulamos un nombre de usuario para la demostración
  const userName = "Juan Pérez"

  const handleGenerate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      try {
        const response = await axios.get(
          `https://deep-penguin-0f0b8241d682.herokuapp.com/study-guide/${encodeURIComponent(topic)}`,
          {
            timeout: 60000, // 30 segundos de timeout
            headers: {
              accept: "application/json",
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
            // Aquí podrías mostrar un mensaje al usuario sobre el timeout
          } else {
            console.error("Error en la solicitud:", error.message)
          }
        } else {
          console.error("Error inesperado:", error)
        }
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setIsLoading(false)
      }
    },
    [topic],
  )

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
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">AprendeIA</span>
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-2">{userName}</span>
              <User className="h-6 w-6 text-gray-500" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Generador de Guías de Estudio
          </h1>

          {!exam && (
            <form
              onSubmit={handleGenerate}
              className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-8 pt-6 pb-8 mb-4"
            >
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="topic">
                  Tema a estudiar
                </label>
                <input
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="topic"
                  type="text"
                  placeholder="Ingresa el tema"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="difficulty">
                  Nivel de dificultad
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
                  htmlFor="learningStyle"
                >
                  Estilo de aprendizaje
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="learningStyle"
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                >
                  <option value="technical">Técnico</option>
                  <option value="creative">Creativo</option>
                  <option value="practical">Práctico</option>
                </select>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                  ) : (
                    <span className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Generar Guía de Estudio
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}

          {exam && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Guía de Estudio Generada</h2>
              <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Texto de Estudio:</h3>
                <p className="text-gray-700 dark:text-gray-300">{exam.text}</p>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Preguntas:</h3>
                {exam.questions[currentQuestionIndex] && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <p className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                      {currentQuestionIndex + 1}. {exam.questions[currentQuestionIndex].text}
                    </p>
                    <div className="space-y-3">
                      {exam.questions[currentQuestionIndex].options.map((option) => (
                        <label
                          key={option.index}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={option.index}
                            checked={userAnswers[currentQuestionIndex] === option.index}
                            onChange={() => handleAnswer(currentQuestionIndex, option.index)}
                            className="form-radio h-5 w-5 text-blue-600"
                            disabled={showResults}
                          />
                          <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                          {showResults &&
                            option.index === exam.questions[currentQuestionIndex].correct_answer.index && (
                              <span className="text-green-500 ml-2 font-semibold">(Correcta)</span>
                            )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === exam.questions.length - 1}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {!showResults && (
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Enviar Respuestas
                  </button>
                </div>
              )}
              {showResults && (
                <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Resultados:</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Puntuación: <span className="font-bold text-blue-600 dark:text-blue-400">{calculateScore()}</span>{" "}
                    de {exam.questions.length} correctas
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleReset}
                      className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 flex items-center"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Nueva Guía de Estudio
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

