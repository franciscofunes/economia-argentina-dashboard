import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateString
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value)
}

export function getChangeColor(value: number): string {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-600'
}

export function getChangeIcon(value: number): string {
  if (value > 0) return '↗'
  if (value < 0) return '↘'
  return '→'
}
