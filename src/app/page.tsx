import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
        
        <h1 className="mb-2 text-center text-4xl font-bold">
          TechAssets Manager
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Sistema de Gestión de Activos Tecnológicos
        </p>

        <div className="flex flex-col gap-4">
          
          <Link
            href="/login"
            className="rounded-lg bg-black px-4 py-3 text-center text-white transition hover:bg-gray-800"
          >
            Iniciar Sesión
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-black px-4 py-3 text-center transition hover:bg-gray-100"
          >
            Registrarse
          </Link>

        </div>
      </div>
    </main>
  );
}