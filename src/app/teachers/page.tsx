import Link from "next/link";
import {
  BookOpen,
  FileText,
  CheckSquare,
  Calculator,
  Download,
  Lightbulb,
} from "lucide-react";

export default function TeachersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-xl">
            Deep Penguin para Maestros
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600" href={"/"}>
            Inicio
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600"
            href="/pricing"
          >
            Precios
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Revoluciona tus evaluaciones con IA
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Genera exámenes personalizados, versátiles y adaptados a
                cualquier materia con la ayuda de nuestra inteligencia
                artificial.
              </p>
              <Link href={"/pricing"}>
                <button className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Comienza a crear exámenes
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Tipos de exámenes que puedes crear
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <FileText className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Preguntas abiertas
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Genera preguntas que fomenten el pensamiento crítico y la
                  expresión escrita.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <CheckSquare className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Opción múltiple</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Crea exámenes con preguntas de selección múltiple para una
                  evaluación rápida y precisa.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <Calculator className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Ejercicios prácticos
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Diseña problemas y casos de estudio para materias como física,
                  matemáticas o ciencias.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Exámenes adaptados a tu estilo
                </h2>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra IA se adapta a tus necesidades específicas. Ya sea que
                  enseñes literatura, ciencias o matemáticas, puedes generar
                  exámenes perfectamente alineados con tu programa de estudios.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span>Personaliza el nivel de dificultad</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span>Ajusta el formato según tus preferencias</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span>Genera variaciones para evitar copias</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Vista previa del examen
                </h3>
                <div className="space-y-4 text-sm">
                  <p className="font-medium">
                    1. Explique el proceso de fotosíntesis en las plantas.
                  </p>
                  <p className="font-medium">
                    2. ¿Cuál de las siguientes NO es una parte de una célula
                    vegetal?
                  </p>
                  <ul className="list-disc list-inside pl-4">
                    <li>Cloroplasto</li>
                    <li>Pared celular</li>
                    <li>Mitocondria</li>
                    <li>Flagelo</li>
                  </ul>
                  <p className="font-medium">
                    3. Calcule la energía liberada en la siguiente reacción
                    química...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Download className="h-16 w-16 text-blue-600" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Exporta fácilmente a PDF
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
                Una vez que hayas generado tu examen perfecto, expórtalo a PDF
                con un solo clic. Listo para imprimir y distribuir a tus
                estudiantes.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Comienza a revolucionar tus evaluaciones hoy
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
              Únete a miles de educadores que ya están transformando su forma de
              evaluar con Deep Penguin.
            </p>
            <button className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg">
              Crea tu primer examen con IA
            </button>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Deep Penguin para Maestros. Todos los derechos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-blue-600" href="#">
            Términos de servicio
          </Link>
          <Link className="text-xs hover:text-blue-600" href="#">
            Privacidad
          </Link>
          <Link className="text-xs hover:text-blue-600" href="#">
            Soporte
          </Link>
        </nav>
      </footer>
    </div>
  );
}
