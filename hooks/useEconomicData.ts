'use client'

import { useState, useEffect } from 'react'
import { EconomicData } from '@/lib/types'

interface UseEconomicDataReturn {
  data: EconomicData
  loading: boolean
  error?: string
  refetch: () => Promise<void>
}

const defaultData: EconomicData = {
  exchangeRates: { oficial: 0, blue: 0, mep: 0, ccl: 0, tarjeta: 0, date: '' },
  inflation: { monthly: 0, annual: 0, accumulated: 0, date: '' },
  emae: { monthly: 0, annual: 0, index: 0, date: '' },
  riesgoPais: { value: 0, variation: 0, date: '' },
  laborMarket: { unemployment: 0, employment: 0, activity: 0, date: '' }
}

export function useEconomicData(): UseEconomicDataReturn {
  const [data, setData] = useState<EconomicData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(undefined)
      
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
        exchangeRates: {
          oficial: bcraData?.exchangeRate?.oficial || 0,
          blue: bcraData?.exchangeRate?.blue || 0,
          mep: bcraData?.exchangeRate?.mep || 0,
          ccl: bcraData?.exchangeRate?.ccl || 0,
          tarjeta: bcraData?.exchangeRate?.tarjeta || 0,
          date: bcraData?.exchangeRate?.date || new Date().toISOString()
        },
        inflation: {
          monthly: seriesData?.inflation?.monthly || 0,
          annual: seriesData?.inflation?.annual || 0,
          accumulated: seriesData?.inflation?.accumulated || 0,
          date: seriesData?.inflation?.date || new Date().toISOString()
        },
        emae: {
          monthly: bcraData?.emae?.monthly || 0,
          annual: bcraData?.emae?.annual || 0,
          index: bcraData?.emae?.index || 0,
          date: bcraData?.emae?.date || new Date().toISOString()
        },
        riesgoPais: {
          value: bcraData?.riesgoPais?.value || 0,
          variation: bcraData?.riesgoPais?.variation || 0,
          date: bcraData?.riesgoPais?.date || new Date().toISOString()
        },
        laborMarket: {
          unemployment: bcraData?.laborMarket?.unemployment || 0,
          employment: bcraData?.laborMarket?.employment || 0,
          activity: bcraData?.laborMarket?.activity || 0,
          date: bcraData?.laborMarket?.date || new Date().toISOString()
        }
      }

      setData(economicData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos económicos'
      setError(errorMessage)
      console.error('Error in useEconomicData:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Actualizar datos cada 5 minutos
    const interval = setInterval(() => {
      fetchData().catch(console.error)
    }, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData 
  }
}
