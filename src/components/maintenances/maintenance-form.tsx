"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
}

interface MaintenanceFormProps {
  onSaved: () => void;
}

export default function MaintenanceForm({
  onSaved,
}: MaintenanceFormProps) {

  const [loading, setLoading] =
    useState(false);

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [technicians, setTechnicians] =
    useState<Employee[]>([]);

  const [form, setForm] =
    useState({

      assetId: "",

      technicianId: "",

      description: "",

      maintenanceDate: "",

      type: "PREVENTIVE",

      cost: "",

      status: "PENDING",
    });

  async function loadData() {

    try {

      const [
        assetsRes,
        employeesRes,
      ] = await Promise.all([

        fetch("/api/assets", {
          credentials:
            "include",
        }),

        fetch("/api/employees", {
          credentials:
            "include",
        }),
      ]);

      const assetsData =
        await assetsRes.json();

      const employeesData =
        await employeesRes.json();

      setAssets(
        Array.isArray(
          assetsData
        )
          ? assetsData
          : []
      );

      setTechnicians(
        Array.isArray(
          employeesData
        )
          ? employeesData
          : []
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
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {

    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {

        ...form,

        cost: form.cost
          ? Number(form.cost)
          : null,
      };

      const res = await fetch(
        "/api/maintenances",
        {
          method: "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.error ||
            "Error creando mantenimiento"
        );

        return;
      }

      toast.success(
        "Mantenimiento creado"
      );

      setForm({

        assetId: "",

        technicianId: "",

        description: "",

        maintenanceDate: "",

        type: "PREVENTIVE",

        cost: "",

        status: "PENDING",
      });

      onSaved();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error creando mantenimiento"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">

        Nuevo mantenimiento

      </h2>

      <form
        onSubmit={
          handleSubmit
        }
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >

        {/* Activo */}

        <select
          name="assetId"
          value={
            form.assetId
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        >

          <option value="">
            Seleccionar activo
          </option>

          {assets.map(
            (asset) => (

              <option
                key={asset.id}
                value={asset.id}
              >

                {asset.name}

              </option>
            )
          )}

        </select>

        {/* Técnico */}

        <select
          name="technicianId"
          value={
            form.technicianId
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        >

          <option value="">
            Seleccionar técnico
          </option>

          {technicians.map(
            (
              technician
            ) => (

              <option
                key={
                  technician.id
                }
                value={
                  technician.id
                }
              >

                {technician.name}

              </option>
            )
          )}

        </select>

        {/* Tipo */}

        <select
          name="type"
          value={form.type}
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3"
        >

          <option value="PREVENTIVE">
            Preventivo
          </option>

          <option value="CORRECTIVE">
            Correctivo
          </option>

        </select>

        {/* Estado */}

        <select
          name="status"
          value={
            form.status
          }
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3"
        >

          <option value="PENDING">
            Pendiente
          </option>

          <option value="IN_PROGRESS">
            En progreso
          </option>

          <option value="COMPLETED">
            Completado
          </option>

        </select>

        {/* Fecha */}

        <input
          type="date"
          name="maintenanceDate"
          value={
            form.maintenanceDate
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        {/* Costo */}

        <input
          type="number"
          step="0.01"
          name="cost"
          placeholder="Costo"
          value={form.cost}
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3"
        />

        {/* Descripción */}

        <textarea
          name="description"
          placeholder="Descripción"
          value={
            form.description
          }
          onChange={
            handleChange
          }
          rows={4}
          required
          className="rounded-xl border px-4 py-3 md:col-span-2"
        />

        {/* Botón */}

        <div className="md:col-span-2">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >

            {loading
              ? "Guardando..."
              : "Crear mantenimiento"}

          </button>

        </div>

      </form>

    </div>
  );
}