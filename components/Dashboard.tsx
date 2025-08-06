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
  Zap,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight
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

export default function Dashboard() {
  const [data, setData] = useState<EconomicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/argenstats', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const result = await response.json()
      setData(result)
      setLastUpdate(new Date().toLocaleString('es-AR'))
      
      console.log('📊 Dashboard - Datos recibidos:', result)
    } catch (error) {
      console.error('❌ Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-pink-500',
      yellow: 'from-yellow-500 to-orange-500',
      purple: 'from-purple-500 to-violet-500'
    }

    return (
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 group">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/70 text-sm font-medium">{title}</h3>
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
            </div>
          ) : (
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
                  change >= 0 ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
              
              {subtitle && (
                <p className="text-xs text-white/50">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🇦🇷 Dashboard
            </h1>
            <p className="text-white/60 text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Datos en vivo • ArgenStats API
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right text-white/50 text-sm">
              <p>Última actualización</p>
              <p className="font-medium text-white/80">{lastUpdate}</p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Dólar Oficial"
            value={data?.exchangeRates.oficial || 0}
            icon={DollarSign}
            color="blue"
            subtitle="BCRA"
            loading={loading}
          />
          
          <MetricCard
            title="Dólar Blue"
            value={data?.exchangeRates.blue || 0}
            icon={DollarSign}
            color="red"
            subtitle="Mercado paralelo"
            loading={loading}
          />
          
          <MetricCard
            title="Inflación Mensual"
            value={data?.inflation.monthly || 0}
            icon={TrendingUp}
            color="yellow"
            suffix="%"
            subtitle="IPC INDEC"
            loading={loading}
          />
          
          <MetricCard
            title="Riesgo País"
            value={data?.riesgoPais.value || 0}
            change={data?.riesgoPais.variation}
            icon={AlertTriangle}
            color="purple"
            subtitle="EMBI+ Argentina"
            loading={loading}
          />
        </div>

        {/* Additional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exchange Rates */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-green-400" />
              Todas las Cotizaciones
            </h3>
            <div className="space-y-3">
              {[
                { name: 'MEP', value: data?.exchangeRates.mep || 0, color: 'bg-blue-500' },
                { name: 'CCL', value: data?.exchangeRates.ccl || 0, color: 'bg-purple-500' },
                { name: 'Tarjeta', value: data?.exchangeRates.tarjeta || 0, color: 'bg-yellow-500' }
              ].map((rate) => (
                <div key={rate.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
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
          </div>

          {/* EMAE & Labor */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-purple-400" />
              EMAE & Empleo
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-white/70 text-sm">Actividad Económica</p>
                <p className="text-2xl font-bold text-white">
                  {data?.emae.annual.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-white/70 text-sm">Desempleo</p>
                <p className="text-2xl font-bold text-white">
                  {data?.laborMarket.unemployment.toFixed(1) || '0.0'}%
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
