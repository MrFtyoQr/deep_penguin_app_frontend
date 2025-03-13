"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, RefreshCw, Search } from "lucide-react"
import Link from "next/link"

interface WordSearchProps {
  grid: string[][]
  words: string[]
}

export default function WordSearchPage() {
  const [puzzle, setPuzzle] = useState<WordSearchProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [currentSelection, setCurrentSelection] = useState<string[]>([])
  const [isSelecting, setIsSelecting] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch from your API
    fetchWordSearch()
  }, [])

  const fetchWordSearch = async () => {
    setLoading(true)
    try {
      // This would be your actual API endpoint
      // const response = await fetch('/api/word-search')
      // const data = await response.json()

      // For demonstration, using sample data
      const samplePuzzle: WordSearchProps = {
        grid: [
          ["P", "Y", "T", "H", "O", "N", "Q", "W", "E", "R"],
          ["R", "A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["O", "Z", "X", "C", "V", "B", "N", "M", "Q", "W"],
          ["G", "E", "R", "T", "Y", "U", "I", "O", "P", "A"],
          ["R", "S", "D", "F", "G", "H", "J", "K", "L", "Z"],
          ["A", "X", "C", "V", "B", "N", "M", "Q", "W", "E"],
          ["M", "R", "T", "Y", "U", "I", "O", "P", "A", "S"],
          ["M", "D", "F", "G", "H", "J", "A", "V", "A", "D"],
          ["I", "X", "C", "V", "B", "N", "M", "Q", "W", "F"],
          ["N", "G", "T", "Y", "U", "I", "O", "P", "A", "G"],
        ],
        words: ["PYTHON", "JAVA", "PROGRAMMING", "CODE"],
      }

      setPuzzle(samplePuzzle)
    } catch (error) {
      console.error("Failed to fetch word search puzzle:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCellMouseDown = (rowIndex: number, colIndex: number) => {
    setIsSelecting(true)
    const cellId = `${rowIndex}-${colIndex}`
    setCurrentSelection([cellId])
  }

  const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isSelecting) return

    const cellId = `${rowIndex}-${colIndex}`
    if (!currentSelection.includes(cellId)) {
      setCurrentSelection([...currentSelection, cellId])
    }
  }

  const handleCellMouseUp = () => {
    setIsSelecting(false)

    // Check if the selection forms a word
    if (currentSelection.length > 0) {
      const selectedLetters = currentSelection
        .map((cellId) => {
          const [rowIndex, colIndex] = cellId.split("-").map(Number)
          return puzzle?.grid[rowIndex][colIndex] || ""
        })
        .join("")

      // Check if the word is in the list (forward or backward)
      const reversedLetters = selectedLetters.split("").reverse().join("")

      if (puzzle?.words.includes(selectedLetters)) {
        setFoundWords((prev) => new Set([...prev, selectedLetters]))
        setSelectedCells((prev) => new Set([...prev, ...currentSelection]))
      } else if (puzzle?.words.includes(reversedLetters)) {
        setFoundWords((prev) => new Set([...prev, reversedLetters]))
        setSelectedCells((prev) => new Set([...prev, ...currentSelection]))
      } else {
        // Clear the selection if no word is found
        setCurrentSelection([])
      }
    }
  }

  const resetGame = () => {
    setSelectedCells(new Set())
    setFoundWords(new Set())
    setCurrentSelection([])
    fetchWordSearch()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Loading word search puzzle...</p>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg text-red-600">Failed to load word search puzzle</p>
        <button
          onClick={fetchWordSearch}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-center text-blue-600">Word Search Puzzle</h1>
          <button
            onClick={resetGame}
            className="flex items-center rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            New Puzzle
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="overflow-auto rounded-lg bg-white p-4 shadow-lg">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.grid[0].length}, minmax(30px, 1fr))`,
                }}
                onMouseLeave={handleCellMouseUp}
              >
                {puzzle.grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => {
                    const cellId = `${rowIndex}-${colIndex}`
                    const isSelected = selectedCells.has(cellId)
                    const isCurrentlySelected = currentSelection.includes(cellId)

                    return (
                      <div
                        key={cellId}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 font-bold text-lg transition-colors
                          ${isSelected ? "bg-green-200 border-green-500" : "bg-white"}
                          ${isCurrentlySelected && !isSelected ? "bg-blue-100 border-blue-400" : ""}
                        `}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                      >
                        {letter}
                      </div>
                    )
                  }),
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-600" />
                Words to Find
              </h2>
              <ul className="space-y-2">
                {puzzle.words.map((word) => {
                  const isFound = foundWords.has(word)
                  return (
                    <li
                      key={word}
                      className={`text-lg font-medium ${isFound ? "line-through text-green-600" : "text-gray-700"}`}
                    >
                      {word}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Found: {foundWords.size} of {puzzle.words.length}
                </p>
                {foundWords.size === puzzle.words.length && (
                  <div className="mt-4 rounded-md bg-green-100 p-3 text-green-800">
                    <p className="font-medium">Congratulations! You found all the words!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

