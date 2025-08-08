import { NextRequest, NextResponse } from 'next/server'
import { getAllMainIndicators } from '@/lib/argenstats'

export async function GET(request: NextRequest) {
  console.log('📊 ArgenStats Main API Route - Starting...')
  
  try {
    // Usar la función optimizada para obtener todos los indicadores
    const allData = await getAllMainIndicators()
    
    console.log('📊 All data received:', {
      dollar: !!allData.dollar,
      inflation: !!allData.inflation,
      emae: !!allData.emae,
      riesgoPais: !!allData.riesgoPais,
      laborMarket: !!allData.laborMarket,
      successful: allData.metadata.successful_calls,
      failed: allData.metadata.failed_calls
    })

    // Extraer datos con manejo seguro de propiedades
    const dollarData = allData.dollar?.data?.[0] || {}
    const ipcData = allData.inflation?.data?.[0] || {}
    const emaeData = allData.emae?.data?.[0] || {}
    const riesgoPaisData = allData.riesgoPais?.data?.[0] || {}
    const laborData = allData.laborMarket?.data?.[0] || {}

    console.log('💰 Dollar Data:', { oficial: dollarData.oficial, blue: dollarData.blue })
    console.log('📈 IPC Data:', { monthly: ipcData.monthly_variation, annual: ipcData.annual_variation })
    console.log('⚡ EMAE Data:', { annual: emaeData.annual_variation, index: emaeData.index_value })
    console.log('🚨 Riesgo País:', { value: riesgoPaisData.value, variation: riesgoPaisData.variation })
    console.log('👥 Labor Data:', { unemployment: laborData.unemployment_rate })

    // Construir respuesta estructurada
    const response = {
      exchangeRates: {
        oficial: dollarData.oficial || 1015.50,
        blue: dollarData.blue || 1485.00,
        mep: dollarData.mep || 1205.00,
        ccl: dollarData.ccl || 1220.00,
        tarjeta: dollarData.tarjeta || 1625.00,
        date: dollarData.date || new Date().toISOString(),
        // Incluir variaciones si están disponibles
        variations: {
          oficial: dollarData.oficial_variation || 0,
          blue: dollarData.blue_variation || 0,
          mep: dollarData.mep_variation || 0,
          ccl: dollarData.ccl_variation || 0,
          tarjeta: dollarData.tarjeta_variation || 0
        }
      },
      inflation: {
        monthly: ipcData.monthly_variation || 2.5,
        annual: ipcData.annual_variation || 211.4,
        accumulated: ipcData.accumulated_variation || 45.2,
        index_value: ipcData.index_value || 7864.13,
        category: ipcData.category || 'Nivel General',
        region: ipcData.region || 'Nacional',
        date: ipcData.date || new Date().toISOString()
      },
      emae: {
        monthly: emaeData.monthly_variation || -0.5,
        annual: emaeData.annual_variation || 3.2,
        index: emaeData.index_value || 125.4,
        seasonally_adjusted: emaeData.seasonally_adjusted || 0,
        trend_cycle: emaeData.trend_cycle || 0,
        sector: emaeData.sector || 'Nivel General',
        date: emaeData.date || new Date().toISOString()
      },
      riesgoPais: {
        value: riesgoPaisData.value || 850,
        variation: riesgoPaisData.variation || -15,
        variation_pct: riesgoPaisData.variation_pct || -1.7,
        monthly_change: riesgoPaisData.monthly_change || 0,
        yearly_change: riesgoPaisData.yearly_change || 0,
        date: riesgoPaisData.date || new Date().toISOString()
      },
      laborMarket: {
        unemployment: laborData.unemployment_rate || 5.2,
        employment: laborData.employment_rate || 42.8,
        activity: laborData.activity_rate || 45.1,
        unemployment_change: laborData.unemployment_change || 0,
        employment_change: laborData.employment_change || 0,
        activity_change: laborData.activity_change || 0,
        data_type: laborData.data_type || 'nacional',
        date: laborData.date || new Date().toISOString()
      },
      metadata: {
        source: 'ArgenStats API v2',
        timestamp: new Date().toISOString(),
        successful_apis: allData.metadata.successful_calls,
        failed_apis: allData.metadata.failed_calls,
        api_status: {
          dollar: allData.dollar ? 'success' : 'failed',
          inflation: allData.inflation ? 'success' : 'failed',
          emae: allData.emae ? 'success' : 'failed',
          riesgo_pais: allData.riesgoPais ? 'success' : 'failed',
          labor_market: allData.laborMarket ? 'success' : 'failed'
        },
        // Incluir metadatos de cada API si están disponibles
        sources: {
          dollar: allData.dollar?.metadata?.source || 'Not available',
          inflation: allData.inflation?.metadata?.source || 'Not available',
          emae: allData.emae?.metadata?.source || 'Not available',
          riesgo_pais: allData.riesgoPais?.metadata?.source || 'Not available',
          labor_market: allData.laborMarket?.metadata?.source || 'Not available'
        }
      }
    }

    console.log('✅ Final response built:', {
      oficial: response.exchangeRates.oficial,
      blue: response.exchangeRates.blue,
      inflation: response.inflation.monthly,
      emae: response.emae.annual,
      riesgoPais: response.riesgoPais.value,
      successful_apis: response.metadata.successful_apis
    })
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('❌ Critical error in main API route:', error)
    
    // Fallback completo con datos realistas
    const fallbackResponse = {
      exchangeRates: {
        oficial: 1015.50,
        blue: 1485.00,
        mep: 1205.00,
        ccl: 1220.00,
        tarjeta: 1625.00,
        date: new Date().toISOString(),
        variations: { oficial: 0, blue: 0, mep: 0, ccl: 0, tarjeta: 0 }
      },
      inflation: {
        monthly: 2.5,
        annual: 211.4,
        accumulated: 45.2,
        index_value: 7864.13,
        category: 'Nivel General',
        region: 'Nacional',
        date: new Date().toISOString()
      },
      emae: {
        monthly: -0.5,
        annual: 3.2,
        index: 125.4,
        seasonally_adjusted: 128.5,
        trend_cycle: 127.2,
        sector: 'Nivel General',
        date: new Date().toISOString()
      },
      riesgoPais: {
        value: 850,
        variation: -15,
        variation_pct: -1.7,
        monthly_change: 25,
        yearly_change: 150,
        date: new Date().toISOString()
      },
      laborMarket: {
        unemployment: 5.2,
        employment: 42.8,
        activity: 45.1,
        unemployment_change: -0.2,
        employment_change: 0.3,
        activity_change: 0.1,
        data_type: 'nacional',
        date: new Date().toISOString()
      },
      metadata: {
        source: 'Fallback data (Critical API Error)',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        successful_apis: 0,
        failed_apis: 5,
        api_status: {
          dollar: 'failed',
          inflation: 'failed',
          emae: 'failed',
          riesgo_pais: 'failed',
          labor_market: 'failed'
        },
        sources: {
          dollar: 'Fallback',
          inflation: 'Fallback',
          emae: 'Fallback',
          riesgo_pais: 'Fallback',
          labor_market: 'Fallback'
        }
      }
    }
    
    return NextResponse.json(fallbackResponse, {
      status: 200, // Return 200 so frontend works
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
