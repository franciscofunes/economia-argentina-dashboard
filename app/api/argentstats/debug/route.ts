import { NextRequest, NextResponse } from 'next/server'

// Create this file: /app/api/argentstats/debug/route.ts
// Fixed TypeScript errors

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: []
  }
  
  // Test each ArgenStats endpoint directly
  const endpoints = [
    { name: 'Dollar', url: 'https://argenstats.com/api/dollar' },
    { name: 'IPC', url: 'https://argenstats.com/api/ipc' },
    { name: 'EMAE', url: 'https://argenstats.com/api/emae/latest' },
    { name: 'Riesgo País', url: 'https://argenstats.com/api/riesgo-pais' }
  ]
  
  for (const endpoint of endpoints) {
    const test: any = {
      name: endpoint.name,
      url: endpoint.url,
      status: 'unknown',
      response: null,
      error: null,
      timing: 0
    }
    
    try {
      const startTime = Date.now()
      
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Dashboard-Argentina-Debug/1.0',
          // Add API key if available
          ...(process.env.ARGENSTATS_API_KEY && {
            'x-api-key': process.env.ARGENSTATS_API_KEY
          })
        }
      })
      
      test.timing = Date.now() - startTime
      test.status = response.status
      
      if (response.ok) {
        const text = await response.text()
        test.responseText = text.substring(0, 500) // First 500 chars
        
        try {
          test.response = JSON.parse(text)
          test.success = true
        } catch (parseError) {
          test.error = 'Invalid JSON response'
          test.parseError = parseError instanceof Error ? parseError.message : String(parseError)
        }
      } else {
        test.error = `HTTP ${response.status}: ${response.statusText}`
        test.success = false
      }
      
    } catch (error) {
      test.error = error instanceof Error ? error.message : String(error)
      test.success = false
      test.timing = 0
    }
    
    results.tests.push(test)
  }
  
  // Summary
  results.summary = {
    total: results.tests.length,
    successful: results.tests.filter((t: any) => t.success).length,
    failed: results.tests.filter((t: any) => !t.success).length,
    avgResponseTime: results.tests.reduce((sum: number, t: any) => sum + (t.timing || 0), 0) / results.tests.length,
    api_key_available: !!process.env.ARGENSTATS_API_KEY,
    api_key_used: !!process.env.ARGENSTATS_API_KEY
  }
  
  return NextResponse.json(results, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
