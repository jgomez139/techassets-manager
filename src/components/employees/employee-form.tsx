"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";


interface Employee {
  id?: string;

  name: string;

  email: string;

  phone?: string;

  position: string;

  department?: string;
}


interface Props {
  onSaved: () => void;

  editingEmployee?: Employee | null;

  clearEditing: () => void;
}


export default function EmployeeForm({
  onSaved,
  editingEmployee,
  clearEditing,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<Employee>({
      name: "",

      email: "",

      phone: "",

      position: "",

      department: "",
    });

  useEffect(() => {

    if (editingEmployee) {

      setFormData({
        id: editingEmployee.id,

        name:
          editingEmployee.name,

        email:
          editingEmployee.email,

        phone:
          editingEmployee.phone || "",

        position:
          editingEmployee.position,

        department:
          editingEmployee.department || "",
      });

    } else {

      setFormData({
        name: "",

        email: "",

        phone: "",

        position: "",

        department: "",
      });
    }

  }, [editingEmployee]);


  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement
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

    try {

      setLoading(true);

      const isEditing =
        !!editingEmployee;

      const url = isEditing
        ? `/api/employees/${editingEmployee?.id}`
        : "/api/employees";

      const method = isEditing
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        isEditing
          ? "Empleado actualizado"
          : "Empleado creado"
      );

      onSaved();

      clearEditing();

    } catch (error) {

      console.error(error);

      toast.error(
        "Ocurrió un error"
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

      <div className="mb-6">

        <h2 className="text-2xl font-bold">

          {editingEmployee
            ? "Editar empleado"
            : "Nuevo empleado"}

        </h2>

        <p className="text-sm text-gray-500">

          Gestión de empleados

        </p>

      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
        />

        <input
          type="text"
          name="position"
          placeholder="Cargo"
          value={formData.position}
          onChange={handleChange}
          className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
        />

        <input
          type="text"
          name="department"
          placeholder="Departamento"
          value={formData.department}
          onChange={handleChange}
          className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
        />

      </div>

      <div className="mt-6 flex gap-3">

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
            onClick={clearEditing}
            className="rounded-xl bg-gray-200 px-6 py-3 hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}

      </div>

    </form>
  );
}