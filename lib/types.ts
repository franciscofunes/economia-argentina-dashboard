// Tipos para ArgenStats API
export interface DollarRates {
  oficial: number
  blue: number
  mep: number
  ccl: number
  tarjeta: number
  date: string
}

export interface InflationData {
  monthly_variation: number
  annual_variation: number
  accumulated_variation: number
  date: string
}

export interface EMAEData {
  monthly_variation: number
  annual_variation: number
  index_value: number
  date: string
}

export interface RiesgoPaisData {
  value: number
  variation: number
  date: string
}

export interface LaborMarketData {
  unemployment_rate: number
  employment_rate: number
  activity_rate: number
  date: string
}

// Tipos para datos históricos
export interface DollarHistoryPoint {
  date: string
  oficial: number
  blue: number
}

export interface InflationHistoryPoint {
  month: string
  value: number
}

// Tipo para la respuesta completa del dashboard
export interface EconomicData {
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
  metadata?: {
    source: string
    timestamp: string
    successful_apis?: number
    failed_apis?: number
    api_status?: Record<string, string>
  }
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T
  metadata?: {
    source: string
    timestamp?: string
    error?: string
    [key: string]: any
  }
}

export interface HistoricalDataResponse {
  dollarHistory: DollarHistoryPoint[]
  inflationHistory: InflationHistoryPoint[]
  metadata: {
    source: string
    timestamp: string
    dollarPoints: number
    inflationPoints: number
    parameters?: Record<string, any>
    error?: string
  }
}

// Legacy types (mantener para compatibilidad)
export interface BCRAVariable {
  idVariable: number
  cdSerie: string
  descripcion: string
  fecha: string
  valor: number
}

export interface SeriesTiempo {
  catalog: string
  dataset: string
  distribution: string
  series_id: string
  series_title: string
  series_units: string
  values: Array<{
    date: string
    value: number | null
  }>
}

export interface PresupuestoData {
  ejercicio: number
  entidad: string
  programa: string
  credito_vigente: number
  devengado: number
  pagado: number
}
