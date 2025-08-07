const ARGENSTATS_BASE_URL = 'https://argenstats.com/api'

// Headers para ArgenStats (opcional API key)
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Dashboard-Argentina/1.0'
  }
  
  // Agregar API key si está disponible
  if (process.env.ARGENSTATS_API_KEY) {
    headers['x-api-key'] = process.env.ARGENSTATS_API_KEY
  }
  
  return headers
}

// Función helper para hacer requests
const apiRequest = async (endpoint: string, params?: Record<string, any>) => {
  try {
    let url = `${ARGENSTATS_BASE_URL}${endpoint}`
    
    // Agregar query parameters si existen
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value.toString())
        }
      })
      if (queryString.toString()) {
        url += `?${queryString.toString()}`
      }
    }

    console.log('ArgenStats API Request:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-cache'
    })

    console.log('ArgenStats Response Status:', response.status)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('ArgenStats Data:', data)
    
    return data
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

// API Functions actualizadas según la documentación
export async function getDollarRates() {
  try {
    const response = await apiRequest('/dollar', { type: 'latest' })
    
    // Procesar la respuesta según la estructura real de ArgenStats
    if (response.success && response.data) {
      const rates = response.data
      
      // Crear un objeto con todas las cotizaciones
      const ratesMap: Record<string, any> = {}
      rates.forEach((rate: any) => {
        ratesMap[rate.dollar_type] = rate
      })
      
      return {
        data: [{
          date: rates[0]?.date || new Date().toISOString(),
          oficial: ratesMap.OFICIAL?.sell_price || ratesMap.OFICIAL?.buy_price || 1015.50,
          blue: ratesMap.BLUE?.sell_price || ratesMap.BLUE?.buy_price || 1485.00,
          mep: ratesMap.MEP?.sell_price || ratesMap.MEP?.buy_price || 1205.00,
          ccl: ratesMap.CCL?.sell_price || ratesMap.CCL?.buy_price || 1220.00,
          tarjeta: ratesMap.TARJETA?.sell_price || ratesMap.TARJETA?.buy_price || 1625.00,
          // Incluir variaciones si están disponibles
          oficial_variation: ratesMap.OFICIAL?.sell_variation,
          blue_variation: ratesMap.BLUE?.sell_variation,
          mep_variation: ratesMap.MEP?.sell_variation,
          ccl_variation: ratesMap.CCL?.sell_variation,
          tarjeta_variation: ratesMap.TARJETA?.sell_variation
        }],
        metadata: {
          source: 'ArgenStats API',
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid response structure')
  } catch (error) {
    console.error('Error fetching dollar rates:', error)
    // Fallback con datos realistas
    return {
      data: [{
        date: new Date().toISOString(),
        oficial: 1015.50,
        blue: 1485.00,
        mep: 1205.00,
        ccl: 1220.00,
        tarjeta: 1625.00
      }],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

export async function getInflationData(year?: number) {
  try {
    const params = { 
      type: 'latest',
      category: 'GENERAL',
      include_variations: true
    }
    
    const response = await apiRequest('/ipc', params)
    
    if (response.success && response.data && response.data.length > 0) {
      const latestData = response.data[0]
      
      return {
        data: [{
          date: latestData.date,
          monthly_variation: latestData.monthly_pct_change,
          annual_variation: latestData.yearly_pct_change,
          accumulated_variation: latestData.accumulated_pct_change,
          index_value: latestData.index_value,
          category: latestData.category,
          region: latestData.region
        }],
        metadata: {
          source: 'ArgenStats API - IPC',
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid IPC response')
  } catch (error) {
    console.error('Error fetching IPC data:', error)
    // Fallback con datos realistas
    return {
      data: [{
        date: new Date().toISOString(),
        monthly_variation: 2.5,
        annual_variation: 211.4,
        accumulated_variation: 45.2
      }],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

export async function getEMAEData(year?: number) {
  try {
    const response = await apiRequest('/emae/latest')
    
    if (response && response.original_value !== undefined) {
      return {
        data: [{
          date: response.date,
          monthly_variation: response.monthly_pct_change || 0,
          annual_variation: response.yearly_pct_change || 0,
          index_value: response.original_value,
          seasonally_adjusted: response.seasonally_adjusted_value,
          trend_cycle: response.trend_cycle_value,
          sector: response.sector || 'Nivel General'
        }],
        metadata: {
          source: 'ArgenStats API - EMAE',
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid EMAE response')
  } catch (error) {
    console.error('Error fetching EMAE data:', error)
    // Fallback con datos realistas
    return {
      data: [{
        date: new Date().toISOString(),
        monthly_variation: -0.5,
        annual_variation: 3.2,
        index_value: 125.4
      }],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

export async function getRiesgoPaisData() {
  try {
    const response = await apiRequest('/riesgo-pais', { type: 'latest' })
    
    if (response.success && response.data && response.data.length > 0) {
      const latestData = response.data[0]
      
      return {
        data: [{
          date: latestData.closing_date,
          value: latestData.closing_value,
          variation: latestData.daily_change,
          variation_pct: latestData.daily_change_pct,
          monthly_change: latestData.monthly_change,
          yearly_change: latestData.yearly_change
        }],
        metadata: {
          source: 'ArgenStats API - Riesgo País',
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid Riesgo País response')
  } catch (error) {
    console.error('Error fetching riesgo país data:', error)
    // Fallback con datos realistas
    return {
      data: [{
        date: new Date().toISOString(),
        value: 850,
        variation: -15
      }],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

export async function getLaborMarketData() {
  try {
    const response = await apiRequest('/labor-market', { 
      view: 'latest',
      data_type: 'national'
    })
    
    if (response.success && response.data && response.data.national) {
      const nationalData = response.data.national[0]
      
      return {
        data: [{
          date: nationalData.period,
          unemployment_rate: nationalData.unemployment_rate,
          employment_rate: nationalData.employment_rate,
          activity_rate: nationalData.activity_rate,
          unemployment_change: nationalData.unemployment_rate_change,
          employment_change: nationalData.employment_rate_change,
          activity_change: nationalData.activity_rate_change,
          data_type: nationalData.data_type
        }],
        metadata: {
          source: 'ArgenStats API - Labor Market',
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid Labor Market response')
  } catch (error) {
    console.error('Error fetching labor market data:', error)
    // Fallback con datos realistas
    return {
      data: [{
        date: new Date().toISOString(),
        unemployment_rate: 5.2,
        employment_rate: 42.8,
        activity_rate: 45.1
      }],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

export async function getPovertyData() {
  try {
    const response = await apiRequest('/poverty/latest', {
      data_type: 'both'
    })
    
    if (response.success && response.data && response.data.length > 0) {
      const latestData = response.data[0]
      
      return {
        data: [{
          period: latestData.time_period,
          region: latestData.region,
          poverty_rate: latestData.poverty_rate,
          indigence_rate: latestData.indigence_rate,
          poverty_change: latestData.poverty_change,
          indigence_change: latestData.indigence_change,
          population_total: latestData.population_total,
          poor_population: latestData.poor_population,
          indigent_population: latestData.indigent_population
        }],
        metadata: {
          source: 'ArgenStats API - Poverty',
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid Poverty response')
  } catch (error) {
    console.error('Error fetching poverty data:', error)
    return {
      data: [{
        period: '2024-S1',
        region: 'Total aglomerados urbanos',
        poverty_rate: 38.9,
        indigence_rate: 8.8
      }],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

export async function getCalendarData(month?: number, year?: number) {
  try {
    const params: Record<string, any> = {}
    if (month) params.month = month
    if (year) params.year = year
    
    const response = await apiRequest('/calendar', params)
    
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data.map((event: any) => ({
          date: event.date,
          day_week: event.day_week,
          indicator: event.indicator,
          period: event.period,
          source: event.source
        })),
        metadata: {
          source: 'ArgenStats API - Calendar',
          count: response.metadata?.count || response.data.length,
          timestamp: new Date().toISOString(),
          raw_response: response
        }
      }
    }
    
    throw new Error('Invalid Calendar response')
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return {
      data: [],
      metadata: {
        source: 'Fallback data',
        error: 'API unavailable'
      }
    }
  }
}

// Función para obtener datos históricos del dólar
export async function getHistoricalDollarData(days = 30) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const response = await apiRequest('/dollar', {
      type: 'daily',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      dollar_type: 'BLUE,OFICIAL',
      limit: days,
      order: 'asc'
    })
    
    if (response.success && response.data) {
      // Agrupar por fecha
      const dataByDate: Record<string, any> = {}
      
      response.data.forEach((item: any) => {
        const date = item.date
        if (!dataByDate[date]) {
          dataByDate[date] = { date }
        }
        
        if (item.dollar_type === 'OFICIAL') {
          dataByDate[date].oficial = item.sell_price || item.buy_price
        } else if (item.dollar_type === 'BLUE') {
          dataByDate[date].blue = item.sell_price || item.buy_price
        }
      })
      
      const historicalData = Object.values(dataByDate)
        .filter((item: any) => item.oficial && item.blue)
        .map((item: any) => ({
          date: item.date,
          oficial: Math.round(item.oficial * 100) / 100,
          blue: Math.round(item.blue * 100) / 100
        }))
      
      return {
        data: historicalData,
        metadata: {
          source: 'ArgenStats API - Historical Dollar',
          days: days,
          points: historicalData.length
        }
      }
    }
    
    throw new Error('Invalid historical dollar response')
  } catch (error) {
    console.error('Error fetching historical dollar data:', error)
    
    // Generar datos sintéticos basados en datos actuales
    const currentData = await getDollarRates()
    const baseOficial = currentData.data[0]?.oficial || 1015
    const baseBlue = currentData.data[0]?.blue || 1485
    
    const historicalData = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simular variación realista
      const oficialVariation = (Math.random() - 0.5) * 20
      const blueVariation = (Math.random() - 0.5) * 30
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        oficial: Math.round((baseOficial + oficialVariation - (i * 0.5)) * 100) / 100,
        blue: Math.round((baseBlue + blueVariation - (i * 0.7)) * 100) / 100
      })
    }
    
    return {
      data: historicalData,
      metadata: {
        source: 'Generated from current rates',
        days: days
      }
    }
  }
}

export async function getHistoricalInflationData(months = 12) {
  try {
    const response = await apiRequest('/ipc', {
      type: 'historical',
      category: 'GENERAL',
      limit: months,
      order: 'desc',
      include_variations: true
    })
    
    if (response.success && response.data) {
      const historicalData = response.data
        .slice(0, months)
        .reverse() // Mostrar del más antiguo al más reciente
        .map((item: any, index: number) => {
          const date = new Date(item.date)
          const monthName = date.toLocaleDateString('es-AR', { month: 'short' })
          const year = date.getFullYear().toString().slice(-2)
          
          return {
            month: `${monthName} ${year}`,
            value: item.monthly_pct_change || 0,
            date: item.date
          }
        })
      
      return {
        data: historicalData,
        metadata: {
          source: 'ArgenStats API - Historical IPC',
          months: months,
          points: historicalData.length
        }
      }
    }
    
    throw new Error('Invalid historical inflation response')
  } catch (error) {
    console.error('Error getting historical inflation:', error)
    
    // Datos realistas de inflación 2024
    const inflationData = [
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
    
    return {
      data: inflationData.slice(-months),
      metadata: {
        source: 'Historical IPC data 2024',
        months: months
      }
    }
  }
}

// Función utilitaria para obtener todos los indicadores principales
export async function getAllMainIndicators() {
  try {
    const results = await Promise.allSettled([
      getDollarRates(),
      getInflationData(),
      getEMAEData(),
      getRiesgoPaisData(),
      getLaborMarketData(),
      getPovertyData()
    ])
    
    return {
      dollar: results[0].status === 'fulfilled' ? results[0].value : null,
      inflation: results[1].status === 'fulfilled' ? results[1].value : null,
      emae: results[2].status === 'fulfilled' ? results[2].value : null,
      riesgoPais: results[3].status === 'fulfilled' ? results[3].value : null,
      laborMarket: results[4].status === 'fulfilled' ? results[4].value : null,
      poverty: results[5].status === 'fulfilled' ? results[5].value : null,
      metadata: {
        successful_calls: results.filter(r => r.status === 'fulfilled').length,
        failed_calls: results.filter(r => r.status === 'rejected').length,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error fetching all indicators:', error)
    throw error
  }
        }
