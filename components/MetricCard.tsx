import { LucideIcon } from 'lucide-react'
import { formatCurrency, formatPercentage, getChangeColor, getChangeIcon } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: number
  change?: number
  icon: LucideIcon
  format?: 'currency' | 'percentage' | 'number'
  subtitle?: string
  loading?: boolean
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  format = 'number',
  subtitle,
  loading = false 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return formatPercentage(val)
      default:
        return val.toLocaleString('es-AR')
    }
  }

  if (loading) {
    return (
      <div className="metric-card animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    )
  }

  return (
    <div className="metric-card group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="h-8 w-8 text-primary-500 group-hover:scale-110 transition-transform duration-200" />
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </p>
        
        {change !== undefined && (
          <div className={`flex items-center text-sm ${getChangeColor(change)}`}>
            <span className="mr-1">{getChangeIcon(change)}</span>
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
        
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
