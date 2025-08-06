'use client'

import { useState, useEffect } from 'react'
import { EconomicData, ApiResponse } from '@/lib/types'

export function useEconomicData() {
  const [data, setData] = useState<ApiResponse<EconomicData>>({
    data: {
      exchangeRate: { oficial: 0, blue: 0, date: '' },
      inflation: { monthly: 0, annual: 0, date: '' },
      interestRate: { rate: 0, date: '' },
      budget: { executed: 0, total: 0, percentage: 0 }
    },
    loading: true,
    error: undefined
  })

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: undefined }))
      
      // Llamadas paralelas a las APIs
      const [bcraResponse, seriesResponse, budgetResponse] = await Promise.allSettled([
        fetch('/api/bcra'),
        fetch('/api/series'),
        fetch('/api/presupuesto')
      ])

      const bcraData = bcraResponse.status === 'fulfilled' ? await bcraResponse.value.json() : null
      const seriesData = seriesResponse.status === 'fulfilled' ? await seriesResponse.value.json() : null
      const budgetData = budgetResponse.status === 'fulfilled' ? await budgetResponse.value.json() : null

      const economicData: EconomicData = {
        exchangeRate: {
          oficial: bcraData?.exchangeRate?.oficial || 0,
          blue: bcraData?.exchangeRate?.blue || 0,
          date: bcraData?.exchangeRate?.date || new Date().toISOString()
        },
        inflation: {
          monthly: seriesData?.inflation?.monthly || 0,
          annual: seriesData?.inflation?.annual || 0,
          date: seriesData?.inflation?.date || new Date().toISOString()
        },
        interestRate: {
          rate: bcraData?.interestRate?.rate || 0,
          date: bcraData?.interestRate?.date || new Date().toISOString()
        },
        budget: {
          executed: budgetData?.executed || 0,
          total: budgetData?.total || 0,
          percentage: budgetData?.percentage || 0
        }
      }

      setData({
        data: economicData,
        loading: false,
        error: undefined
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los datos económicos'
      }))
    }
  }

  useEffect(() => {
    fetchData()

    // Actualizar datos cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { ...data, refetch: fetchData }
            }
