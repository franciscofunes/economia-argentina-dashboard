import { NextRequest, NextResponse } from 'next/server'
import { getAllMainIndicators } from '@/lib/argenstats'

// Enhanced TypeScript interfaces
interface DollarData {
  oficial?: number
  blue?: number
  mep?: number
  ccl?: number
  tarjeta?: number
  date?: string
  oficial_variation?: number
  blue_variation?: number
  mep_variation?: number
  ccl_variation?: number
  tarjeta_variation?: number
}

interface InflationData {
  monthly_variation?: number
  annual_variation?: number
  accumulated_variation?: number
  index_value?: number
  category?: string
  region?: string
  date?: string
}

interface EmaeData {
  monthly_variation?: number
  annual_variation?: number
  index_value?: number
  seasonally_adjusted?: number
  trend_cycle?: number
  sector?: string
  date?: string
}

interface RiesgoPaisData {
  value?: number
  variation?: number
  variation_pct?: number
  monthly_change?: number
  yearly_change?: number
  date?: string
}

interface LaborData {
  unemployment_rate?: number
  employment_rate?: number
  activity_rate?: number
  unemployment_change?: number
  employment_change?: number
  activity_change?: number
  data_type?: string
  date?: string
}

interface PovertyData {
  poverty_rate?: number
  indigence_rate?: number
  poverty_population?: number
  indigence_population?: number
  region?: string
  period?: string
  date?: string
}

interface CalendarEvent {
  date: string
  day_week: string
  indicator: string
  period: string
  source: string
}

interface SectorData {
  sector: string
  annual_variation: number
  index_value: number
}

export async function GET(request: NextRequest) {
  console.log('📊 Enhanced ArgenStats API Route - Starting with full API support...')
  
  try {
    // Check if API key is available
    if (process.env.ARGENSTATS_API_KEY) {
      console.log('🔑 API key found, fetching real data from ArgenStats')
    } else {
      console.log('⚠️ No API key found, using fallback data')
    }

    // Get all indicators using our enhanced library
    const allData = await getAllMainIndicators()
    
    console.log('📊 All enhanced data received:', {
      dollar: !!allData.dollar,
      inflation: !!allData.inflation,
      emae: !!allData.emae,
      riesgoPais: !!allData.riesgoPais,
      laborMarket: !!allData.laborMarket,
      poverty: !!allData.poverty,
      calendar: !!allData.calendar,
      emaeSectors: !!allData.emaeSectors,
      successful: allData.metadata.successful_calls,
      failed: allData.metadata.failed_calls,
      has_api_key: allData.metadata.has_api_key
    })

    // Extract data with explicit types and safe property access
    const dollarData: DollarData = processDollarData(allData.dollar)
    const ipcData: InflationData = (allData.inflation?.data?.[0] as InflationData) || {}
    const emaeData: EmaeData = (allData.emae?.data?.[0] as EmaeData) || {}
    const riesgoPaisData: RiesgoPaisData = (allData.riesgoPais?.data?.[0] as RiesgoPaisData) || {}
    const laborData: LaborData = (allData.laborMarket?.data?.[0] as LaborData) || {}
    const povertyData: PovertyData = (allData.poverty?.data?.[0] as PovertyData) || {}
    const calendarData: CalendarEvent[] = (allData.calendar?.data as CalendarEvent[]) || []
    const sectorsData: SectorData[] = (allData.emaeSectors?.data as SectorData[]) || []

    console.log('💰 Enhanced Dollar Data processed:', { 
      oficial: dollarData.oficial, 
      blue: dollarData.blue,
      mep: dollarData.mep,
      ccl: dollarData.ccl,
      tarjeta: dollarData.tarjeta,
      source: allData.dollar?.metadata?.source,
      hasRealData: !!dollarData.oficial && dollarData.oficial !== 1015.5
    })
    
    console.log('📈 Enhanced IPC Data processed:', { 
      monthly: ipcData.monthly_variation, 
      annual: ipcData.annual_variation,
      source: allData.inflation?.metadata?.source,
      hasRealData: !!ipcData.monthly_variation && ipcData.monthly_variation !== 2.5
    })

    console.log('👥 Poverty Data processed:', {
      poverty_rate: povertyData.poverty_rate,
      indigence_rate: povertyData.indigence_rate,
      source: allData.poverty?.metadata?.source
    })

    console.log('📅 Calendar Data processed:', {
      events_count: calendarData.length,
      source: allData.calendar?.metadata?.source
    })

    console.log('🏭 Sectors Data processed:', {
      sectors_count: sectorsData.length,
      source: allData.emaeSectors?.metadata?.source
    })

    // Build enhanced structured response
    const response = {
      exchangeRates: {
        oficial: dollarData.oficial || 1290,
        blue: dollarData.blue || 1325,
        mep: dollarData.mep || 1332,
        ccl: dollarData.ccl || 1331,
        tarjeta: dollarData.tarjeta || 1742,
        date: dollarData.date || new Date().toISOString(),
        variations: {
          oficial: dollarData.oficial_variation || 0,
          blue: dollarData.blue_variation || 0,
          mep: dollarData.mep_variation || 0,
          ccl: dollarData.ccl_variation || 0,
          tarjeta: dollarData.tarjeta_variation || 0
        }
      },
      inflation: {
        monthly: ipcData.monthly_variation || 2.2,
        annual: ipcData.annual_variation || 84.5,
        accumulated: ipcData.accumulated_variation || 15.1,
        index_value: ipcData.index_value || 8855.57,
        category: ipcData.category || 'Nivel General',
        region: ipcData.region || 'Nacional',
        date: ipcData.date || new Date().toISOString()
      },
      emae: {
        monthly: emaeData.monthly_variation || -0.07,
        annual: emaeData.annual_variation || 4.98,
        index: emaeData.index_value || 164.58,
        seasonally_adjusted: emaeData.seasonally_adjusted || 153.07,
        trend_cycle: emaeData.trend_cycle || 154.09,
        sector: emaeData.sector || 'Nivel General',
        date: emaeData.date || new Date().toISOString()
      },
      riesgoPais: {
        value: riesgoPaisData.value || 850,
        variation: riesgoPaisData.variation || -15,
        variation_pct: riesgoPaisData.variation_pct || -1.7,
        monthly_change: riesgoPaisData.monthly_change || 0,
        yearly_change: riesgoPaisData.yearly_change || 0,
        date: riesgoPaisData.date || new Date().toISOString()
      },
      laborMarket: {
        unemployment: laborData.unemployment_rate || 5.2,
        employment: laborData.employment_rate || 42.8,
        activity: laborData.activity_rate || 45.1,
        unemployment_change: laborData.unemployment_change || 0,
        employment_change: laborData.employment_change || 0,
        activity_change: laborData.activity_change || 0,
        data_type: laborData.data_type || 'nacional',
        date: laborData.date || new Date().toISOString()
      },
      poverty: {
        poverty_rate: povertyData.poverty_rate || 41.7,
        indigence_rate: povertyData.indigence_rate || 11.9,
        poverty_population: povertyData.poverty_population || 19500000,
        indigence_population: povertyData.indigence_population || 5600000,
        region: povertyData.region || 'Nacional',
        period: povertyData.period || 'Primer semestre 2024',
        date: povertyData.date || new Date().toISOString()
      },
      calendar: calendarData.length > 0 ? calendarData : generateFallbackCalendar(),
      emaeSectors: sectorsData.length > 0 ? sectorsData : generateFallbackSectors(),
      metadata: {
        source: 'ArgenStats API v2 Enhanced with all endpoints',
        timestamp: new Date().toISOString(),
        successful_apis: allData.metadata.successful_calls,
        failed_apis: allData.metadata.failed_calls,
        has_api_key: allData.metadata.has_api_key || !!process.env.ARGENSTATS_API_KEY,
        api_status: {
          dollar: allData.dollar ? 'success' : 'failed',
          inflation: allData.inflation ? 'success' : 'failed',
          emae: allData.emae ? 'success' : 'failed',
          riesgo_pais: allData.riesgoPais ? 'success' : 'failed',
          labor_market: allData.laborMarket ? 'success' : 'failed',
          poverty: allData.poverty ? 'success' : 'failed',
          calendar: allData.calendar ? 'success' : 'failed',
          emae_sectors: allData.emaeSectors ? 'success' : 'failed'
        },
        sources: {
          dollar: allData.dollar?.metadata?.source || 'Fallback',
          inflation: allData.inflation?.metadata?.source || 'Fallback',
          emae: allData.emae?.metadata?.source || 'Fallback',
          riesgo_pais: allData.riesgoPais?.metadata?.source || 'Fallback',
          labor_market: allData.laborMarket?.metadata?.source || 'Fallback',
          poverty: allData.poverty?.metadata?.source || 'Fallback',
          calendar: allData.calendar?.metadata?.source || 'Fallback',
          emae_sectors: allData.emaeSectors?.metadata?.source || 'Fallback'
        },
        real_data_indicators: {
          dollar_is_real: allData.dollar?.metadata?.source?.includes('ArgenStats API') || false,
          inflation_is_real: allData.inflation?.metadata?.source?.includes('ArgenStats API') || false,
          emae_is_real: allData.emae?.metadata?.source?.includes('ArgenStats API') || false,
          riesgo_pais_is_real: allData.riesgoPais?.metadata?.source?.includes('ArgenStats API') || false,
          poverty_is_real: allData.poverty?.metadata?.source?.includes('ArgenStats API') || false,
          calendar_is_real: allData.calendar?.metadata?.source?.includes('ArgenStats API') || false,
          sectors_is_real: allData.emaeSectors?.metadata?.source?.includes('ArgenStats API') || false
        },
        data_coverage: {
          total_endpoints: 8,
          successful_endpoints: allData.metadata.successful_calls,
          coverage_percentage: ((allData.metadata.successful_calls / 8) * 100).toFixed(1)
        }
      }
    }

    console.log('✅ Enhanced final response built:', {
      oficial: response.exchangeRates.oficial,
      blue: response.exchangeRates.blue,
      inflation_monthly: response.inflation.monthly,
      poverty_rate: response.poverty.poverty_rate,
      calendar_events: response.calendar.length,
      sectors_count: response.emaeSectors.length,
      successful_apis: response.metadata.successful_apis,
      coverage: response.metadata.data_coverage.coverage_percentage + '%'
    })
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('❌ Critical error in enhanced main API route:', error)
    
    // Enhanced fallback with comprehensive data
    const fallbackResponse = {
      exchangeRates: {
        oficial: 1290,
        blue: 1325,
        mep: 1332,
        ccl: 1331,
        tarjeta: 1742,
        date: new Date().toISOString(),
        variations: { oficial: 0, blue: 0, mep: 0, ccl: 0, tarjeta: 0 }
      },
      inflation: {
        monthly: 2.2,
        annual: 84.5,
        accumulated: 15.1,
        index_value: 8855.57,
        category: 'Nivel General',
        region: 'Nacional',
        date: new Date().toISOString()
      },
      emae: {
        monthly: -0.07,
        annual: 4.98,
        index: 164.58,
        seasonally_adjusted: 153.07,
        trend_cycle: 154.09,
        sector: 'Nivel General',
        date: new Date().toISOString()
      },
      riesgoPais: {
        value: 850,
        variation: -15,
        variation_pct: -1.7,
        monthly_change: 25,
        yearly_change: 150,
        date: new Date().toISOString()
      },
      laborMarket: {
        unemployment: 5.2,
        employment: 42.8,
        activity: 45.1,
        unemployment_change: -0.2,
        employment_change: 0.3,
        activity_change: 0.1,
        data_type: 'nacional',
        date: new Date().toISOString()
      },
      poverty: {
        poverty_rate: 41.7,
        indigence_rate: 11.9,
        poverty_population: 19500000,
        indigence_population: 5600000,
        region: 'Nacional',
        period: 'Primer semestre 2024',
        date: new Date().toISOString()
      },
      calendar: generateFallbackCalendar(),
      emaeSectors: generateFallbackSectors(),
      metadata: {
        source: 'Enhanced fallback with comprehensive data',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        successful_apis: 0,
        failed_apis: 8,
        has_api_key: !!process.env.ARGENSTATS_API_KEY,
        api_status: {
          dollar: 'failed',
          inflation: 'failed',
          emae: 'failed',
          riesgo_pais: 'failed',
          labor_market: 'failed',
          poverty: 'failed',
          calendar: 'failed',
          emae_sectors: 'failed'
        },
        sources: {
          dollar: 'Enhanced Fallback',
          inflation: 'Enhanced Fallback',
          emae: 'Enhanced Fallback',
          riesgo_pais: 'Enhanced Fallback',
          labor_market: 'Enhanced Fallback',
          poverty: 'Enhanced Fallback',
          calendar: 'Enhanced Fallback',
          emae_sectors: 'Enhanced Fallback'
        },
        real_data_indicators: {
          dollar_is_real: false,
          inflation_is_real: false,
          emae_is_real: false,
          riesgo_pais_is_real: false,
          poverty_is_real: false,
          calendar_is_real: false,
          sectors_is_real: false
        },
        data_coverage: {
          total_endpoints: 8,
          successful_endpoints: 0,
          coverage_percentage: '0.0'
        }
      }
    }
    
    return NextResponse.json(fallbackResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

// Helper function to process dollar data from multiple possible formats
function processDollarData(dollarApiResponse: any): DollarData {
  if (!dollarApiResponse?.data) return {}
  
  const data = dollarApiResponse.data
  const result: DollarData = {
    date: new Date().toISOString()
  }
  
  // Handle array of dollar types
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      const type = item.dollar_type?.toLowerCase()
      const sellPrice = item.sell_price || item.buy_price || item.price
      const variation = item.sell_variation || item.buy_variation || item.variation || 0
      
      switch (type) {
        case 'oficial':
          result.oficial = sellPrice
          result.oficial_variation = variation
          break
        case 'blue':
          result.blue = sellPrice
          result.blue_variation = variation
          break
        case 'mep':
          result.mep = sellPrice
          result.mep_variation = variation
          break
        case 'ccl':
          result.ccl = sellPrice
          result.ccl_variation = variation
          break
        case 'tarjeta':
          result.tarjeta = sellPrice
          result.tarjeta_variation = variation
          break
      }
      
      if (item.date && !result.date) {
        result.date = item.date
      }
    })
  } else {
    // Handle single object response
    result.oficial = data.oficial || data.OFICIAL?.sell_price
    result.blue = data.blue || data.BLUE?.sell_price
    result.mep = data.mep || data.MEP?.sell_price
    result.ccl = data.ccl || data.CCL?.sell_price
    result.tarjeta = data.tarjeta || data.TARJETA?.sell_price
    result.date = data.date || result.date
  }
  
  return result
}

// Helper function to generate fallback calendar data
function generateFallbackCalendar(): CalendarEvent[] {
  const today = new Date()
  const events: CalendarEvent[] = []
  
  // Generate upcoming events
  const upcomingEvents = [
    {
      days: 3,
      indicator: 'IPC - Índice de Precios al Consumidor',
      period: 'Diciembre 2024',
      day_week: 'Miércoles'
    },
    {
      days: 7,
      indicator: 'EMAE - Estimador Mensual de Actividad Económica',
      period: 'Noviembre 2024',
      day_week: 'Lunes'
    },
    {
      days: 10,
      indicator: 'Mercado de Trabajo - EPH',
      period: 'Tercer trimestre 2024',
      day_week: 'Jueves'
    },
    {
      days: 14,
      indicator: 'Balanza Comercial',
      period: 'Diciembre 2024',
      day_week: 'Lunes'
    },
    {
      days: 21,
      indicator: 'Índice de Producción Industrial',
      period: 'Diciembre 2024',
      day_week: 'Martes'
    }
  ]
  
  upcomingEvents.forEach(event => {
    const eventDate = new Date(today.getTime() + event.days * 24 * 60 * 60 * 1000)
    events.push({
      date: eventDate.toISOString(),
      day_week: event.day_week,
      indicator: event.indicator,
      period: event.period,
      source: 'INDEC'
    })
  })
  
  return events
}

// Helper function to generate fallback sectors data
function generateFallbackSectors(): SectorData[] {
  return [
    { sector: 'Industria manufacturera', annual_variation: 3.8, index_value: 187.4 },
    { sector: 'Comercio mayorista, minorista y reparaciones', annual_variation: 4.1, index_value: 165.2 },
    { sector: 'Construcción', annual_variation: -2.3, index_value: 78.9 },
    { sector: 'Agricultura, ganadería, caza y silvicultura', annual_variation: 2.1, index_value: 142.3 },
    { sector: 'Hoteles y restaurantes', annual_variation: 6.7, index_value: 201.3 },
    { sector: 'Transporte, almacenamiento y comunicaciones', annual_variation: 2.8, index_value: 149.1 },
    { sector: 'Intermediación financiera', annual_variation: 8.9, index_value: 223.7 },
    { sector: 'Electricidad, gas y agua', annual_variation: 1.9, index_value: 134.6 },
    { sector: 'Explotación de minas y canteras', annual_variation: 5.2, index_value: 156.8 },
    { sector: 'Administración pública y defensa', annual_variation: 1.2, index_value: 128.4 },
    { sector: 'Enseñanza', annual_variation: 0.8, index_value: 115.9 },
    { sector: 'Servicios sociales y de salud', annual_variation: 2.4, index_value: 138.7 },
    { sector: 'Actividades inmobiliarias, empresariales y de alquiler', annual_variation: 3.5, index_value: 172.8 },
    { sector: 'Pesca', annual_variation: -1.5, index_value: 98.7 }
  ]
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
