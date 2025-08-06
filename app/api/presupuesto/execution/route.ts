import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulación de ejecución presupuestaria por áreas
    const totalBudget = 50000000000000
    const executedBudget = totalBudget * 0.65
    
    const response = {
      executed: executedBudget,
      total: totalBudget,
      areas: [
        { name: 'Salud', executed: executedBudget * 0.25, total: totalBudget * 0.25 },
        { name: 'Educación', executed: executedBudget * 0.20, total: totalBudget * 0.20 },
        { name: 'Seguridad', executed: executedBudget * 0.15, total: totalBudget * 0.15 },
        { name: 'Infraestructura', executed: executedBudget * 0.20, total: totalBudget * 0.20 },
        { name: 'Otros', executed: executedBudget * 0.20, total: totalBudget * 0.20 }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Budget execution error:', error)
    
    const fallbackResponse = {
      executed: 32500000000000,
      total: 50000000000000,
      areas: []
    }
    
    return NextResponse.json(fallbackResponse)
  }
}
