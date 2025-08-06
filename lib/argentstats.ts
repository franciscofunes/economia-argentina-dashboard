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

// API Functions
export async function getDollarRates() {
  try {
    return await apiRequest('/dollar')
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
    const params = year ? { year } : {}
    return await apiRequest('/ipc', params)
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
    const params = year ? { year } : {}
    return await apiRequest('/emae', params)
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
    return await apiRequest('/riesgo-pais')
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
    return await apiRequest('/labor-market')
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

export async function getCalendarData(month?: number, year?: number) {
  try {
    const params: Record<string, any> = {}
    if (month) params.month = month
    if (year) params.year = year
    
    return await apiRequest('/calendar', params)
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

// Función para obtener datos históricos (simulados por ahora)
export async function getHistoricalDollarData(days = 30) {
  try {
    // ArgenStats puede no tener endpoint de histórico, simulamos
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
  } catch (error) {
    console.error('Error generating historical data:', error)
    throw error
  }
}

export async function getHistoricalInflationData(months = 12) {
  try {
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
  } catch (error) {
    console.error('Error getting historical inflation:', error)
    throw error
  }
}
