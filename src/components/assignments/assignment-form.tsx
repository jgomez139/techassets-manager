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
}

interface AssignmentFormProps {
  onSaved: () => void;
}

export default function AssignmentForm({
  onSaved,
}: AssignmentFormProps) {

  const [loading, setLoading] =
    useState(false);

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [form, setForm] =
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

      setEmployees(
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
      | React.ChangeEvent<
          HTMLInputElement
        >
      | React.ChangeEvent<
          HTMLSelectElement
        >
      | React.ChangeEvent<
          HTMLTextAreaElement
        >
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

      const res = await fetch(
        "/api/assignments",
        {
          method: "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            form
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
        "Asignación creada"
      );

      setForm({

        assetId: "",

        employeeId: "",

        notes: "",
      });

      onSaved();

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
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">

        Nueva asignación

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

        {/* Empleado */}

        <select
          name="employeeId"
          value={
            form.employeeId
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        >

          <option value="">
            Seleccionar empleado
          </option>

          {employees.map(
            (
              employee
            ) => (

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

        {/* Notas */}

        <textarea
          name="notes"
          placeholder="Notas"
          value={
            form.notes
          }
          onChange={
            handleChange
          }
          rows={4}
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
              : "Crear asignación"}

          </button>

        </div>

      </form>

    </div>
  );
}