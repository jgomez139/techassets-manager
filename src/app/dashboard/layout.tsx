import Link from "next/link";
import { LayoutDashboard, Boxes, Users, Wrench, LogOut } from "lucide-react";

import LogoutButton from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="flex w-72 flex-col border-r bg-white shadow-sm">

        {/* LOGO */}
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-black">
            TechAssets
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gestión de Activos
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 p-4">

          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/categories"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            <Boxes size={20} />
            <span>Categorías</span>
          </Link>

          <Link
            href="/assets"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            <Boxes size={20} />
            <span>Activos</span>
          </Link>

          <Link
            href="/employees"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            <Users size={20} />
            <span>Empleados</span>
          </Link>

          <Link
            href="/maintenances"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            <Wrench size={20} />
            <span>Mantenimientos</span>
          </Link>

        </nav>

        {/* LOGOUT */}
        <div className="border-t p-4">
          <LogoutButton />
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}