'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  BarChart3, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Users,
  Target
} from 'lucide-react'

interface EconomicData {
  exchangeRates: {
    oficial: number
    blue: number
    mep: number
    ccl: number
    tarjeta: number
    date: string
  }
  inflation: {
    monthly: number
    annual: number
    accumulated: number
    date: string
  }
  emae: {
    monthly: number
    annual: number
    index: number
    date: string
  }
  riesgoPais: {
    value: number
    variation: number
    date: string
  }
  laborMarket: {
    unemployment: number
    employment: number
    activity: number
    date: string
  }
}

export default function ModernDashboard() {
  const [data, setData] = useState<EconomicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/argenstats')
      const result = await response.json()
      setData(result)
      setLastUpdate(new Date().toLocaleString('es-AR'))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue',
    suffix = '',
    subtitle,
    loading = false 
  }: {
    title: string
    value: number
    change?: number
    icon: any
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
    suffix?: string
    subtitle?: string
    loading?: boolean
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600'
    }

    if (loading) {
      return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-20 h-4 bg-white/20 rounded"></div>
            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
          </div>
          <div className="w-24 h-8 bg-white/20 rounded mb-2"></div>
          <div className="w-16 h-3 bg-white/20 rounded"></div>
        </div>
      )
    }

    return (
      <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/80 text-sm font-medium">{title}</h3>
          <div className={`p-2 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold text-white">
            {value.toLocaleString('es-AR', { 
              minimumFractionDigits: suffix === '%' ? 1 : 2,
              maximumFractionDigits: suffix === '%' ? 1 : 2
            })}
            {suffix}
          </p>
          
          {change !== undefined && (
            <div className={`flex items-center text-sm ${
              change >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
          
          {subtitle && (
            <p className="text-xs text-white/60">{subtitle}</p>
          )}
        </div>
      </div>
    )
  }

  const ExchangeRatesCard = () => {
    if (!data) return null

    const rates = [
      { name: 'Oficial', value: data.exchangeRates.oficial, color: 'bg-blue-500' },
      { name: 'Blue', value: data.exchangeRates.blue, color: 'bg-red-500' },
      { name: 'MEP', value: data.exchangeRates.mep, color: 'bg-green-500' },
      { name: 'CCL', value: data.exchangeRates.ccl, color: 'bg-purple-500' },
      { name: 'Tarjeta', value: data.exchangeRates.tarjeta, color: 'bg-yellow-500' }
    ]

    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-green-400" />
          Cotizaciones del Dólar
        </h3>
        
        <div className="space-y-4">
          {rates.map((rate, index) => (
            <div key={rate.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${rate.color} mr-3`}></div>
                <span className="text-white/80">{rate.name}</span>
              </div>
              <span className="text-white font-semibold">
                ${rate.value.toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Brecha Blue/Oficial:</span>
            <span className="text-red-300 font-semibold">
              {(((data.exchangeRates.blue - data.exchangeRates.oficial) / data.exchangeRates.oficial) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🇦🇷 Dashboard Económico
          </h1>
          <p className="text-white/70 text-lg">
            Indicadores oficiales de Argentina • Powered by ArgenStats
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right text-white/60 text-sm">
            <p>Última actualización:</p>
            <p className="font-medium">{lastUpdate}</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Inflación Mensual"
          value={data?.inflation.monthly || 0}
          icon={TrendingUp}
          color="red"
          suffix="%"
          subtitle="Índice de Precios al Consumidor"
          loading={loading}
        />
        
        <MetricCard
          title="EMAE Mensual"
          value={data?.emae.monthly || 0}
          change={data?.emae.annual}
          icon={Activity}
          color="blue"
          suffix="%"
          subtitle="Estimador Mensual Act. Económica"
          loading={loading}
        />
        
        <MetricCard
          title="Riesgo País"
          value={data?.riesgoPais.value || 0}
          change={data?.riesgoPais.variation}
          icon={AlertTriangle}
          color="yellow"
          subtitle="EMBI+ Argentina"
          loading={loading}
        />
        
        <MetricCard
          title="Desempleo"
          value={data?.laborMarket.unemployment || 0}
          icon={Users}
          color="purple"
          suffix="%"
          subtitle="Tasa de Desocupación"
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Inflación Anual"
          value={data?.inflation.annual || 0}
          icon={BarChart3}
          color="red"
          suffix="%"
          subtitle="Variación interanual IPC"
          loading={loading}
        />
        
        <MetricCard
          title="Actividad Económica"
          value={data?.emae.index || 0}
          icon={Target}
          color="green"
          subtitle="Índice EMAE base 2004=100"
          loading={loading}
        />
        
        <MetricCard
          title="Tasa de Empleo"
          value={data?.laborMarket.employment || 0}
          icon={TrendingUp}
          color="blue"
          suffix="%"
          subtitle="Población ocupada"
          loading={loading}
        />
      </div>

      {/* Exchange Rates Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExchangeRatesCard />
        </div>
        
        {/* Additional Info */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-400" />
            Información
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/80 text-sm mb-2">Fuente de Datos</p>
              <p className="text-white font-semibold">ArgenStats API</p>
              <p className="text-white/60 text-xs">Datos oficiales del INDEC</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/80 text-sm mb-2">Actualización</p>
              <p className="text-white font-semibold">Automática</p>
              <p className="text-white/60 text-xs">Cada 5 minutos</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/80 text-sm mb-2">Cobertura</p>
              <p className="text-white font-semibold">Nacional</p>
              <p className="text-white/60 text-xs">República Argentina</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-white/60 text-sm">
          Dashboard creado con datos oficiales • 
          <span className="text-white/80 ml-1">ArgenStats API</span>
        </p>
      </div>
    </div>
  )
}
