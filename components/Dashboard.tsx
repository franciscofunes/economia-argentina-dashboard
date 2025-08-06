'use client'

import { DollarSign, TrendingUp, Percent, PiggyBank, RefreshCw, AlertCircle } from 'lucide-react'
import { useEconomicData } from '@/hooks/useEconomicData'

// Importar el dashboard moderno
import SuperModernDashboard from './SuperModernDashboard'

export default function Dashboard() {
  // Por compatibilidad, mantener este componente pero usar el moderno
  return <SuperModernDashboard />
  
  // El código viejo comentado para referencia:
  /*
  const { data, loading, error, refetch } = useEconomicData()

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar los datos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={refetch}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </button>
      </div>
    )
  }

  if (loading && !data.exchangeRates.oficial) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Cargando datos económicos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Actualizado
        </h2>
        <p className="text-gray-600">
          Este componente ahora usa el SuperModernDashboard
        </p>
      </div>
    </div>
  )
  */
}
