"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, RefreshCw, Grid } from "lucide-react"
import Link from "next/link"

interface CrosswordCell {
  letter: string
  number?: number
  isBlack: boolean
  row: number
  col: number
}

interface CrosswordClue {
  number: number
  clue: string
  answer: string
  direction: "across" | "down"
}

interface CrosswordPuzzle {
  grid: CrosswordCell[][]
  clues: {
    across: CrosswordClue[]
    down: CrosswordClue[]
  }
  size: number
}

export default function CrosswordPage() {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null)
  const [loading, setLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [direction, setDirection] = useState<"across" | "down">("across")
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([])

  useEffect(() => {
    fetchCrossword()
  }, [])

  useEffect(() => {
    if (puzzle && selectedCell) {
      const { row, col } = selectedCell
      inputRefs.current[row][col]?.focus()
    }
  }, [selectedCell, puzzle])

  const fetchCrossword = async () => {
    setLoading(true)
    try {
      // This would be your actual API endpoint
      // const response = await fetch('/api/crossword')
      // const data = await response.json()

      // For demonstration, using sample data
      const samplePuzzle: CrosswordPuzzle = {
        size: 5,
        grid: [
          [
            { letter: "C", number: 1, isBlack: false, row: 0, col: 0 },
            { letter: "O", isBlack: false, row: 0, col: 1 },
            { letter: "D", isBlack: false, row: 0, col: 2 },
            { letter: "E", isBlack: false, row: 0, col: 3 },
            { letter: "", isBlack: true, row: 0, col: 4 },
          ],
          [
            { letter: "L", number: 2, isBlack: false, row: 1, col: 0 },
            { letter: "O", isBlack: false, row: 1, col: 1 },
            { letter: "O", isBlack: false, row: 1, col: 2 },
            { letter: "P", isBlack: false, row: 1, col: 3 },
            { letter: "", isBlack: true, row: 1, col: 4 },
          ],
          [
            { letter: "A", number: 3, isBlack: false, row: 2, col: 0 },
            { letter: "P", isBlack: false, row: 2, col: 1 },
            { letter: "I", isBlack: false, row: 2, col: 2 },
            { letter: "", isBlack: true, row: 2, col: 3 },
            { letter: "J", number: 4, isBlack: false, row: 2, col: 4 },
          ],
          [
            { letter: "S", number: 5, isBlack: false, row: 3, col: 0 },
            { letter: "Y", isBlack: false, row: 3, col: 1 },
            { letter: "N", isBlack: false, row: 3, col: 2 },
            { letter: "C", isBlack: false, row: 3, col: 3 },
            { letter: "S", isBlack: false, row: 3, col: 4 },
          ],
          [
            { letter: "", isBlack: true, row: 4, col: 0 },
            { letter: "D", number: 6, isBlack: false, row: 4, col: 1 },
            { letter: "O", isBlack: false, row: 4, col: 2 },
            { letter: "M", isBlack: false, row: 4, col: 3 },
            { letter: "", isBlack: true, row: 4, col: 4 },
          ],
        ],
        clues: {
          across: [
            { number: 1, clue: "Computer instructions", answer: "CODE", direction: "across" },
            { number: 2, clue: "Repetitive structure in programming", answer: "LOOP", direction: "across" },
            { number: 3, clue: "Interface for applications", answer: "API", direction: "across" },
            { number: 5, clue: "Coordinating operations", answer: "SYNC", direction: "across" },
            { number: 6, clue: "Document Object Model", answer: "DOM", direction: "across" },
          ],
          down: [
            { number: 1, clue: "Programming language with classes", answer: "CLASS", direction: "down" },
            { number: 2, clue: "Logical operation", answer: "OPYN", direction: "down" },
            { number: 3, clue: "Asynchronous JavaScript And XML", answer: "AJAX", direction: "down" },
            { number: 4, clue: "JavaScript runtime", answer: "JS", direction: "down" },
          ],
        },
      }

      setPuzzle(samplePuzzle)

      // Initialize user answers grid
      const initialAnswers = Array(samplePuzzle.size)
        .fill(null)
        .map(() => Array(samplePuzzle.size).fill(""))
      setUserAnswers(initialAnswers)

      // Initialize input refs
      inputRefs.current = Array(samplePuzzle.size)
        .fill(null)
        .map(() => Array(samplePuzzle.size).fill(null))
    } catch (error) {
      console.error("Failed to fetch crossword puzzle:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (puzzle?.grid[row][col].isBlack) return

    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction if clicking the same cell
      setDirection((prev) => (prev === "across" ? "down" : "across"))
    } else {
      setSelectedCell({ row, col })
    }
  }

  const handleInputChange = (row: number, col: number, value: string) => {
    if (!puzzle) return

    // Only allow single letters
    if (value.length > 1) value = value.charAt(value.length - 1)

    // Update user answers
    const newAnswers = [...userAnswers]
    newAnswers[row][col] = value.toUpperCase()
    setUserAnswers(newAnswers)

    // Move to next cell based on direction
    if (value) {
      if (direction === "across" && col < puzzle.size - 1 && !puzzle.grid[row][col + 1]?.isBlack) {
        setSelectedCell({ row, col: col + 1 })
      } else if (direction === "down" && row < puzzle.size - 1 && !puzzle.grid[row + 1][col]?.isBlack) {
        setSelectedCell({ row: row + 1, col })
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (!puzzle) return

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault()
        if (col < puzzle.size - 1) {
          let nextCol = col + 1
          while (nextCol < puzzle.size && puzzle.grid[row][nextCol].isBlack) {
            nextCol++
          }
          if (nextCol < puzzle.size) setSelectedCell({ row, col: nextCol })
        }
        break
      case "ArrowLeft":
        e.preventDefault()
        if (col > 0) {
          let prevCol = col - 1
          while (prevCol >= 0 && puzzle.grid[row][prevCol].isBlack) {
            prevCol--
          }
          if (prevCol >= 0) setSelectedCell({ row, col: prevCol })
        }
        break
      case "ArrowDown":
        e.preventDefault()
        if (row < puzzle.size - 1) {
          let nextRow = row + 1
          while (nextRow < puzzle.size && puzzle.grid[nextRow][col].isBlack) {
            nextRow++
          }
          if (nextRow < puzzle.size) setSelectedCell({ row: nextRow, col })
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (row > 0) {
          let prevRow = row - 1
          while (prevRow >= 0 && puzzle.grid[prevRow][col].isBlack) {
            prevRow--
          }
          if (prevRow >= 0) setSelectedCell({ row: prevRow, col })
        }
        break
      case "Backspace":
        if (userAnswers[row][col] === "") {
          // Move to previous cell if current cell is empty
          if (direction === "across" && col > 0) {
            let prevCol = col - 1
            while (prevCol >= 0 && puzzle.grid[row][prevCol].isBlack) {
              prevCol--
            }
            if (prevCol >= 0) {
              setSelectedCell({ row, col: prevCol })
              // Clear the previous cell
              const newAnswers = [...userAnswers]
              newAnswers[row][prevCol] = ""
              setUserAnswers(newAnswers)
            }
          } else if (direction === "down" && row > 0) {
            let prevRow = row - 1
            while (prevRow >= 0 && puzzle.grid[prevRow][col].isBlack) {
              prevRow--
            }
            if (prevRow >= 0) {
              setSelectedCell({ row: prevRow, col })
              // Clear the previous cell
              const newAnswers = [...userAnswers]
              newAnswers[prevRow][col] = ""
              setUserAnswers(newAnswers)
            }
          }
        }
        break
      case "Tab":
        e.preventDefault()
        // Move to next clue
        if (direction === "across") {
          setDirection("down")
        } else {
          setDirection("across")
        }
        break
    }
  }

  const resetGame = () => {
    setUserAnswers(
      Array(puzzle?.size || 0)
        .fill(null)
        .map(() => Array(puzzle?.size || 0).fill("")),
    )
    setSelectedCell(null)
    setDirection("across")
  }

  const checkAnswers = () => {
    if (!puzzle) return

    let allCorrect = true
    const newAnswers = [...userAnswers]

    for (let row = 0; row < puzzle.size; row++) {
      for (let col = 0; col < puzzle.size; col++) {
        if (!puzzle.grid[row][col].isBlack) {
          if (userAnswers[row][col] !== puzzle.grid[row][col].letter) {
            allCorrect = false
            // Clear incorrect answers
            newAnswers[row][col] = ""
          }
        }
      }
    }

    if (!allCorrect) {
      setUserAnswers(newAnswers)
      alert("Some answers are incorrect. Incorrect cells have been cleared.")
    } else {
      alert("Congratulations! All answers are correct!")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Loading crossword puzzle...</p>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg text-red-600">Failed to load crossword puzzle</p>
        <button onClick={fetchCrossword} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-center text-blue-600">Crossword Puzzle</h1>
          <div className="flex space-x-2">
            <button
              onClick={resetGame}
              className="flex items-center rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Reset
            </button>
            <button
              onClick={checkAnswers}
              className="flex items-center rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              Check
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="overflow-auto rounded-lg bg-white p-4 shadow-lg">
              <div
                className="grid gap-px bg-gray-300"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.size}, minmax(40px, 1fr))`,
                  width: "fit-content",
                }}
              >
                {puzzle.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`relative h-12 w-12 ${cell.isBlack ? "bg-black" : "bg-white"} ${
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => !cell.isBlack && handleCellClick(rowIndex, colIndex)}
                    >
                      {cell.number && (
                        <span className="absolute left-1 top-0 text-xs font-semibold">{cell.number}</span>
                      )}
                      {!cell.isBlack && (
                        <input
                          ref={(el) => {
                            if (inputRefs.current) {
                              inputRefs.current[rowIndex][colIndex] = el
                            }
                          }}
                          type="text"
                          maxLength={1}
                          value={userAnswers[rowIndex]?.[colIndex] || ""}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                          className="h-full w-full border-none bg-transparent text-center text-xl font-bold uppercase focus:outline-none"
                          readOnly={cell.isBlack}
                        />
                      )}
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setDirection("across")}
                    className={`px-4 py-2 font-medium ${
                      direction === "across" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    } rounded-md`}
                  >
                    Across
                  </button>
                  <button
                    onClick={() => setDirection("down")}
                    className={`px-4 py-2 font-medium ${
                      direction === "down" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    } rounded-md`}
                  >
                    Down
                  </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                <h2 className="mb-2 text-xl font-semibold flex items-center">
                  <Grid className="mr-2 h-5 w-5 text-blue-600" />
                  {direction === "across" ? "Across" : "Down"} Clues
                </h2>
                <ul className="space-y-2">
                  {puzzle.clues[direction].map((clue) => (
                    <li
                      key={`${clue.direction}-${clue.number}`}
                      className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
                      onClick={() => {
                        // Find the cell with this clue number
                        for (let row = 0; row < puzzle.size; row++) {
                          for (let col = 0; col < puzzle.size; col++) {
                            if (puzzle.grid[row][col].number === clue.number) {
                              setSelectedCell({ row, col })
                              setDirection(clue.direction)
                              return
                            }
                          }
                        }
                      }}
                    >
                      <span className="font-bold">{clue.number}.</span> {clue.clue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

