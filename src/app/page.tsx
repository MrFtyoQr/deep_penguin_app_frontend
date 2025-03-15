import Link from "next/link"
import { BookOpen, Brain, Users, Trophy } from "lucide-react"

import { getSession } from '@auth0/nextjs-auth0';
import { GetServerSideProps } from 'next';

type DashboardProps = {
  user: {
    name?: string;
    email?: string;
    picture?: string;
  } | null;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (!session?.user) {
    // Redirigir al login si no hay usuario autenticado
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
};


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-xl">Deep Penguin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600" href="/teachers">
            Para Maestros
          </Link>
          <Link href="/api/auth/login" className="text-sm font-medium hover:text-blue-600" >
          Comenzar
        </Link>
      </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Aprende sin límites con Deep Penguin
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Descubre una nueva forma de estudiar donde el miedo a equivocarse desaparece y el aprendizaje se
                convierte en una aventura.
              </p>
              <div className="space-x-4">
                <button className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Comenzar gratis
                </button>
                <Link href={"/teachers"}>
                  <button className="px-4 py-2 rounded-md font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                    Para maestros
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Características principales
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Temas personalizados</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Genera contenido de estudio sobre cualquier tema que elijas.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">IA inteligente</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Utiliza IA avanzada para crear preguntas y reforzar tu aprendizaje.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Aprendizaje social</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Comparte y aprende con otros, inspirándote en la comunidad.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Trophy className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Progreso gamificado</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Disfruta aprendiendo como si fuera un juego, sin miedo a equivocarte.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Para estudiantes</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Aprende a tu ritmo, sin presiones. Explora temas fascinantes, practica con preguntas generadas por IA
                  y disfruta del proceso de aprendizaje como nunca antes.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Para maestros</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Crea exámenes personalizados, sigue el progreso de tus estudiantes y adapta tu enseñanza con insights
                  basados en IA. Transforma tu clase en una experiencia de aprendizaje única.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comienza tu aventura de aprendizaje hoy
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
                Únete a nuestra comunidad de aprendices entusiastas y descubre el poder de estudiar sin límites.
              </p>
              <div className="space-x-4">
                <button className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Comenzar gratis
                </button>
                <Link href={"/teachers"}>
                  <button className="px-4 py-2 rounded-md font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                    Explorar más
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
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

