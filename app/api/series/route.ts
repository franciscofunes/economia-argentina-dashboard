import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const seriesBaseUrl = 'https://apis.datos.gob.ar/series/api'
    
    // IDs conocidos de series de inflación (verificar con la API)
    const inflationSeriesIds = [
      '148.3_INIVELNAL_DICI_M_26', // IPC Nacional mensual
      '148.3_INIVELNAL_DICI_M_19', // IPC Nivel general
      '103.1_I2N_2016_M_19', // Alternativo
    ]
    
    let inflationData = null
    let usedSeriesId = null
    
    // Intentar con diferentes IDs de series hasta encontrar uno que funcione
    for (const seriesId of inflationSeriesIds) {
      try {
        const response = await fetch(
          `${seriesBaseUrl}/series?ids=${seriesId}&last=12&format=json`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Dashboard-Argentina/1.0'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0 && data.data[0].values) {
            inflationData = data.data[0]
            usedSeriesId = seriesId
            break
          }
        }
      } catch (error) {
        console.log(`Error con series ${seriesId}:`, error)
        continue
      }
    }
    
    // Si no encontramos datos reales, usar datos de ejemplo realistas
    if (!inflationData || !inflationData.values || inflationData.values.length === 0) {
      // Usar datos realistas de inflación argentina 2024
      const mockInflationValues = [
        { date: '2024-01-01', value: 20.6 },
        { date: '2024-02-01', value: 13.2 },
        { date: '2024-03-01', value: 11.0 },
        { date: '2024-04-01', value: 8.8 },
        { date: '2024-05-01', value: 4.2 },
        { date: '2024-06-01', value: 4.6 },
        { date: '2024-07-01', value: 4.0 },
        { date: '2024-08-01', value: 4.2 },
        { date: '2024-09-01', value: 3.5 },
        { date: '2024-10-01', value: 2.7 },
        { date: '2024-11-01', value: 2.4 },
        { date: '2024-12-01', value: 2.5 }
      ]
      
      inflationData = {
        values: mockInflationValues,
        series_title: 'IPC Nacional Mensual (Datos de referencia)',
        series_units: 'Porcentaje'
      }
      usedSeriesId = 'fallback-data'
    }
    
    // Procesar datos
    const latestValue = inflationData.values[inflationData.values.length - 1]
    
    // Calcular inflación anual (suma de últimos 12 meses)
    const annualInflation = inflationData.values
      .slice(-12)
      .reduce((acc: number, curr: any) => acc + (curr.value || 0), 0)
    
    const response = {
      inflation: {
        monthly: latestValue?.value || 2.8,
        annual: annualInflation || 211.4,
        date: latestValue?.date || new Date().toISOString()
      },
      metadata: {
        source: usedSeriesId === 'fallback-data' ? 'Datos de referencia' : 'Series de Tiempo API',
        seriesId: usedSeriesId,
        seriesTitle: inflationData.series_title,
        lastUpdate: new Date().toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Series API error:', error)
    
    // Fallback con datos realistas
    const fallbackResponse = {
      inflation: {
        monthly: 2.8,
        annual: 211.4,
        date: new Date().toISOString()
      },
      metadata: {
        source: 'Fallback data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    return NextResponse.json(fallbackResponse)
  }
}
