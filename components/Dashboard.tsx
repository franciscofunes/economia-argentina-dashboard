'use client'

import { DollarSign, TrendingUp, Percent, PiggyBank, RefreshCw, AlertCircle } from 'lucide-react'
import MetricCard from './MetricCard'
import ExchangeRateChart from './ExchangeRateChart'
import InflationChart from './InflationChart'
import BudgetChart from './BudgetChart'
import LoadingSpinner from './LoadingSpinner'
import { useEconomicData } from '@/hooks/useEconomicData'
import { formatDate } from '@/lib/utils'

export default function Dashboard() {
  const { data, loading, error, refetch } = useEconomicData()

  if (error) {
    return (
      <div className="card text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar los datos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={refetch}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header con información de actualización */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Indicadores Principales</h2>
          <p className="text-gray-600">
            Última actualización: {formatDate(new Date().toISOString())}
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
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
        <div className="animate-slide-up">
          <ExchangeRateChart />
        </div>
        <div className="animate-slide-up">
          <InflationChart />
        </div>
      </div>

      {/* Gráfico de presupuesto */}
      <div className="animate-slide-up">
        <BudgetChart />
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PiggyBank className="h-5 w-5 mr-2 text-primary-500" />
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
              <span className="font-semibold text-primary-600">
                {data.budget.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
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

        <div className="card">
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
