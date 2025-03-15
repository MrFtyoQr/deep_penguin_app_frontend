import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  },
  eslint: {
    ignoreDuringBuilds: true, // Evita que errores de ESLint detengan el build en producción
  },
  poweredByHeader: false, // Oculta el header "X-Powered-By: Next.js" para mayor seguridad
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Elimina `console.log` en producción
  },
  reactStrictMode: true, // Activa el modo estricto de React
  async headers() {
    return [
      {
        source: '/(.*)', // Aplica los headers a todas las rutas
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // Previene ataques de clickjacking
          { key: 'X-Content-Type-Options', value: 'nosniff' }, // Evita que se infiera el tipo MIME
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // Mejora la privacidad del usuario
          { key: 'Permissions-Policy', value: "geolocation=(), microphone=(), camera=()" }, // Bloquea permisos innecesarios
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, // Fuerza HTTPS
        ],
      },
    ];
  },
};

export default nextConfig;
