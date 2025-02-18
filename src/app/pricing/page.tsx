import Link from "next/link"
import { BookOpen, Check, HelpCircle } from "lucide-react"
import { PersonalPricing } from "../components/pricing/personal-pricing"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href={"/"}>
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-xl">Deep Penguin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600" href="/">
            Inicio
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-center mb-8">
              Invierte en tu futuro educativo
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 text-center mb-12">
              Elige el plan que mejor se adapte a tu viaje de aprendizaje. Sin límites, sin restricciones, solo
              conocimiento ilimitado.
            </p>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
              <PersonalPricing price={9.99} />
              <div className="flex flex-col p-6 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-lg border-2 border-blue-500">
                <h3 className="text-2xl font-bold text-center mb-4">Academia Ilimitada</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">$199</span> / mes
                </div>
                <ul className="space-y-2 mb-6 flex-grow">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Todo lo incluido en Maestro Perpetuo
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Hasta 200 cuentas de maestros
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Panel de administración para educadores
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Soporte prioritario 24/7
                  </li>
                </ul>
                <button className="w-full px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Potencia tu institución
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                  ¿Puedo cambiar de plan?
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Sí, puedes actualizar o cambiar tu plan en cualquier momento sin penalizaciones.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                  ¿Hay un límite de preguntas?
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No, todos nuestros planes ofrecen generación ilimitada de preguntas y exámenes.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                  ¿Ofrecen reembolsos?
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Sí, ofrecemos una garantía de devolución de dinero de 30 días si no estás satisfecho.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-900">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              ¿Listo para revolucionar tu aprendizaje?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl mb-8">
              Únete a nuestra comunidad de aprendices perpetuos y descubre el poder del conocimiento ilimitado.
            </p>
            <button className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg">
              Comienza tu prueba gratuita de 7 días
            </button>
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
          <Link className="text-xs hover:text-blue-600" href="#">
            Contacto
          </Link>
        </nav>
      </footer>
    </div>
  )
}

