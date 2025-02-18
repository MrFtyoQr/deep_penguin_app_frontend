import { Check } from "lucide-react"

export const PersonalPricing = (props: any) => {
    const price = props.price;
    return (
        <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-4">Maestro Perpetuo</h3>
            <div className="text-center mb-4">
                <span className="text-4xl font-bold">${price}</span> / mes
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Acceso ilimitado a todos los temas
                </li>
                <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Generación de exámenes personalizados
                </li>
                <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Práctica ilimitada de preguntas
                </li>
                <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Seguimiento de progreso personal
                </li>
            </ul>
            <button className="w-full px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Comienza tu viaje infinito
            </button>
        </div>
    )
}