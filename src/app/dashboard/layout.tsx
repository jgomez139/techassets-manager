import Link from "next/link";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

import LogoutButton from "@/components/auth/logout-button";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore =
    await cookies();

  // =========================
  // LEER ACCESS TOKEN
  // =========================

  const token =
    cookieStore.get(
      "accessToken"
    )?.value;

  // =========================
  // ROLE POR DEFECTO
  // =========================

  let role = "EMPLOYEE";

  // =========================
  // VERIFICAR JWT
  // =========================

  if (token) {

    try {

      const { payload } =
        await jwtVerify(
          token,
          secret
        );

      role =
        payload.role as string;

    } catch (error) {

      console.error(
        "Error verificando token:",
        error
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="relative w-64 bg-black text-white">

        {/* Header */}

        <div className="border-b border-gray-800 p-6">

          <h1 className="text-2xl font-bold">
            TechAssets
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Gestión de activos
          </p>

          {/* Role */}

          <div className="mt-4 rounded-lg bg-gray-800 px-3 py-2 text-sm">

            Rol:{" "}

            <span className="font-semibold text-blue-400">

              {role}

            </span>

          </div>

        </div>

        {/* =========================
            MENU
        ========================= */}

        <nav className="flex flex-col gap-2 p-4">

          {/* Dashboard */}

          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
          >
            Dashboard
          </Link>

          {/* =========================
              ADMIN
          ========================= */}

          {role === "ADMIN" && (
            <>

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

            </>
          )}

          {/* =========================
              TECHNICIAN
          ========================= */}

          {role === "TECHNICIAN" && (
            <>

              <Link
                href="/maintenances"
                className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
              >
                Mantenimientos
              </Link>

            </>
          )}

          {/* =========================
              SUPERVISOR
          ========================= */}

          {role === "SUPERVISOR" && (
            <>

              <Link
                href="/assets"
                className="rounded-lg px-4 py-3 transition hover:bg-gray-800"
              >
                Activos
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

            </>
          )}

        </nav>

        {/* =========================
            LOGOUT
        ========================= */}

        <div className="absolute bottom-0 w-64 border-t border-gray-800 p-4">

          <LogoutButton />

        </div>

      </aside>

      {/* =========================
          CONTENT
      ========================= */}

      <main className="flex-1 p-8">

        {children}

      </main>

    </div>
  );
}