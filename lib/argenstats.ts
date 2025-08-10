// Enhanced ArgenStats library with all available endpoints

const ARGENSTATS_BASE_URL = 'https://argenstats.com/api'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// Enhanced fetch function with proper API key handling
const simpleFetch = async (endpoint: string): Promise<any> => {
  try {
    const url = `${ARGENSTATS_BASE_URL}${endpoint}`
    console.log(`🔗 Fetching: ${url}`)
    
    // Build headers with API key if available
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Dashboard-Argentina/2.0'
    }
    
    // Add API key if available
    if (process.env.ARGENSTATS_API_KEY) {
      headers['x-api-key'] = process.env.ARGENSTATS_API_KEY
      console.log('🔑 Using API key for request')
    } else {
      console.log('⚠️ No API key found in environment variables')
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    })
    
    console.log(`📡 Response status: ${response.status}`)
    
    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`✅ Parsed data:`, data)
    
    return data
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error)
    throw error
  }
}

// ==================== CALENDAR API ====================
export async function getCalendarData(params?: {
  month?: number
  year?: number
  start_date?: string
  end_date?: string
}) {
  try {
    let endpoint = '/calendar'
    const queryParams = new URLSearchParams()
    
    if (params?.month) queryParams.append('month', params.month.toString())
    if (params?.year) queryParams.append('year', params.year.toString())
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: data.data || [],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - Calendar',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('📅 Calendar API failed, using fallback:', getErrorMessage(error))
    
    // Generate upcoming events fallback
    const today = new Date()
    const fallbackEvents = [
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
      }
    ]
    
    return {
      data: fallbackEvents,
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error),
        count: fallbackEvents.length
      }
    }
  }
}

// ==================== ENHANCED EMAE API ====================
export async function getEMAEData(params?: {
  year?: number
  sector?: string
  view?: 'latest' | 'all'
}) {
  try {
    let endpoint = '/emae'
    const queryParams = new URLSearchParams()
    
    if (params?.year) queryParams.append('year', params.year.toString())
    if (params?.sector) queryParams.append('sector', params.sector)
    if (params?.view) queryParams.append('view', params.view)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - EMAE',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('⚡ EMAE API failed, using fallback:', getErrorMessage(error))
    
    return {
      data: [{
        date: new Date().toISOString(),
        monthly_variation: -0.07,
        annual_variation: 4.98,
        index_value: 164.58,
        seasonally_adjusted: 153.07,
        trend_cycle: 154.09,
        sector: 'Nivel General'
      }],
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// Get EMAE sectors data
export async function getEMAESectors(year?: number) {
  try {
    let endpoint = '/emae/sectors'
    if (year) endpoint += `?year=${year}`
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: data.data || [],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - EMAE Sectors',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('⚡ EMAE Sectors API failed, using fallback:', getErrorMessage(error))
    
    const fallbackSectors = [
      { sector: 'Agricultura, ganadería, caza y silvicultura', annual_variation: 2.1, index_value: 142.3 },
      { sector: 'Pesca', annual_variation: -1.5, index_value: 98.7 },
      { sector: 'Explotación de minas y canteras', annual_variation: 5.2, index_value: 156.8 },
      { sector: 'Industria manufacturera', annual_variation: 3.8, index_value: 187.4 },
      { sector: 'Electricidad, gas y agua', annual_variation: 1.9, index_value: 134.6 },
      { sector: 'Construcción', annual_variation: -2.3, index_value: 78.9 },
      { sector: 'Comercio mayorista, minorista y reparaciones', annual_variation: 4.1, index_value: 165.2 },
      { sector: 'Hoteles y restaurantes', annual_variation: 6.7, index_value: 201.3 },
      { sector: 'Transporte, almacenamiento y comunicaciones', annual_variation: 2.8, index_value: 149.1 },
      { sector: 'Intermediación financiera', annual_variation: 8.9, index_value: 223.7 },
      { sector: 'Actividades inmobiliarias, empresariales y de alquiler', annual_variation: 3.5, index_value: 172.8 },
      { sector: 'Administración pública y defensa', annual_variation: 1.2, index_value: 128.4 },
      { sector: 'Enseñanza', annual_variation: 0.8, index_value: 115.9 },
      { sector: 'Servicios sociales y de salud', annual_variation: 2.4, index_value: 138.7 }
    ]
    
    return {
      data: fallbackSectors,
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// ==================== ENHANCED IPC API ====================
export async function getInflationData(params?: {
  year?: number
  category?: string
  region?: string
  view?: 'latest' | 'all'
}) {
  try {
    let endpoint = '/ipc'
    const queryParams = new URLSearchParams()
    
    if (params?.year) queryParams.append('year', params.year.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.region) queryParams.append('region', params.region)
    if (params?.view) queryParams.append('view', params.view)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - IPC',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('📈 IPC API failed, using fallback:', getErrorMessage(error))
    
    return {
      data: [{
        date: new Date().toISOString(),
        monthly_variation: 2.2,
        annual_variation: 84.5,
        accumulated_variation: 15.1,
        index_value: 8855.57,
        category: 'Nivel General',
        region: 'Nacional'
      }],
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// ==================== ENHANCED DOLLAR API ====================
export async function getDollarRates(params?: {
  type?: 'latest' | 'daily' | 'monthly'
  start_date?: string
  end_date?: string
  dollar_type?: string
}) {
  try {
    let endpoint = '/dollar'
    const queryParams = new URLSearchParams()
    
    if (params?.type) queryParams.append('type', params.type)
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.dollar_type) queryParams.append('dollar_type', params.dollar_type)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    // Process the data based on response structure
    let processedData: any[] = []
    
    if (data && data.success && data.data) {
      processedData = Array.isArray(data.data) ? data.data : [data.data]
    } else if (Array.isArray(data)) {
      processedData = data
    } else if (data) {
      processedData = [data]
    }
    
    return {
      data: processedData,
      metadata: {
        source: 'ArgenStats API - Dollar',
        timestamp: new Date().toISOString(),
        total_records: processedData.length
      }
    }
  } catch (error) {
    console.log('💰 Dollar API failed, using fallback:', getErrorMessage(error))
    
    return {
      data: [{
        date: new Date().toISOString(),
        dollar_type: 'OFICIAL',
        buy_price: 1285.50,
        sell_price: 1290.00,
        variation: 0.15
      }, {
        date: new Date().toISOString(),
        dollar_type: 'BLUE',
        buy_price: 1320.00,
        sell_price: 1325.00,
        variation: -0.75
      }],
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// ==================== ENHANCED RIESGO PAÍS API ====================
export async function getRiesgoPaisData(params?: {
  start_date?: string
  end_date?: string
  view?: 'latest' | 'historical'
}) {
  try {
    let endpoint = '/riesgo-pais'
    const queryParams = new URLSearchParams()
    
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.view) queryParams.append('view', params.view)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - Riesgo País',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('🚨 Riesgo País API failed, using fallback:', getErrorMessage(error))
    
    return {
      data: [{
        date: new Date().toISOString(),
        value: 850,
        variation: -15,
        variation_pct: -1.7,
        monthly_change: 25,
        yearly_change: 150
      }],
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// ==================== ENHANCED LABOR MARKET API ====================
export async function getLaborMarketData(params?: {
  region?: string
  demographic?: string
  view?: 'latest' | 'historical'
  data_type?: 'national' | 'regional'
}) {
  try {
    let endpoint = '/labor-market'
    const queryParams = new URLSearchParams()
    
    if (params?.region) queryParams.append('region', params.region)
    if (params?.demographic) queryParams.append('demographic', params.demographic)
    if (params?.view) queryParams.append('view', params.view)
    if (params?.data_type) queryParams.append('data_type', params.data_type)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - Labor Market',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('👥 Labor Market API failed, using fallback:', getErrorMessage(error))
    
    return {
      data: [{
        date: new Date().toISOString(),
        unemployment_rate: 5.2,
        employment_rate: 42.8,
        activity_rate: 45.1,
        region: 'Nacional',
        demographic: 'Total'
      }],
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// ==================== NEW POVERTY API ====================
export async function getPovertyData(params?: {
  view?: 'latest' | 'historical'
  region?: string
  type?: 'poverty' | 'indigence' | 'both'
}) {
  try {
    let endpoint = '/poverty'
    const queryParams = new URLSearchParams()
    
    if (params?.view) queryParams.append('view', params.view)
    if (params?.region) queryParams.append('region', params.region)
    if (params?.type) queryParams.append('type', params.type)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }
    
    const data = await simpleFetch(endpoint)
    
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - Poverty',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('👥 Poverty API failed, using fallback:', getErrorMessage(error))
    
    return {
      data: [{
        date: new Date().toISOString(),
        poverty_rate: 41.7,
        indigence_rate: 11.9,
        poverty_population: 19500000,
        indigence_population: 5600000,
        region: 'Nacional',
        period: 'Primer semestre 2024'
      }],
      metadata: {
        source: 'Fallback data',
        timestamp: new Date().toISOString(),
        error: getErrorMessage(error)
      }
    }
  }
}

// Get latest poverty data
export async function getLatestPovertyData() {
  try {
    const data = await simpleFetch('/poverty/latest')
    
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      metadata: {
        ...data.metadata,
        source: 'ArgenStats API - Latest Poverty',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    return getPovertyData({ view: 'latest' })
  }
}

// ==================== ENHANCED MAIN FUNCTION ====================
export async function getAllMainIndicators() {
  console.log('🔄 Getting all indicators with enhanced API support...')
  
  if (process.env.ARGENSTATS_API_KEY) {
    console.log('🔑 API key found, attempting to fetch real data')
  } else {
    console.log('⚠️ No API key found, some endpoints may fail')
  }
  
  const results = await Promise.allSettled([
    getDollarRates({ type: 'latest' }),
    getInflationData({ view: 'latest' }),
    getEMAEData({ view: 'latest' }),
    getRiesgoPaisData({ view: 'latest' }),
    getLaborMarketData({ view: 'latest', data_type: 'national' }),
    getLatestPovertyData(),
    getCalendarData({ year: new Date().getFullYear() }),
    getEMAESectors(new Date().getFullYear())
  ])
  
  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  
  console.log(`📊 Results: ${successful} successful, ${failed} failed`)
  
  return {
    dollar: results[0].status === 'fulfilled' ? results[0].value : null,
    inflation: results[1].status === 'fulfilled' ? results[1].value : null,
    emae: results[2].status === 'fulfilled' ? results[2].value : null,
    riesgoPais: results[3].status === 'fulfilled' ? results[3].value : null,
    laborMarket: results[4].status === 'fulfilled' ? results[4].value : null,
    poverty: results[5].status === 'fulfilled' ? results[5].value : null,
    calendar: results[6].status === 'fulfilled' ? results[6].value : null,
    emaeSectors: results[7].status === 'fulfilled' ? results[7].value : null,
    metadata: {
      successful_calls: successful,
      failed_calls: failed,
      timestamp: new Date().toISOString(),
      has_api_key: !!process.env.ARGENSTATS_API_KEY
    }
  }
}

// ==================== HISTORICAL DATA FUNCTIONS ====================
export async function getHistoricalDollarData(days = 30) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return getDollarRates({
    type: 'daily',
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    dollar_type: 'BLUE,OFICIAL'
  })
}

export async function getHistoricalInflationData(months = 12) {
  const currentYear = new Date().getFullYear()
  
  try {
    const data = await getInflationData({ year: currentYear, view: 'all' })
    
    // Take only the last N months
    const sortedData = data.data
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-months)
    
    return {
      data: sortedData.map((item: any) => ({
        month: new Date(item.date).toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }),
        value: item.monthly_variation,
        date: item.date
      })),
      metadata: data.metadata
    }
  } catch (error) {
    // Fallback to real historical data
    const realData = [
      { month: 'Ene 24', value: 20.6, date: '2024-01-31' },
      { month: 'Feb 24', value: 13.2, date: '2024-02-29' },
      { month: 'Mar 24', value: 11.0, date: '2024-03-31' },
      { month: 'Abr 24', value: 8.8, date: '2024-04-30' },
      { month: 'May 24', value: 4.2, date: '2024-05-31' },
      { month: 'Jun 24', value: 4.6, date: '2024-06-30' },
      { month: 'Jul 24', value: 4.0, date: '2024-07-31' },
      { month: 'Ago 24', value: 4.2, date: '2024-08-31' },
      { month: 'Sep 24', value: 3.5, date: '2024-09-30' },
      { month: 'Oct 24', value: 2.7, date: '2024-10-31' },
      { month: 'Nov 24', value: 2.4, date: '2024-11-30' },
      { month: 'Dic 24', value: 2.5, date: '2024-12-31' }
    ]
    
    return {
      data: realData.slice(-months),
      metadata: {
        source: 'Historical INDEC data 2024',
        months: months,
        error: getErrorMessage(error)
      }
    }
  }
}
