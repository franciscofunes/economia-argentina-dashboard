import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard Economía Argentina | ArgenStats',
  description: 'Dashboard moderno con indicadores económicos de Argentina en tiempo real. Datos oficiales del INDEC via ArgenStats API.',
  keywords: 'economía, argentina, INDEC, ArgenStats, inflación, dólar, EMAE, riesgo país, dashboard',
  authors: [{ name: 'Dashboard Argentina' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Dashboard Economía Argentina',
    description: 'Indicadores económicos oficiales de Argentina en tiempo real',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
