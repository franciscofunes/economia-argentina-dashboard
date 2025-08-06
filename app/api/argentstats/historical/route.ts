import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalDollarData, getHistoricalInflationData } from '@/lib/argenstats'

// Interfaces para TypeScript
interface DollarHistoryPoint {
  date: string
  oficial: number
  blue: number
}

interface InflationHistoryPoint {
  month: string
  value: number
}

export async function GET(request: NextRequest) {
  console.log('📈 Historical Data API Route - Iniciando...')
  
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const days = parseInt(searchParams.get('days') || '30')
    const months = parseInt(searchParams.get('months') || '12')

    console.log('📊 Parámetros:', { type, days, months })

    let dollarHistory: DollarHistoryPoint[] = []
    let inflationHistory: InflationHistoryPoint[] = []

    if (type === 'dollar' || type === 'all') {
      try {
        const dollarData = await getHistoricalDollarData(days)
        dollarHistory = dollarData.data || []
        console.log('💰 Dollar history loaded:', dollarHistory.length, 'points')
      } catch (error) {
        console.error('Error loading dollar history:', error)
      }
    }

    if (type === 'inflation' || type === 'all') {
      try {
        const inflationData = await getHistoricalInflationData(months)
        inflationHistory = inflationData.data || []
        console.log('📈 Inflation history loaded:', inflationHistory.length, 'points')
      } catch (error) {
        console.error('Error loading inflation history:', error)
      }
    }

    const response = {
      dollarHistory,
      inflationHistory,
      metadata: {
        source: 'ArgenStats + Generated Data',
        timestamp: new Date().toISOString(),
        dollarPoints: dollarHistory.length,
        inflationPoints: inflationHistory.length,
        parameters: { type, days, months }
      }
    }

    console.log('✅ Historical data response ready')

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
      }
    })

  } catch (error) {
    console.error('❌ Error en historical data route:', error)
    
    // Generar datos de fallback con tipos explícitos
    const dollarHistory: DollarHistoryPoint[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      
      const baseOficial = 1015 + (Math.random() - 0.5) * 20
      const baseBlue = baseOficial * (1.4 + Math.random() * 0.1)
      
      return {
        date: date.toISOString().split('T')[0],
        oficial: Math.round(baseOficial * 100) / 100,
        blue: Math.round(baseBlue * 100) / 100
      }
    })

    const inflationHistory: InflationHistoryPoint[] = [
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

    const fallbackResponse = {
      dollarHistory,
      inflationHistory,
      metadata: {
        source: 'Fallback data (API Error)',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        dollarPoints: dollarHistory.length,
        inflationPoints: inflationHistory.length
      }
    }

    return NextResponse.json(fallbackResponse, { status: 200 })
  }
}
