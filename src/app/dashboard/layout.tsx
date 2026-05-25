import Link from "next/link";

import LogoutButton from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}

      <aside className="w-64 bg-black text-white">
        <div className="border-b border-gray-800 p-6">
          <h1 className="text-2xl font-bold">
            TechAssets
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Gestión de activos
          </p>
        </div>

        {/* Menu */}

        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Dashboard
          </Link>

          <Link
            href="/categories"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Categorías
          </Link>

          <Link
            href="/assets"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Activos
          </Link>

          <Link
            href="/employees"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Empleados
          </Link>

          <Link
            href="/assignments"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Asignaciones
          </Link>

          <Link
            href="/maintenances"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Mantenimientos
          </Link>
        </nav>

        {/* Logout */}

        <div className="absolute bottom-0 w-64 border-t border-gray-800 p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Content */}

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}