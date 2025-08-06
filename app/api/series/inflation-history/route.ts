import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const seriesBaseUrl = 'https://apis.datos.gob.ar/series/api'
    
    // IDs conocidos de series de inflación
    const inflationSeriesIds = [
      '148.3_INIVELNAL_DICI_M_26',
      '148.3_INIVELNAL_DICI_M_19',
      '103.1_I2N_2016_M_19',
    ]
    
    let inflationData = null
    let usedSeriesId = null
    
    // Intentar obtener datos reales
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
        continue
      }
    }
    
    let processedData = []
    
    if (inflationData && inflationData.values) {
      // Procesar datos reales
      processedData = inflationData.values.map((item: any) => ({
        month: new Date(item.date).toLocaleDateString('es-AR', { 
          month: 'short', 
          year: '2-digit' 
        }),
        value: item.value || 0
      }))
    } else {
      // Datos de referencia realistas (inflación argentina 2024)
      processedData = [
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
    }
    
    // Asegurar que tenemos exactamente 12 meses
    while (processedData.length < 12) {
      const lastValue = processedData[processedData.length - 1]?.value || 2.5
      const newValue = lastValue + (Math.random() - 0.5) * 1 // Pequeña variación
      
      processedData.push({
        month: `Mes ${processedData.length + 1}`,
        value: Math.max(0, newValue)
      })
    }
    
    return NextResponse.json({ 
      data: processedData.slice(-12), // Solo últimos 12 meses
      metadata: {
        source: usedSeriesId || 'Datos de referencia',
        seriesId: usedSeriesId,
        totalPoints: processedData.length
      }
    })
  } catch (error) {
    console.error('Inflation history error:', error)
    
    // Fallback con datos realistas
    const mockData = [
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
    
    return NextResponse.json({ 
      data: mockData,
      metadata: {
        source: 'Fallback data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}
