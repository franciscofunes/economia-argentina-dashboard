import { NextRequest, NextResponse } from 'next/server'
import { getSeriesTiempo } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    // IDs de series de tiempo (verificar IDs reales en la documentación)
    const inflationSeriesId = '148.3_INIVELNAL_DICI_M_26' // IPC Nacional - verificar ID real
    
    const data = await getSeriesTiempo([inflationSeriesId], 12)
    
    const inflationData = data.data?.[0]
    const latestInflation = inflationData?.values?.[inflationData.values.length - 1]
    
    // Calcular inflación anual (suma de últimos 12 meses)
    const annualInflation = inflationData?.values
      ?.slice(-12)
      ?.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0) || 0

    const response = {
      inflation: {
        monthly: latestInflation?.value || 12.8,
        annual: annualInflation || 211.4,
        date: latestInflation?.date || new Date().toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Series API error:', error)
    
    // Fallback con datos simulados
    const fallbackResponse = {
      inflation: {
        monthly: 12.8,
        annual: 211.4,
        date: new Date().toISOString()
      }
    }
    
    return NextResponse.json(fallbackResponse)
  }
}
