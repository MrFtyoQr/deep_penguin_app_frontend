"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-xl">Deep Penguin</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="mx-auto max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
            <p className="text-gray-500 dark:text-gray-400">Bienvenido de nuevo a Deep Penguin</p>
          </div>

          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
          >
            Iniciar sesión con Auth0
          </button>

          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
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

