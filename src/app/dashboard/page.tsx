"use client";

import { useEffect, useMemo, useState } from "react";

import {
  assetStatusColors,
  assetStatusLabels,
} from "@/lib/asset-status";

interface Asset {
  id: string;

  name: string;

  serialNumber: string;

  status: string;

  createdAt: string;

  category?: {
    name: string;
  };
}

interface Employee {
  id: string;
}

interface Assignment {
  id: string;

  returnedAt?: string | null;
}

interface Maintenance {
  id: string;

  status: string;
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

  useEffect(() => {

    async function loadData() {

      try {

        const [
          assetsRes,
          employeesRes,
          assignmentsRes,
          maintenancesRes,
        ] = await Promise.all([

          fetch("/api/assets", {
            credentials: "include",
          }),

          fetch("/api/employees", {
            credentials: "include",
          }),

          fetch("/api/assignments", {
            credentials: "include",
          }),

          fetch("/api/maintenances", {
            credentials: "include",
          }),
        ]);

        const assetsData =
          await assetsRes.json();

        const employeesData =
          await employeesRes.json();

        const assignmentsData =
          await assignmentsRes.json();

        const maintenancesData =
          await maintenancesRes.json();

        setAssets(
          Array.isArray(
            assetsData
          )
            ? assetsData
            : []
        );

        setEmployees(
          Array.isArray(
            employeesData
          )
            ? employeesData
            : []
        );

        setAssignments(
          Array.isArray(
            assignmentsData
          )
            ? assignmentsData
            : []
        );

        setMaintenances(
          Array.isArray(
            maintenancesData
          )
            ? maintenancesData
            : []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    loadData();

  }, []);

  const activeAssignments =
    assignments.filter(
      (assignment) =>
        !assignment.returnedAt
    ).length;

  const pendingMaintenances =
    maintenances.filter(
      (maintenance) =>
        maintenance.status !==
        "COMPLETED"
    ).length;

  const latestAssets =
    useMemo(() => {

      return [...assets]

        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )

        .slice(0, 5);

    }, [assets]);

  if (loading) {

    return (

      <div className="flex items-center justify-center py-20">

        <p className="text-lg text-gray-500">

          Cargando dashboard...

        </p>

      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          Dashboard

        </h1>

        <p className="text-gray-500">

          Resumen general del sistema

        </p>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* Assets */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">

            Total activos

          </p>

          <h2 className="mt-2 text-3xl font-bold">

            {assets.length}

          </h2>

        </div>

        {/* Employees */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">

            Empleados

          </p>

          <h2 className="mt-2 text-3xl font-bold">

            {employees.length}

          </h2>

        </div>

        {/* Assignments */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">

            Asignaciones activas

          </p>

          <h2 className="mt-2 text-3xl font-bold">

            {activeAssignments}

          </h2>

        </div>

        {/* Maintenances */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">

            Mantenimientos pendientes

          </p>

          <h2 className="mt-2 text-3xl font-bold">

            {pendingMaintenances}

          </h2>

        </div>

      </div>

      {/* Latest assets */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-xl font-bold">

            Últimos activos

          </h2>

        </div>

        {latestAssets.length === 0 ? (

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

                    Serial

                  </th>

                  <th className="p-3">

                    Categoría

                  </th>

                  <th className="p-3">

                    Estado

                  </th>

                  <th className="p-3">

                    Fecha

                  </th>

                </tr>

              </thead>

              <tbody>

                {latestAssets.map(
                  (asset) => (

                    <tr
                      key={asset.id}
                      className="border-b"
                    >

                      {/* Nombre */}

                      <td className="p-3 font-medium">

                        {asset.name}

                      </td>

                      {/* Serial */}

                      <td className="p-3">

                        {asset.serialNumber}

                      </td>

                      {/* Categoria */}

                      <td className="p-3">

                        {
                          asset.category
                            ?.name ||
                          "Sin categoría"
                        }

                      </td>

                      {/* Estado */}

                      <td className="p-3">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            assetStatusColors[
                              asset.status as keyof typeof assetStatusColors
                            ]
                          }`}
                        >

                          {
                            assetStatusLabels[
                              asset.status as keyof typeof assetStatusLabels
                            ]
                          }

                        </span>

                      </td>

                      {/* Fecha */}

                      <td className="p-3">

                        {new Date(
                          asset.createdAt
                        ).toLocaleDateString()}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}