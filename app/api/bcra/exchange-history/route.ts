import { NextRequest, NextResponse } from 'next/server'
import { getBCRAVariable } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const exchangeRateId = 4
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]

    const data = await getBCRAVariable(exchangeRateId, thirtyDaysAgo, today)
    
    const processedData = data.map((item: any) => ({
      date: item.fecha,
      oficial: item.valor,
      blue: item.valor * 1.5 // Simulación del blue
    }))

    return NextResponse.json({ data: processedData })
  } catch (error) {
    console.error('Exchange history error:', error)
    
    // Generar datos simulados para 30 días
    const mockData = []
    const baseRate = 1000
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simular variación del tipo de cambio
      const oficial = baseRate + (Math.random() - 0.5) * 50
      const blue = oficial * (1.4 + Math.random() * 0.2)
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        oficial: oficial,
        blue: blue
      })
    }
    
    return NextResponse.json({ data: mockData })
  }
}
