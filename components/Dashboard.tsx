'use client'

import { DollarSign, TrendingUp, Percent, PiggyBank, RefreshCw, AlertCircle } from 'lucide-react'
import MetricCard from './MetricCard'
import ExchangeRateChart from './ExchangeRateChart'
import InflationChart from './InflationChart'
import BudgetChart from './BudgetChart'
import { useEconomicData } from '@/hooks/useEconomicData'

export default function Dashboard() {
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

  if (loading && !data.exchangeRate.oficial) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Cargando datos económicos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Indicadores Principales</h2>
          <p className="text-gray-600">
            Última actualización: {formatDate(new Date().toISOString())}
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Dólar Oficial"
          value={data.exchangeRate.oficial}
          icon={DollarSign}
          format="currency"
          subtitle={`Actualizado: ${formatDate(data.exchangeRate.date)}`}
          loading={loading}
        />
        
        <MetricCard
          title="Dólar Blue"
          value={data.exchangeRate.blue}
          icon={DollarSign}
          format="currency"
          subtitle="Cotización paralela"
          loading={loading}
        />
        
        <MetricCard
          title="Inflación Mensual"
          value={data.inflation.monthly}
          icon={TrendingUp}
          format="percentage"
          subtitle={`Datos de ${formatDate(data.inflation.date)}`}
          loading={loading}
        />
        
        <MetricCard
          title="Tasa de Interés"
          value={data.interestRate.rate}
          icon={Percent}
          format="percentage"
          subtitle="BCRA - Tasa de referencia"
          loading={loading}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExchangeRateChart />
        <InflationChart />
      </div>

      {/* Gráfico de presupuesto */}
      <BudgetChart />

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PiggyBank className="h-5 w-5 mr-2 text-blue-500" />
            Presupuesto Nacional
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Asignado:</span>
              <span className="font-semibold">
                ${(data.budget.total / 1000000000).toFixed(1)}B
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ejecutado:</span>
              <span className="font-semibold">
                ${(data.budget.executed / 1000000000).toFixed(1)}B
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">% Ejecución:</span>
              <span className="font-semibold text-blue-600">
                {data.budget.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Brecha Cambiaria</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Diferencia:</span>
              <span className="font-semibold">
                ${(data.exchangeRate.blue - data.exchangeRate.oficial).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">% Brecha:</span>
              <span className="font-semibold text-red-600">
                {(((data.exchangeRate.blue - data.exchangeRate.oficial) / data.exchangeRate.oficial) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Fuentes de Datos</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• BCRA - Banco Central</li>
            <li>• Datos.gob.ar - Series de Tiempo</li>
            <li>• Presupuesto Abierto</li>
            <li>• APIs Gubernamentales</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
