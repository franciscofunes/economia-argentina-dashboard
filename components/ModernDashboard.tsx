'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

// Register Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

interface EconomicData {
  exchangeRates: {
    oficial: number
    blue: number
    mep: number
    ccl: number
    tarjeta: number
    date: string
    variations?: {
      oficial: number
      blue: number
      mep: number
      ccl: number
      tarjeta: number
    }
  }
  inflation: {
    monthly: number
    annual: number
    accumulated: number
    index_value?: number
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
    variation_pct?: number
    date: string
  }
  laborMarket: {
    unemployment: number
    employment: number
    activity: number
    date: string
  }
  metadata?: {
    source: string
    timestamp: string
    successful_apis: number
    failed_apis: number
    has_api_key?: boolean
    real_data_indicators?: {
      dollar_is_real: boolean
      inflation_is_real: boolean
      emae_is_real: boolean
      riesgo_pais_is_real: boolean
    }
    sources?: {
      dollar: string
      inflation: string
      emae: string
      riesgo_pais: string
    }
  }
}

export default function FixedDashboard() {
  const [data, setData] = useState<EconomicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [historicalData, setHistoricalData] = useState<any>({
    dollarHistory: [],
    inflationHistory: []
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching main data from /api/argentstats...')
      
      // Get main economic data
      const response = await fetch('/api/argentstats', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ Main data received:', result)
      console.log('📊 Metadata:', result.metadata)
      console.log('💰 Exchange rates:', result.exchangeRates)
      console.log('📈 Real data indicators:', result.metadata?.real_data_indicators)
      
      setData(result)
      setLastUpdate(new Date().toLocaleString('es-AR'))

      // Get historical data
      console.log('📈 Fetching historical data...')
      const historicalResponse = await fetch('/api/argentstats/historical?type=all&days=30&months=12', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        }
      })
      
      if (historicalResponse.ok) {
        const historicalResult = await historicalResponse.json()
        console.log('📈 Historical data received:', historicalResult)
        
        setHistoricalData({
          dollarHistory: historicalResult.dollarHistory || [],
          inflationHistory: historicalResult.inflationHistory || []
        })
      } else {
        console.warn('⚠️ Historical data failed, using fallback')
        generateFallbackHistoricalData(result)
      }

    } catch (error) {
      console.error('❌ Error loading data:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      
      // Generate fallback data
      const fallbackData = generateFallbackData()
      setData(fallbackData)
      generateFallbackHistoricalData(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackData = (): EconomicData => {
    return {
      exchangeRates: {
        oficial: 1290,
        blue: 1325,
        mep: 1332,
        ccl: 1331,
        tarjeta: 1742,
        date: new Date().toISOString()
      },
      inflation: {
        monthly: 2.2,
        annual: 84.5,
        accumulated: 15.1,
        date: new Date().toISOString()
      },
      emae: {
        monthly: -0.07,
        annual: 4.98,
        index: 164.58,
        date: new Date().toISOString()
      },
      riesgoPais: {
        value: 850,
        variation: -15,
        date: new Date().toISOString()
      },
      laborMarket: {
        unemployment: 5.2,
        employment: 42.8,
        activity: 45.1,
        date: new Date().toISOString()
      },
      metadata: {
        source: 'Fallback data (API Error)',
        timestamp: new Date().toISOString(),
        successful_apis: 0,
        failed_apis: 5,
        has_api_key: false
      }
    }
  }

  const generateFallbackHistoricalData = (currentData: EconomicData) => {
    // Generate 30 days of dollar data
    const dollarHistory = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const baseOficial = currentData.exchangeRates.oficial
      const baseBlue = currentData.exchangeRates.blue
      const trend = i * 0.5
      const volatilityOficial = (Math.random() - 0.5) * 15
      const volatilityBlue = (Math.random() - 0.5) * 25
      
      dollarHistory.push({
        date: date.toISOString().split('T')[0],
        oficial: Math.round((baseOficial - trend + volatilityOficial) * 100) / 100,
        blue: Math.round((baseBlue - trend * 1.1 + volatilityBlue) * 100) / 100
      })
    }

    // Real inflation data
    const inflationHistory = [
      { month: 'Ene 24', value: 20.6 },
      { month: 'Feb 24', value: 13.2 },
      { month: 'Mar 24', value: 11.0 },
      { month: 'Abr 24', value: 8.8 },
      { month: 'May 24', value: 4.2 },
      { month: 'Jun 24', value: 4.6 },
      { month: 'Jul 24', value: 4.0 },
      { month: 'Ago 24', value: 4.2 },
      { month: 'Sep 24', value: 3.5 },
      { month: 'Oct 24', value: 2.7 },
      { month: 'Nov 24', value: 2.4 },
      { month: 'Dic 24', value: 2.5 }
    ]

    setHistoricalData({
      dollarHistory,
      inflationHistory
    })
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Every 5 minutes
    return () => clearInterval(interval)
  }, [])

  // Chart configurations
  const dollarChartData = {
    labels: historicalData.dollarHistory.map((item: any) => 
      new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    ),
    datasets: [
      {
        label: 'Dólar Oficial',
        data: historicalData.dollarHistory.map((item: any) => item.oficial),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'Dólar Blue',
        data: historicalData.dollarHistory.map((item: any) => item.blue),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      }
    ]
  }

  const inflationChartData = {
    labels: historicalData.inflationHistory.map((item: any) => item.month),
    datasets: [
      {
        label: 'Inflación Mensual (%)',
        data: historicalData.inflationHistory.map((item: any) => item.value),
        backgroundColor: [
          '#EF4444', '#F59E0B', '#EAB308', '#84CC16', 
          '#22C55E', '#10B981', '#06B6D4', '#0EA5E9',
          '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7'
        ],
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFFFFF',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#FFFFFF' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#FFFFFF' }
      }
    }
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue',
    suffix = '',
    subtitle,
    loading = false,
    isRealData = false
  }: {
    title: string
    value: number
    change?: number
    icon: any
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
    suffix?: string
    subtitle?: string
    loading?: boolean
    isRealData?: boolean
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-pink-500',
      yellow: 'from-yellow-500 to-orange-500',
      purple: 'from-purple-500 to-violet-500'
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 group"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-white/70 text-sm font-medium">{title}</h3>
              {isRealData && (
                <div className="ml-2 relative group">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Datos reales de ArgenStats
                  </div>
                </div>
              )}
            </div>
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
              
              {change !== undefined && change !== 0 && (
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
      </motion.div>
    )
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Cargando datos económicos...</p>
          <p className="text-white/60">Conectando con ArgenStats API</p>
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
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🇦🇷 Dashboard Económico
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-white/60 text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                ArgenStats API
              </p>
              {data?.metadata && (
                <div className="flex items-center space-x-2">
                  {data.metadata.has_api_key ? (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">API Key ✓</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Sin API Key</span>
                    </div>
                  )}
                  <div className="text-xs text-white/50">
                    {data.metadata.successful_apis}/{data.metadata.successful_apis + data.metadata.failed_apis} APIs OK
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right text-white/50 text-sm">
              <p>Última actualización</p>
              <p className="font-medium text-white/80">{lastUpdate}</p>
              {error && (
                <p className="text-red-400 text-xs">Error: {error}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </motion.button>
          </div>
        </motion.div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Dólar Oficial"
            value={data?.exchangeRates.oficial || 0}
            change={data?.exchangeRates.variations?.oficial}
            icon={DollarSign}
            color="blue"
            subtitle="BCRA"
            loading={loading}
            isRealData={data?.metadata?.real_data_indicators?.dollar_is_real}
          />
          
          <MetricCard
            title="Dólar Blue"
            value={data?.exchangeRates.blue || 0}
            change={data?.exchangeRates.variations?.blue}
            icon={DollarSign}
            color="red"
            subtitle="Mercado paralelo"
            loading={loading}
            isRealData={data?.metadata?.real_data_indicators?.dollar_is_real}
          />
          
          <MetricCard
            title="Inflación Mensual"
            value={data?.inflation.monthly || 0}
            icon={TrendingUp}
            color="yellow"
            suffix="%"
            subtitle={`Anual: ${(data?.inflation.annual || 0).toFixed(1)}%`}
            loading={loading}
            isRealData={data?.metadata?.real_data_indicators?.inflation_is_real}
          />
          
          <MetricCard
            title="Riesgo País"
            value={data?.riesgoPais.value || 0}
            change={data?.riesgoPais.variation_pct || data?.riesgoPais.variation}
            icon={AlertTriangle}
            color="purple"
            subtitle="EMBI+ Argentina"
            loading={loading}
            isRealData={data?.metadata?.real_data_indicators?.riesgo_pais_is_real}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Dollar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-blue-400" />
              Evolución del Dólar (30 días)
            </h3>
            <div className="h-80">
              {historicalData.dollarHistory.length > 0 ? (
                <Line data={dollarChartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-white/50">Cargando gráfico...</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Inflation Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-yellow-400" />
              Inflación Mensual (INDEC)
            </h3>
            <div className="h-80">
              {historicalData.inflationHistory.length > 0 ? (
                <Bar data={inflationChartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-white/50">Cargando gráfico...</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* EMAE & Labor */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-purple-400" />
              Actividad & Empleo
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-white/70 text-sm">EMAE (Anual)</p>
                  {data?.metadata?.real_data_indicators?.emae_is_real && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <p className="text-2xl font-bold text-white">
                  {(data?.emae.annual || 0).toFixed(1)}%
                </p>
                <p className="text-xs text-white/50">Índice: {(data?.emae.index || 0).toFixed(1)}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-white/70 text-sm">Desempleo</p>
                <p className="text-2xl font-bold text-white">
                  {(data?.laborMarket.unemployment || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-green-400" />
              Cotizaciones USD
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
                    ${formatNumber(rate.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-green-400" />
              Fuentes de Datos
            </h3>
            <div className="space-y-3">
              {data?.metadata?.sources && Object.entries(data.metadata.sources).map(([key, source]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/80 capitalize text-sm">{key}</span>
                  <div className="flex items-center">
                    {source.includes('ArgenStats API') ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {data?.metadata && (
              <div className="mt-4 text-xs text-white/50">
                Actualizado: {new Date(data.metadata.timestamp).toLocaleTimeString('es-AR')}
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-white/50">
          <p>Datos económicos de Argentina • Fuente: ArgenStats API • INDEC oficial</p>
          <p>Dashboard actualizado en tiempo real cada 5 minutos</p>
        </div>
      </div>
    </div>
  )
}
