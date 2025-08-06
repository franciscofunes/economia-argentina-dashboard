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

export interface EconomicData {
  exchangeRate: {
    oficial: number
    blue: number
    date: string
  }
  inflation: {
    monthly: number
    annual: number
    date: string
  }
  interestRate: {
    rate: number
    date: string
  }
  budget: {
    executed: number
    total: number
    percentage: number
  }
}

export interface ApiResponse<T> {
  data: T
  error?: string
  loading: boolean
}
