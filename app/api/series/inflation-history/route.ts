import { NextRequest, NextResponse } from 'next/server'
import { getSeriesTiempo } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const inflationSeriesId = '148.3_INIVELNAL_DICI_M_26'
    
    const data = await getSeriesTiempo([inflationSeriesId], 12)
    const inflationData = data.data?.[0]
    
    const processedData = inflationData?.values?.map((item: any) => ({
      month: new Date(item.date).toLocaleDateString('es-AR', { 
        month: 'short', 
        year: '2-digit' 
      }),
      value: item.value || 0
    })) || []

    return NextResponse.json({ data: processedData })
  } catch (error) {
    console.error('Inflation history error:', error)
    
    // Datos simulados de inflación mensual para últimos 12 meses
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
    
    return NextResponse.json({ data: mockData })
  }
}
