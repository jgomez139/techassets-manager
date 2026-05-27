"use client";

import { useEffect, useState } from "react";

import DashboardStats from "@/components/dashboard/dashboard-stats";

import DashboardCharts from "@/components/dashboard/dashboard-charts";


interface Asset {
  id: string;

  name: string;

  status: string;

  category?: {
    name: string;
  };

  createdAt: string;
}


interface Employee {
  id: string;
}


interface Assignment {
  id: string;
}


interface Maintenance {
  id: string;

  type: string;
}


function formatStatus(
  status: string
) {

  switch (status) {

    case "IN_STORAGE":
      return "En almacén";

    case "IN_USE":
      return "En uso";

    case "UNDER_REPAIR":
      return "En reparación";

    case "DISPOSED":
      return "Dado de baja";

    default:
      return status;
  }
}


export default function DashboardPage() {

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [maintenances, setMaintenances] =
    useState<Maintenance[]>([]);

  const [loading, setLoading] =
    useState(true);


  async function loadData() {

    try {

      const [
        assetsRes,
        employeesRes,
        assignmentsRes,
        maintenancesRes,
      ] = await Promise.all([
        fetch("/api/assets"),

        fetch("/api/employees"),

        fetch("/api/assignments"),

        fetch("/api/maintenances"),
      ]);

      const assetsData =
        await assetsRes.json();

      const employeesData =
        await employeesRes.json();

      const assignmentsData =
        await assignmentsRes.json();

      const maintenancesData =
        await maintenancesRes.json();

      setAssets(assetsData);

      setEmployees(
        employeesData
      );

      setAssignments(
        assignmentsData
      );

      setMaintenances(
        maintenancesData
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);


  if (loading) {

    return (
      <div>
        Cargando dashboard...
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Resumen general del sistema
        </p>

      </div>

      {/* Estadísticas */}

      <DashboardStats
        assets={assets}
        employees={employees}
        assignments={assignments}
        maintenances={maintenances}
      />

      {/* Charts */}

      <DashboardCharts
        assets={assets}
        maintenances={
          maintenances
        }
      />

      {/* Últimos activos */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold">
          Últimos activos
        </h2>

        {assets.length === 0 ? (

          <p className="text-gray-500">
            No hay activos registrados.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="p-3">
                    Nombre
                  </th>

                  <th className="p-3">
                    Estado
                  </th>

                  <th className="p-3">
                    Categoría
                  </th>

                  <th className="p-3">
                    Fecha
                  </th>

                </tr>

              </thead>

              <tbody>

                {assets
                  .slice(0, 5)
                  .map((asset) => (

                    <tr
                      key={asset.id}
                      className="border-b"
                    >

                      <td className="p-3 font-medium">

                        {asset.name}

                      </td>

                      <td className="p-3">

                        {formatStatus(
                          asset.status
                        )}

                      </td>

                      <td className="p-3">

                        {asset.category
                          ?.name ||
                          "Sin categoría"}

                      </td>

                      <td className="p-3">

                        {new Date(
                          asset.createdAt
                        ).toLocaleDateString()}

                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}