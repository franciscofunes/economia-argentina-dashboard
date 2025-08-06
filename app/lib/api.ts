import axios from 'axios'
import { BCRAVariable, SeriesTiempo, PresupuestoData } from './types'

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// BCRA API Oficial
export async function getBCRAMetadata() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BCRA_BASE_URL
    const response = await api.get(`${baseUrl}/Metadatos`)
    return response.data
  } catch (error) {
    console.error('Error fetching BCRA metadata:', error)
    throw new Error('Error al obtener metadatos del BCRA')
  }
}

export async function getBCRAVariable(variableId: number, dateFrom?: string, dateTo?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BCRA_BASE_URL
    const fromDate = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const toDate = dateTo || new Date().toISOString().split('T')[0]
    
    const response = await api.get(`${baseUrl}/Datos/${variableId}/${fromDate}/${toDate}`)
    return response.data
  } catch (error) {
    console.error('Error fetching BCRA data:', error)
    throw new Error('Error al obtener datos del BCRA')
  }
}

// Series de Tiempo API
export async function getSeriesTiempo(seriesIds: string[], lastN = 30) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERIES_BASE_URL
    const idsParam = seriesIds.join(',')
    const response = await api.get(`${baseUrl}/series`, {
      params: {
        ids: idsParam,
        last: lastN,
        format: 'json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching series data:', error)
    throw new Error('Error al obtener series de tiempo')
  }
}

// Presupuesto API
export async function getPresupuestoData(year = new Date().getFullYear()) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_PRESUPUESTO_BASE_URL
    const headers: any = {}
    
    if (process.env.PRESUPUESTO_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.PRESUPUESTO_API_TOKEN}`
    }
    
    const response = await api.get(`${baseUrl}/ejecucion`, {
      headers,
      params: {
        ejercicio: year,
        formato: 'json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching budget data:', error)
    // Fallback a datos simulados
    return {
      total: 50000000000000,
      executed: 32500000000000,
      percentage: 65
    }
  }
}

// Georef API para datos geográficos
export async function getProvincesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_GEOREF_BASE_URL
    const response = await api.get(`${baseUrl}/provincias`)
    return response.data
  } catch (error) {
    console.error('Error fetching provinces data:', error)
    throw new Error('Error al obtener datos de provincias')
  }
      }
