"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

interface Employee {
  id: string;

  name: string;

  email: string;

  phone?: string;

  position: string;

  department?: string;
}

interface EmployeeFormProps {
  onSaved: () => void;

  editingEmployee?: Employee | null;

  clearEditing?: () => void;
}

export default function EmployeeForm({
  onSaved,
  editingEmployee,
  clearEditing,
}: EmployeeFormProps) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      phone: "",

      position: "",

      department: "",
    });

  useEffect(() => {

    if (editingEmployee) {

      setForm({

        name:
          editingEmployee.name || "",

        email:
          editingEmployee.email || "",

        phone:
          editingEmployee.phone || "",

        position:
          editingEmployee.position || "",

        department:
          editingEmployee.department || "",
      });
    }

  }, [editingEmployee]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement
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

      const url =
        editingEmployee
          ? `/api/employees/${editingEmployee.id}`
          : "/api/employees";

      const method =
        editingEmployee
          ? "PUT"
          : "POST";

      const res = await fetch(
        url,
        {
          method,

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
            "Error guardando empleado"
        );

        return;
      }

      toast.success(
        editingEmployee
          ? "Empleado actualizado"
          : "Empleado creado"
      );

      setForm({

        name: "",

        email: "",

        phone: "",

        position: "",

        department: "",
      });

      clearEditing?.();

      onSaved();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error guardando empleado"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">

        {editingEmployee
          ? "Editar empleado"
          : "Nuevo empleado"}

      </h2>

      <form
        onSubmit={
          handleSubmit
        }
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          name="position"
          placeholder="Cargo"
          value={form.position}
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          name="department"
          placeholder="Departamento"
          value={
            form.department
          }
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3 md:col-span-2"
        />

        <div className="md:col-span-2 flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >

            {loading
              ? "Guardando..."
              : editingEmployee
              ? "Actualizar"
              : "Crear"}

          </button>

          {editingEmployee && (

            <button
              type="button"
              onClick={() => {

                clearEditing?.();

                setForm({

                  name: "",

                  email: "",

                  phone: "",

                  position: "",

                  department: "",
                });
              }}
              className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"
            >

              Cancelar

            </button>
          )}

        </div>

      </form>

    </div>
  );
}