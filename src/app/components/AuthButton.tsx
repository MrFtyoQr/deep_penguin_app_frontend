'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export default function AuthButton() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <p className="text-gray-500">Cargando...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div>
      {!user ? (
        <Link href="/api/auth/login" className="text-sm font-medium hover:text-blue-600">
          Iniciar Sesión
        </Link>
      ) : (
        <Link href="/api/auth/logout" className="text-sm font-medium hover:text-red-600">
          Cerrar Sesión ({user?.name ?? 'Usuario'})
        </Link>
      )}
    </div>
  );
}
