/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  // Configuración para optimizar el build
  typescript: {
    ignoreBuildErrors: false, // Mantener strict TypeScript
  },
  eslint: {
    ignoreDuringBuilds: false, // Mantener ESLint activo
  },
}

module.exports = nextConfig
