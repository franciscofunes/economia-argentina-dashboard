'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

interface InflationData {
  month: string
  value: number
}

export default function InflationChart() {
  const [data, setData] = useState<InflationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/series/inflation-history')
        const result = await response.json()
        setData(result.data || [])
      } catch (error) {
        console.error('Error loading inflation data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Inflación Mensual</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Inflación Mensual (Últimos 12 meses)</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Inflación']}
            />
            <Bar 
              dataKey="value" 
              fill="#FCDC00" 
              stroke="#F59E0B"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
