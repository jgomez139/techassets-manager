"use client";

import { useEffect, useState } from "react";

import MaintenanceForm from "@/components/maintenances/maintenance-form";

import {
  maintenanceStatusColors,
  maintenanceStatusLabels,
  maintenanceTypeLabels,
} from "@/lib/maintenance-status";


interface Maintenance {
  id: string;

  description: string;

  maintenanceDate: string;

  cost?: number;

  status: string;

  type: string;

  technicianName: string;

  asset: {
    name: string;
  };
}


export default function MaintenancesPage() {

  const [maintenances, setMaintenances] =
    useState<Maintenance[]>([]);

  const [loading, setLoading] =
    useState(true);


  async function loadMaintenances() {

    try {

      const res = await fetch(
        "/api/maintenances"
      );

      const data =
        await res.json();

      setMaintenances(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }


  async function completeMaintenance(
    id: string
  ) {

    try {

      const res = await fetch(
        `/api/maintenances/${id}`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {

        alert(
          "Error completando mantenimiento"
        );

        return;
      }

      loadMaintenances();

    } catch (error) {

      console.error(error);

      alert(
        "Error completando mantenimiento"
      );
    }
  }


  useEffect(() => {
    loadMaintenances();
  }, []);


  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Mantenimientos
        </h1>

        <p className="text-gray-500">
          Gestión de mantenimientos técnicos
        </p>

      </div>

      {/* Formulario */}

      <MaintenanceForm
        onSaved={
          loadMaintenances
        }
      />

      {/* Tabla */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold">
          Historial de mantenimientos
        </h2>

        {loading ? (

          <p>
            Cargando...
          </p>

        ) : maintenances.length === 0 ? (

          <p className="text-gray-500">
            No hay mantenimientos registrados.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="p-3">
                    Activo
                  </th>

                  <th className="p-3">
                    Técnico
                  </th>

                  <th className="p-3">
                    Tipo
                  </th>

                  <th className="p-3">
                    Estado
                  </th>

                  <th className="p-3">
                    Fecha
                  </th>

                  <th className="p-3">
                    Costo
                  </th>

                  <th className="p-3">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {maintenances.map(
                  (
                    maintenance
                  ) => (

                    <tr
                      key={
                        maintenance.id
                      }
                      className="border-b"
                    >

                      {/* Activo */}

                      <td className="p-3">

                        {
                          maintenance
                            .asset.name
                        }

                      </td>

                      {/* Técnico */}

                      <td className="p-3">

                        {
                          maintenance
                            .technicianName
                        }

                      </td>

                      {/* Tipo */}

                      <td className="p-3">

                        {
                          maintenanceTypeLabels[
                            maintenance.type as keyof typeof maintenanceTypeLabels
                          ]
                        }

                      </td>

                      {/* Estado */}

                      <td className="p-3">

                        <span
                          className={`rounded px-2 py-1 text-sm ${
                            maintenanceStatusColors[
                              maintenance.status as keyof typeof maintenanceStatusColors
                            ]
                          }`}
                        >

                          {
                            maintenanceStatusLabels[
                              maintenance.status as keyof typeof maintenanceStatusLabels
                            ]
                          }

                        </span>

                      </td>

                      {/* Fecha */}

                      <td className="p-3">

                        {new Date(
                          maintenance.maintenanceDate
                        ).toLocaleDateString()}

                      </td>

                      {/* Costo */}

                      <td className="p-3">

                        $
                        {
                          maintenance.cost ??
                          0
                        }

                      </td>

                      {/* Acciones */}

                      <td className="p-3">

                        {maintenance.status !==
                          "COMPLETED" && (

                          <button
                            onClick={() =>
                              completeMaintenance(
                                maintenance.id
                              )
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                          >

                            Completar

                          </button>
                        )}

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