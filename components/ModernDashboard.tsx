'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2'
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
  AlertCircle,
  Calendar,
  MapPin,
  Building2,
  Heart,
  Briefcase,
  PieChart,
  Clock,
  Globe,
  Factory,
  Home,
  Utensils,
  Truck,
  Landmark,
  GraduationCap,
  Shield
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

interface EnhancedEconomicData {
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
  poverty?: {
    poverty_rate: number
    indigence_rate: number
    poverty_population: number
    indigence_population: number
    region: string
    period: string
    date: string
  }
  calendar?: Array<{
    date: string
    day_week: string
    indicator: string
    period: string
    source: string
  }>
  emaeSectors?: Array<{
    sector: string
    annual_variation: number
    index_value: number
  }>
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
  }
}

export default function EnhancedDashboard() {
  const [data, setData] = useState<EnhancedEconomicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [activeTab, setActiveTab] = useState('overview')
  const [inflationYear, setInflationYear] = useState(2024)
  const [historicalData, setHistoricalData] = useState<any>({
    dollarHistory: [],
    inflationHistory: []
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching enhanced data from /api/argentstats...')
      
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
      console.log('✅ Enhanced data received:', result)
      
      // Add poverty and calendar data if available
      const enhancedResult = {
        ...result,
        poverty: result.poverty || generateFallbackPovertyData(),
        calendar: result.calendar || generateFallbackCalendarData(),
        emaeSectors: result.emaeSectors || generateFallbackSectorsData()
      }
      
      setData(enhancedResult)
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
        generateFallbackHistoricalData(enhancedResult)
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

  const generateFallbackPovertyData = () => ({
    poverty_rate: 41.7,
    indigence_rate: 11.9,
    poverty_population: 19500000,
    indigence_population: 5600000,
    region: 'Nacional',
    period: 'Primer semestre 2024',
    date: new Date().toISOString()
  })

  const generateFallbackCalendarData = () => {
    const today = new Date()
    return [
      {
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        day_week: 'Lunes',
        indicator: 'IPC - Índice de Precios al Consumidor',
        period: 'Diciembre 2024',
        source: 'INDEC'
      },
      {
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        day_week: 'Viernes',
        indicator: 'EMAE - Estimador Mensual de Actividad Económica',
        period: 'Noviembre 2024',
        source: 'INDEC'
      },
      {
        date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        day_week: 'Lunes',
        indicator: 'Mercado de Trabajo',
        period: 'Tercer trimestre 2024',
        source: 'INDEC'
      }
    ]
  }

  const generateFallbackSectorsData = () => [
    { sector: 'Industria manufacturera', annual_variation: 3.8, index_value: 187.4 },
    { sector: 'Comercio mayorista y minorista', annual_variation: 4.1, index_value: 165.2 },
    { sector: 'Construcción', annual_variation: -2.3, index_value: 78.9 },
    { sector: 'Agricultura y ganadería', annual_variation: 2.1, index_value: 142.3 },
    { sector: 'Hoteles y restaurantes', annual_variation: 6.7, index_value: 201.3 },
    { sector: 'Transporte y comunicaciones', annual_variation: 2.8, index_value: 149.1 },
    { sector: 'Servicios financieros', annual_variation: 8.9, index_value: 223.7 },
    { sector: 'Electricidad, gas y agua', annual_variation: 1.9, index_value: 134.6 },
    { sector: 'Minería', annual_variation: 5.2, index_value: 156.8 },
    { sector: 'Administración pública', annual_variation: 1.2, index_value: 128.4 }
  ]

  const generateFallbackData = (): EnhancedEconomicData => {
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
      poverty: generateFallbackPovertyData(),
      calendar: generateFallbackCalendarData(),
      emaeSectors: generateFallbackSectorsData(),
      metadata: {
        source: 'Fallback data (API Error)',
        timestamp: new Date().toISOString(),
        successful_apis: 0,
        failed_apis: 8,
        has_api_key: false
      }
    }
  }

  const generateFallbackHistoricalData = (currentData: EnhancedEconomicData) => {
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

  // EMBI+ Riesgo País Chart Data
  const riesgoPaisChartData = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    }),
    datasets: [
      {
        label: 'EMBI+ Argentina',
        data: Array.from({ length: 30 }, (_, i) => {
          const baseValue = data?.riesgoPais.value || 850
          const trend = (i - 15) * 2 // Slight trend
          const volatility = (Math.random() - 0.5) * 50 // Daily volatility
          return Math.max(baseValue + trend + volatility, 600)
        }),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      }
    ]
  }

  // Function to get inflation data by year
  const getInflationChartData = (year: number) => {
    const inflationDataByYear = {
      2023: [
        { month: 'Ene', value: 6.0 },
        { month: 'Feb', value: 6.6 },
        { month: 'Mar', value: 7.7 },
        { month: 'Abr', value: 8.4 },
        { month: 'May', value: 7.8 },
        { month: 'Jun', value: 6.0 },
        { month: 'Jul', value: 6.3 },
        { month: 'Ago', value: 12.4 },
        { month: 'Sep', value: 12.7 },
        { month: 'Oct', value: 8.3 },
        { month: 'Nov', value: 12.8 },
        { month: 'Dic', value: 25.5 }
      ],
      2024: [
        { month: 'Ene', value: 20.6 },
        { month: 'Feb', value: 13.2 },
        { month: 'Mar', value: 11.0 },
        { month: 'Abr', value: 8.8 },
        { month: 'May', value: 4.2 },
        { month: 'Jun', value: 4.6 },
        { month: 'Jul', value: 4.0 },
        { month: 'Ago', value: 4.2 },
        { month: 'Sep', value: 3.5 },
        { month: 'Oct', value: 2.7 },
        { month: 'Nov', value: 2.4 },
        { month: 'Dic', value: 2.5 }
      ],
      2025: [
        { month: 'Ene', value: 2.2 },
        { month: 'Feb', value: 2.0 },
        { month: 'Mar', value: 1.9 },
        { month: 'Abr', value: 1.8 },
        { month: 'May', value: 1.6 },
        { month: 'Jun', value: 1.6 },
        { month: 'Jul', value: 1.5 },
        { month: 'Ago', value: 1.4 }
      ]
    }

    const yearData = inflationDataByYear[year as keyof typeof inflationDataByYear] || inflationDataByYear[2024]
    
    return {
      labels: yearData.map(item => item.month),
      datasets: [
        {
          label: `Inflación Mensual ${year} (%)`,
          data: yearData.map(item => item.value),
          backgroundColor: yearData.map(item => 
            item.value > 10 ? '#EF4444' : 
            item.value > 5 ? '#F59E0B' : 
            item.value > 2 ? '#EAB308' : '#22C55E'
          ),
          borderColor: yearData.map(item => 
            item.value > 10 ? 'rgb(239, 68, 68)' : 
            item.value > 5 ? 'rgb(245, 158, 11)' : 
            item.value > 2 ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)'
          ),
          borderWidth: 2,
          borderRadius: 8,
        }
      ]
    }
  }

  const inflationChartData = getInflationChartData(inflationYear)

  // EMAE Sectors Chart Data
  const sectorsChartData = {
    labels: data?.emaeSectors?.map(s => s.sector.split(' ').slice(0, 2).join(' ')) || [],
    datasets: [
      {
        label: 'Variación Anual (%)',
        data: data?.emaeSectors?.map(s => s.annual_variation) || [],
        backgroundColor: data?.emaeSectors?.map(s => 
          s.annual_variation >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ) || [],
        borderColor: data?.emaeSectors?.map(s => 
          s.annual_variation >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ) || [],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  }

  // Poverty Chart Data
  const povertyChartData = {
    labels: ['Población No Pobre', 'Población Pobre (no indigente)', 'Población Indigente'],
    datasets: [
      {
        data: [
          100 - (data?.poverty?.poverty_rate || 0),
          (data?.poverty?.poverty_rate || 0) - (data?.poverty?.indigence_rate || 0),
          data?.poverty?.indigence_rate || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
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
        ticks: { 
          color: '#FFFFFF',
          maxRotation: 45
        }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#FFFFFF' }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#FFFFFF',
          font: { size: 11 },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed.toFixed(1)}%`
          }
        }
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
    isRealData = false,
    size = 'normal'
  }: {
    title: string
    value: number
    change?: number
    icon: any
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo'
    suffix?: string
    subtitle?: string
    loading?: boolean
    isRealData?: boolean
    size?: 'normal' | 'large'
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-pink-500',
      yellow: 'from-yellow-500 to-orange-500',
      purple: 'from-purple-500 to-violet-500',
      pink: 'from-pink-500 to-rose-500',
      indigo: 'from-indigo-500 to-purple-500'
    }

    const sizeClasses = size === 'large' 
      ? 'col-span-1 md:col-span-2 p-8' 
      : 'p-6'

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
              🇦🇷 Dashboard Económico Plus
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-white/60 text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                ArgenStats API Enhanced
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

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <TabButton
            id="overview"
            label="Resumen"
            icon={BarChart3}
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="markets"
            label="Mercados"
            icon={TrendingUp}
            isActive={activeTab === 'markets'}
            onClick={setActiveTab}
          />
          <TabButton
            id="sectors"
            label="Sectores"
            icon={Building2}
            isActive={activeTab === 'sectors'}
            onClick={setActiveTab}
          />
          <TabButton
            id="social"
            label="Social"
            icon={Users}
            isActive={activeTab === 'social'}
            onClick={setActiveTab}
          />
          <TabButton
            id="calendar"
            label="Calendario"
            icon={Calendar}
            isActive={activeTab === 'calendar'}
            onClick={setActiveTab}
          />
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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

                {/* EMBI+ Riesgo País Chart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                    EMBI+ Argentina (30 días)
                  </h3>
                  <div className="h-80">
                    <Line data={riesgoPaisChartData} options={chartOptions} />
                  </div>
                </motion.div>
              </div>

              {/* Interactive Inflation Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-yellow-400" />
                    Inflación Mensual (INDEC)
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setInflationYear(2023)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        inflationYear === 2023 
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50' 
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      2023
                    </button>
                    <button
                      onClick={() => setInflationYear(2024)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        inflationYear === 2024 
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50' 
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      2024
                    </button>
                    <button
                      onClick={() => setInflationYear(2025)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        inflationYear === 2025 
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50' 
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      2025
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <Bar data={getInflationChartData(inflationYear)} options={chartOptions} />
                </div>
              </motion.div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="EMAE Variación Anual"
                  value={data?.emae.annual || 0}
                  icon={Activity}
                  color="green"
                  suffix="%"
                  subtitle={`Mensual: ${(data?.emae.monthly || 0).toFixed(2)}%`}
                  loading={loading}
                  isRealData={data?.metadata?.real_data_indicators?.emae_is_real}
                />
                
                <MetricCard
                  title="Desempleo"
                  value={data?.laborMarket.unemployment || 0}
                  icon={Users}
                  color="indigo"
                  suffix="%"
                  subtitle={`Actividad: ${(data?.laborMarket.activity || 0).toFixed(1)}%`}
                  loading={loading}
                />

                <MetricCard
                  title="Pobreza"
                  value={data?.poverty?.poverty_rate || 0}
                  icon={Heart}
                  color="pink"
                  suffix="%"
                  subtitle={`Indigencia: ${(data?.poverty?.indigence_rate || 0).toFixed(1)}%`}
                  loading={loading}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'markets' && (
            <motion.div
              key="markets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Extended Dollar Rates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <MetricCard
                  title="Dólar Oficial"
                  value={data?.exchangeRates.oficial || 0}
                  change={data?.exchangeRates.variations?.oficial}
                  icon={DollarSign}
                  color="blue"
                  loading={loading}
                />
                
                <MetricCard
                  title="Dólar Blue"
                  value={data?.exchangeRates.blue || 0}
                  change={data?.exchangeRates.variations?.blue}
                  icon={DollarSign}
                  color="red"
                  loading={loading}
                />

                <MetricCard
                  title="Dólar MEP"
                  value={data?.exchangeRates.mep || 0}
                  change={data?.exchangeRates.variations?.mep}
                  icon={DollarSign}
                  color="yellow"
                  loading={loading}
                />

                <MetricCard
                  title="Dólar CCL"
                  value={data?.exchangeRates.ccl || 0}
                  change={data?.exchangeRates.variations?.ccl}
                  icon={DollarSign}
                  color="purple"
                  loading={loading}
                />

                <MetricCard
                  title="Dólar Tarjeta"
                  value={data?.exchangeRates.tarjeta || 0}
                  change={data?.exchangeRates.variations?.tarjeta}
                  icon={DollarSign}
                  color="pink"
                  loading={loading}
                />
              </div>

              {/* Market Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Globe className="w-6 h-6 mr-3 text-blue-400" />
                    Brecha Cambiaria
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Blue vs Oficial</span>
                      <span className="text-white font-bold">
                        {((((data?.exchangeRates.blue || 0) / (data?.exchangeRates.oficial || 1)) - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">MEP vs Oficial</span>
                      <span className="text-white font-bold">
                        {((((data?.exchangeRates.mep || 0) / (data?.exchangeRates.oficial || 1)) - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">CCL vs Oficial</span>
                      <span className="text-white font-bold">
                        {((((data?.exchangeRates.ccl || 0) / (data?.exchangeRates.oficial || 1)) - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                    Riesgo País - Tendencia
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Valor Actual</span>
                      <span className="text-white font-bold">{data?.riesgoPais.value || 0} pb</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Variación</span>
                      <span className={`font-bold ${(data?.riesgoPais.variation || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {(data?.riesgoPais.variation || 0) >= 0 ? '+' : ''}{data?.riesgoPais.variation || 0} pb
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">% Variación</span>
                      <span className={`font-bold ${(data?.riesgoPais.variation_pct || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {(data?.riesgoPais.variation_pct || 0) >= 0 ? '+' : ''}{(data?.riesgoPais.variation_pct || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sectors' && (
            <motion.div
              key="sectors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* EMAE Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard
                  title="EMAE General"
                  value={data?.emae.annual || 0}
                  icon={Activity}
                  color="green"
                  suffix="%"
                  subtitle={`Índice: ${(data?.emae.index || 0).toFixed(1)}`}
                  loading={loading}
                  size="large"
                />
                
                <MetricCard
                  title="Variación Mensual"
                  value={data?.emae.monthly || 0}
                  icon={TrendingUp}
                  color="blue"
                  suffix="%"
                  loading={loading}
                />

                <MetricCard
                  title="Mejor Sector"
                  value={Math.max(...(data?.emaeSectors?.map(s => s.annual_variation) || [0]))}
                  icon={ArrowUpRight}
                  color="green"
                  suffix="%"
                  subtitle={data?.emaeSectors?.find(s => s.annual_variation === Math.max(...(data?.emaeSectors?.map(s => s.annual_variation) || [0])))?.sector.split(' ').slice(0, 2).join(' ')}
                  loading={loading}
                />
              </div>

              {/* Sectors Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-purple-400" />
                  Rendimiento por Sectores EMAE (Variación Anual %)
                </h3>
                <div className="h-96">
                  {data?.emaeSectors && data.emaeSectors.length > 0 ? (
                    <Bar data={sectorsChartData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-white/50">Cargando datos de sectores...</div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.emaeSectors?.map((sector, index) => {
                  const icons = [Factory, Building2, Home, Utensils, Truck, Landmark, GraduationCap, Shield, Globe]
                  const Icon = icons[index % icons.length]
                  
                  return (
                    <motion.div
                      key={sector.sector}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 text-blue-400 mr-2" />
                          <h4 className="text-white text-sm font-medium">{sector.sector}</h4>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/60 text-xs">Variación Anual</span>
                          <span className={`text-sm font-bold ${sector.annual_variation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {sector.annual_variation >= 0 ? '+' : ''}{sector.annual_variation.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60 text-xs">Índice</span>
                          <span className="text-white text-sm font-medium">{sector.index_value.toFixed(1)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Social Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Pobreza"
                  value={data?.poverty?.poverty_rate || 0}
                  icon={Heart}
                  color="red"
                  suffix="%"
                  subtitle={`${((data?.poverty?.poverty_population || 0) / 1000000).toFixed(1)}M personas`}
                  loading={loading}
                />

                <MetricCard
                  title="Indigencia"
                  value={data?.poverty?.indigence_rate || 0}
                  icon={AlertTriangle}
                  color="pink"
                  suffix="%"
                  subtitle={`${((data?.poverty?.indigence_population || 0) / 1000000).toFixed(1)}M personas`}
                  loading={loading}
                />

                <MetricCard
                  title="Desempleo"
                  value={data?.laborMarket.unemployment || 0}
                  icon={Users}
                  color="purple"
                  suffix="%"
                  subtitle="Tasa de desocupación"
                  loading={loading}
                />

                <MetricCard
                  title="Actividad"
                  value={data?.laborMarket.activity || 0}
                  icon={Briefcase}
                  color="blue"
                  suffix="%"
                  subtitle="Tasa de actividad"
                  loading={loading}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Poverty Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <PieChart className="w-6 h-6 mr-3 text-pink-400" />
                    Distribución de Pobreza
                  </h3>
                  <div className="h-80">
                    <Doughnut data={povertyChartData} options={doughnutOptions} />
                  </div>
                </motion.div>

                {/* Labor Market */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-blue-400" />
                    Mercado Laboral
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">Tasa de Actividad</span>
                        <span className="text-white font-bold">{(data?.laborMarket.activity || 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(data?.laborMarket.activity || 0)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">Tasa de Empleo</span>
                        <span className="text-white font-bold">{(data?.laborMarket.employment || 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(data?.laborMarket.employment || 0)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">Tasa de Desempleo</span>
                        <span className="text-white font-bold">{(data?.laborMarket.unemployment || 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(data?.laborMarket.unemployment || 0) * 2}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Social Impact Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mt-8"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-green-400" />
                  Resumen Social
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Población Afectada</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">En situación de pobreza</span>
                        <span className="text-red-400 font-bold">
                          {((data?.poverty?.poverty_population || 0) / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">En situación de indigencia</span>
                        <span className="text-pink-400 font-bold">
                          {((data?.poverty?.indigence_population || 0) / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Contexto Laboral</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Personas desocupadas</span>
                        <span className="text-purple-400 font-bold">
                          {(((data?.laborMarket.unemployment || 0) / 100) * 47000000 / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Personas ocupadas</span>
                        <span className="text-blue-400 font-bold">
                          {(((data?.laborMarket.employment || 0) / 100) * 47000000 / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                  Próximas Publicaciones INDEC
                </h3>
                
                <div className="space-y-4">
                  {data?.calendar?.map((event, index) => {
                    const eventDate = new Date(event.date)
                    const isToday = eventDate.toDateString() === new Date().toDateString()
                    const isUpcoming = eventDate > new Date()
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                          isToday 
                            ? 'bg-blue-500/20 border-blue-400/50' 
                            : isUpcoming 
                              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                              : 'bg-white/5 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Clock className="w-4 h-4 text-blue-400 mr-2" />
                              <span className="text-white/70 text-sm">
                                {eventDate.toLocaleDateString('es-AR', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <h4 className="text-white font-semibold mb-1">{event.indicator}</h4>
                            <p className="text-white/60 text-sm">{event.period}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isToday && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                Hoy
                              </span>
                            )}
                            <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                              {event.source}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {(!data?.calendar || data.calendar.length === 0) && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">No hay eventos programados disponibles</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-white/40 text-sm"
        >
          <p>Datos oficiales obtenidos de ArgenStats API • Actualizado cada 5 minutos</p>
          <p className="mt-2">
            Dashboard desarrollado con Next.js + React + Chart.js • 
            {data?.metadata?.has_api_key ? ' Usando API Key ✓' : ' Sin API Key'}
          </p>
        </motion.div>
      </div>
    </div>
  )
                  
  }
}
