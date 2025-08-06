import axios from 'axios'

const ARGENSTATS_BASE_URL = 'https://argenstats.com/api'

// Tu API Key de ArgenStats (opcional pero recomendada)
const API_KEY = process.env.ARGENSTATS_API_KEY

const api = axios.create({
  baseURL: ARGENSTATS_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'x-api-key': API_KEY })
  },
})

// Interfaces para ArgenStats
export interface DollarData {
  date: string
  oficial: number
  blue?: number
  mep?: number
  ccl?: number
  tarjeta?: number
}

export interface IPCData {
  date: string
  monthly_variation: number
  annual_variation: number
  accumulated_variation: number
}

export interface EMAEData {
  date: string
  monthly_variation: number
  annual_variation: number
  accumulated_variation: number
  index_value: number
}

export interface RiesgoPaisData {
  date: string
  value: number
  variation: number
}

export interface LaborMarketData {
  date: string
  activity_rate: number
  employment_rate: number
  unemployment_rate: number
}

// Funciones de la API
export async function getDollarData(limit = 30) {
  try {
    const response = await api.get('/dollar', {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching dollar data:', error)
    throw new Error('Error al obtener cotizaciones del dólar')
  }
}

export async function getIPCData(year = new Date().getFullYear()) {
  try {
    const response = await api.get('/ipc', {
      params: { year }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching IPC data:', error)
    throw new Error('Error al obtener datos de IPC')
  }
}

export async function getEMAEData(year = new Date().getFullYear()) {
  try {
    const response = await api.get('/emae', {
      params: { year }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching EMAE data:', error)
    throw new Error('Error al obtener datos del EMAE')
  }
}

export async function getRiesgoPaisData(limit = 30) {
  try {
    const response = await api.get('/riesgo-pais', {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching riesgo país data:', error)
    throw new Error('Error al obtener datos de riesgo país')
  }
}

export async function getLaborMarketData() {
  try {
    const response = await api.get('/labor-market')
    return response.data
  } catch (error) {
    console.error('Error fetching labor market data:', error)
    throw new Error('Error al obtener datos del mercado laboral')
  }
}

export async function getCalendarData(year = new Date().getFullYear()) {
  try {
    const response = await api.get('/calendar', {
      params: { year }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    throw new Error('Error al obtener calendario del INDEC')
  }
}
