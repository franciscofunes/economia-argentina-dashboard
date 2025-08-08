import { NextRequest, NextResponse } from 'next/server'
import { getAllMainIndicators } from '@/lib/argenstats'

// TypeScript interfaces for safety
interface DollarData {
  oficial?: number
  blue?: number
  mep?: number
  ccl?: number
  tarjeta?: number
  date?: string
  oficial_variation?: number
  blue_variation?: number
  mep_variation?: number
  ccl_variation?: number
  tarjeta_variation?: number
}

interface InflationData {
  monthly_variation?: number
  annual_variation?: number
  accumulated_variation?: number
  index_value?: number
  category?: string
  region?: string
  date?: string
}

interface EmaeData {
  monthly_variation?: number
  annual_variation?: number
  index_value?: number
  seasonally_adjusted?: number
  trend_cycle?: number
  sector?: string
  date?: string
}

interface RiesgoPaisData {
  value?: number
  variation?: number
  variation_pct?: number
  monthly_change?: number
  yearly_change?: number
  date?: string
}

interface LaborData {
  unemployment_rate?: number
  employment_rate?: number
  activity_rate?: number
  unemployment_change?: number
  employment_change?: number
  activity_change?: number
  data_type?: string
  date?: string
}

export async function GET(request: NextRequest) {
  console.log('📊 ArgenStats Main API Route - Starting with API key support...')
  
  try {
    // Check if API key is available
    if (process.env.ARGENSTATS_API_KEY) {
      console.log('🔑 API key found, fetching real data from ArgenStats')
    } else {
      console.log('⚠️ No API key found, using fallback data')
    }

    // Get all indicators using our improved library
    const allData = await getAllMainIndicators()
    
    console.log('📊 All data received:', {
      dollar: !!allData.dollar,
      inflation: !!allData.inflation,
      emae: !!allData.emae,
      riesgoPais: !!allData.riesgoPais,
      laborMarket: !!allData.laborMarket,
      successful: allData.metadata.successful_calls,
      failed: allData.metadata.failed_calls,
      has_api_key: allData.metadata.has_api_key
    })

    // Extract data with explicit types and safe property access
    const dollarData: DollarData = (allData.dollar?.data?.[0] as DollarData) || {}
    const ipcData: InflationData = (allData.inflation?.data?.[0] as InflationData) || {}
    const emaeData: EmaeData = (allData.emae?.data?.[0] as EmaeData) || {}
    const riesgoPaisData: RiesgoPaisData = (allData.riesgoPais?.data?.[0] as RiesgoPaisData) || {}
    const laborData: LaborData = (allData.laborMarket?.data?.[0] as LaborData) || {}

    console.log('💰 Dollar Data processed:', { 
      oficial: dollarData.oficial, 
      blue: dollarData.blue,
      source: allData.dollar?.metadata?.source,
      hasRealData: !!dollarData.oficial && dollarData.oficial !== 1015.5
    })
    
    console.log('📈 IPC Data processed:', { 
      monthly: ipcData.monthly_variation, 
      annual: ipcData.annual_variation,
      source: allData.inflation?.metadata?.source,
      hasRealData: !!ipcData.monthly_variation && ipcData.monthly_variation !== 2.5
    })
    
    console.log('⚡ EMAE Data processed:', { 
      annual: emaeData.annual_variation, 
      index: emaeData.index_value,
      source: allData.emae?.metadata?.source,
      hasRealData: !!emaeData.index_value && emaeData.index_value !== 125.4
    })

    // Build structured response with real data
    const response = {
      exchangeRates: {
        oficial: dollarData.oficial || 1290,  // Use real fallback from debug data
        blue: dollarData.blue || 1325,       // Use real fallback from debug data
        mep: dollarData.mep || 1332,         // Use real fallback from debug data
        ccl: dollarData.ccl || 1331,        // Use real fallback from debug data
        tarjeta: dollarData.tarjeta || 1742, // Use real fallback from debug data
        date: dollarData.date || new Date().toISOString(),
        variations: {
          oficial: dollarData.oficial_variation || 0,
          blue: dollarData.blue_variation || 0,
          mep: dollarData.mep_variation || 0,
          ccl: dollarData.ccl_variation || 0,
          tarjeta: dollarData.tarjeta_variation || 0
        }
      },
      inflation: {
        monthly: ipcData.monthly_variation || 2.2,  // Use more realistic current value
        annual: ipcData.annual_variation || 84.5,   // Use more realistic current value
        accumulated: ipcData.accumulated_variation || 15.1,
        index_value: ipcData.index_value || 8855.57, // Real value from debug data
        category: ipcData.category || 'Nivel General',
        region: ipcData.region || 'Nacional',
        date: ipcData.date || new Date().toISOString()
      },
      emae: {
        monthly: emaeData.monthly_variation || -0.07,  // Real value from debug data
        annual: emaeData.annual_variation || 4.98,     // Real value from debug data
        index: emaeData.index_value || 164.58,         // Real value from debug data
        seasonally_adjusted: emaeData.seasonally_adjusted || 153.07,
        trend_cycle: emaeData.trend_cycle || 154.09,
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
        source: 'ArgenStats API v2 with API Key',
        timestamp: new Date().toISOString(),
        successful_apis: allData.metadata.successful_calls,
        failed_apis: allData.metadata.failed_calls,
        has_api_key: allData.metadata.has_api_key || !!process.env.ARGENSTATS_API_KEY,
        api_status: {
          dollar: allData.dollar ? 'success' : 'failed',
          inflation: allData.inflation ? 'success' : 'failed',
          emae: allData.emae ? 'success' : 'failed',
          riesgo_pais: allData.riesgoPais ? 'success' : 'failed',
          labor_market: allData.laborMarket ? 'success' : 'failed'
        },
        sources: {
          dollar: allData.dollar?.metadata?.source || 'Fallback',
          inflation: allData.inflation?.metadata?.source || 'Fallback',
          emae: allData.emae?.metadata?.source || 'Fallback',
          riesgo_pais: allData.riesgoPais?.metadata?.source || 'Fallback',
          labor_market: allData.laborMarket?.metadata?.source || 'Fallback'
        },
        real_data_indicators: {
          dollar_is_real: allData.dollar?.metadata?.source?.includes('ArgenStats API') || false,
          inflation_is_real: allData.inflation?.metadata?.source?.includes('ArgenStats API') || false,
          emae_is_real: allData.emae?.metadata?.source?.includes('ArgenStats API') || false,
          riesgo_pais_is_real: allData.riesgoPais?.metadata?.source?.includes('ArgenStats API') || false
        }
      }
    }

    console.log('✅ Final response built with real data:', {
      oficial: response.exchangeRates.oficial,
      blue: response.exchangeRates.blue,
      inflation_monthly: response.inflation.monthly,
      emae_annual: response.emae.annual,
      emae_index: response.emae.index,
      successful_apis: response.metadata.successful_apis,
      has_api_key: response.metadata.has_api_key,
      real_data: response.metadata.real_data_indicators
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
    
    // Enhanced fallback with more realistic data based on debug results
    const fallbackResponse = {
      exchangeRates: {
        oficial: 1290,  // From real debug data
        blue: 1325,     // From real debug data  
        mep: 1332,      // From real debug data
        ccl: 1331,      // From real debug data
        tarjeta: 1742,  // From real debug data
        date: new Date().toISOString(),
        variations: { oficial: 0, blue: 0, mep: 0, ccl: 0, tarjeta: 0 }
      },
      inflation: {
        monthly: 2.2,
        annual: 84.5,
        accumulated: 15.1,
        index_value: 8855.57, // From real debug data
        category: 'Nivel General',
        region: 'Nacional',
        date: new Date().toISOString()
      },
      emae: {
        monthly: -0.07,  // From real debug data
        annual: 4.98,    // From real debug data
        index: 164.58,   // From real debug data
        seasonally_adjusted: 153.07,
        trend_cycle: 154.09,
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
        source: 'Enhanced fallback with real data points',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        successful_apis: 0,
        failed_apis: 5,
        has_api_key: !!process.env.ARGENSTATS_API_KEY,
        api_status: {
          dollar: 'failed',
          inflation: 'failed',
          emae: 'failed',
          riesgo_pais: 'failed',
          labor_market: 'failed'
        },
        sources: {
          dollar: 'Enhanced Fallback',
          inflation: 'Enhanced Fallback',
          emae: 'Enhanced Fallback',
          riesgo_pais: 'Enhanced Fallback',
          labor_market: 'Enhanced Fallback'
        },
        real_data_indicators: {
          dollar_is_real: false,
          inflation_is_real: false,
          emae_is_real: false,
          riesgo_pais_is_real: false
        }
      }
    }
    
    return NextResponse.json(fallbackResponse, {
      status: 200,
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
