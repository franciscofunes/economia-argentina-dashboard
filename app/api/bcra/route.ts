import { NextRequest, NextResponse } from 'next/server'
import { getBCRAVariable } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    // Variables del BCRA oficial
    // Tipo de cambio USD oficial - Variable ID: Consultar metadatos
    const exchangeRateId = 4 // Ejemplo - verificar con metadatos reales
    const interestRateId = 6 // Ejemplo - verificar con metadatos reales

    const [exchangeData, interestData] = await Promise.allSettled([
      getBCRAVariable(exchangeRateId),
      getBCRAVariable(interestRateId)
    ])

    const exchangeRate = exchangeData.status === 'fulfilled' 
      ? exchangeData.value[exchangeData.value.length - 1] 
      : null

    const interestRate = interestData.status === 'fulfilled' 
      ? interestData.value[interestData.value.length - 1] 
      : null

    // Simulamos dólar blue (en producción usar otra API)
    const blueRate = exchangeRate ? exchangeRate.valor * 1.5 : 1200

    const response = {
      exchangeRate: {
        oficial: exchangeRate?.valor || 1000,
        blue: blueRate,
        date: exchangeRate?.fecha || new Date().toISOString()
      },
      interestRate: {
        rate: interestRate?.valor || 75,
        date: interestRate?.fecha || new Date().toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('BCRA API error:', error)
    
    // Fallback con datos simulados
    const fallbackResponse = {
      exchangeRate: {
        oficial: 1000,
        blue: 1500,
        date: new Date().toISOString()
      },
      interestRate: {
        rate: 75,
        date: new Date().toISOString()
      }
    }
    
    return NextResponse.json(fallbackResponse)
  }
}
