import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard Economía Argentina',
  description: 'Panel de control con indicadores económicos de Argentina en tiempo real',
  keywords: 'economía, argentina, BCRA, inflación, dólar, presupuesto',
  authors: [{ name: 'Dashboard Argentina' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-gradient-to-r from-argentina-blue to-primary-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">🇦🇷 Dashboard Economía Argentina</h1>
            <p className="text-blue-100 mt-2">Indicadores económicos en tiempo real</p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-12">
          <p>Datos obtenidos de APIs oficiales del Gobierno Argentino</p>
        </footer>
      </body>
    </html>
  )
}
