'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState, useEffect } from 'react'

interface ExchangeRateData {
  date: string
  oficial: number
  blue: number
}

export default function ExchangeRateChart() {
  const [data, setData] = useState<ExchangeRateData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bcra/exchange-history')
        const result = await response.json()
        setData(result.data || [])
      } catch (error) {
        console.error('Error loading exchange rate data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Evolución Tipo de Cambio</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Evolución Tipo de Cambio (Últimos 30 días)</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('es-AR')}
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'oficial' ? 'Oficial' : 'Blue']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="oficial" 
              stroke="#74ACDF" 
              strokeWidth={2} 
              name="Oficial"
              dot={{ fill: '#74ACDF', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="blue" 
              stroke="#EF4444" 
              strokeWidth={2} 
              name="Blue"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
