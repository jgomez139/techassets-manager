"use client";

import { useEffect, useMemo, useState } from "react";

import EmployeeForm from "@/components/employees/employee-form";

import EmployeeTable from "@/components/employees/employee-table";

import { toast } from "sonner";


interface Employee {
  id: string;

  name: string;

  email: string;

  phone?: string;

  position: string;

  department?: string;
}


export default function EmployeesPage() {

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    editingEmployee,
    setEditingEmployee,
  ] = useState<Employee | null>(
    null
  );


  async function getEmployees() {

    try {

      setLoading(true);

      const res = await fetch(
        "/api/employees"
      );

      const data = await res.json();

      setEmployees(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }


  async function handleDelete(
    id: string
  ) {

    const confirmDelete = confirm(
      "¿Eliminar empleado?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `/api/employees/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        "Empleado eliminado"
      );

      getEmployees();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error eliminando empleado"
      );
    }
  }


  useEffect(() => {
    getEmployees();
  }, []);


  const filteredEmployees =
    useMemo(() => {

      return employees.filter(
        (employee) => {

          const text = `
            ${employee.name}
            ${employee.email}
            ${employee.position}
            ${employee.department}
          `.toLowerCase();

          return text.includes(
            search.toLowerCase()
          );
        }
      );

    }, [employees, search]);


  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Empleados
        </h1>

        <p className="text-gray-500">
          Gestión de empleados de la empresa
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Total empleados
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {employees.length}
          </h2>

        </div>

      </div>

      {/* Form */}

      <EmployeeForm
        onSaved={getEmployees}
        editingEmployee={
          editingEmployee
        }
        clearEditing={() =>
          setEditingEmployee(null)
        }
      />

      {/* Table */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Lista de empleados
            </h2>

            <p className="text-sm text-gray-500">
              Administración de empleados
            </p>

          </div>

          <input
            type="text"
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-xl border px-4 py-3 md:w-80"
          />

        </div>

        {loading ? (

          <p>
            Cargando empleados...
          </p>

        ) : filteredEmployees.length ===
          0 ? (

          <p>
            No hay empleados
          </p>

        ) : (

          <EmployeeTable
            employees={
              filteredEmployees
            }
            onEdit={
              setEditingEmployee
            }
            onDelete={
              handleDelete
            }
          />

        )}

      </div>

    </div>
  );
}