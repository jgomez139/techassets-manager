"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { assetStatusLabels } from "@/lib/asset-status";

interface Asset {
  id: string;

  name: string;

  status: string;

  isDeleted?: boolean;
}

interface Employee {
  id: string;

  name: string;
}

interface Props {
  onSaved: () => void;
}

export default function AssignmentForm({
  onSaved,
}: Props) {

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      assetId: "",

      employeeId: "",

      notes: "",
    });

  async function loadData() {

    try {

      const [
        assetsRes,
        employeesRes,
      ] = await Promise.all([
        fetch("/api/assets"),
        fetch("/api/employees"),
      ]);

      const assetsData =
        await assetsRes.json();

      const employeesData =
        await employeesRes.json();

      console.log(
        "ASSETS:",
        assetsData
      );

      console.log(
        "EMPLOYEES:",
        employeesData
      );

      // Mostrar solo activos disponibles

      const availableAssets =
        assetsData.filter(
          (asset: Asset) =>
            asset.status ===
              "IN_STORAGE" &&
            !asset.isDeleted
        );

      setAssets(
        availableAssets
      );

      setEmployees(
        employeesData
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Error cargando datos"
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!formData.assetId) {

      toast.error(
        "Seleccione un activo"
      );

      return;
    }

    if (!formData.employeeId) {

      toast.error(
        "Seleccione un empleado"
      );

      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "/api/assignments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.error ||
            "Error creando asignación"
        );

        return;
      }

      toast.success(
        "Activo asignado correctamente"
      );

      setFormData({
        assetId: "",

        employeeId: "",

        notes: "",
      });

      onSaved();

      loadData();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error creando asignación"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-8 shadow"
    >

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Nueva asignación
        </h2>

        <p className="text-sm text-gray-500">
          Asignar activos a empleados
        </p>

      </div>

      {/* Grid */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Select activo */}

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Activo
          </label>

          <select
            name="assetId"
            value={formData.assetId}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
          >

            <option value="">
              Seleccionar activo
            </option>

            {assets.length > 0 ? (

              assets.map((asset) => (

                <option
                  key={asset.id}
                  value={asset.id}
                >

                  {asset.name} (
                  {
                    assetStatusLabels[
                      asset.status as keyof typeof assetStatusLabels
                    ]
                  })

                </option>
              ))

            ) : (

              <option disabled>
                No hay activos disponibles
              </option>
            )}

          </select>

        </div>

        {/* Select empleado */}

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Empleado
          </label>

          <select
            name="employeeId"
            value={
              formData.employeeId
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
          >

            <option value="">
              Seleccionar empleado
            </option>

            {employees.map(
              (employee) => (

                <option
                  key={
                    employee.id
                  }
                  value={
                    employee.id
                  }
                >
                  {employee.name}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* Notes */}

      <div className="mt-4">

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Observaciones
        </label>

        <textarea
          name="notes"
          placeholder="Observaciones de la asignación..."
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
        />

      </div>

      {/* Info */}

      <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">

        Solo aparecen activos disponibles en almacén.

      </div>

      {/* Button */}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
      >

        {loading
          ? "Asignando..."
          : "Asignar activo"}

      </button>

    </form>
  );
}