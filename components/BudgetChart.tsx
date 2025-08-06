'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useState, useEffect } from 'react'

interface BudgetData {
  name: string
  value: number
  color: string
}

export default function BudgetChart() {
  const [data, setData] = useState<BudgetData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/presupuesto/execution')
        const result = await response.json()
        
        const budgetData = [
          { name: 'Ejecutado', value: result.executed || 0, color: '#10B981' },
          { name: 'Pendiente', value: (result.total || 0) - (result.executed || 0), color: '#E5E7EB' }
        ]
        
        setData(budgetData)
      } catch (error) {
        console.error('Error loading budget data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Ejecución Presupuestaria</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Ejecución Presupuestaria {new Date().getFullYear()}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
