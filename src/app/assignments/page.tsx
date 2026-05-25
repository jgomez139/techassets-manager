"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import AssignmentForm from "@/components/assignments/assignment-form";

import AssignmentTable from "@/components/assignments/assignment-table";


interface Assignment {
  id: string;

  assignedAt: string;

  returnedAt?: string;

  notes?: string;

  asset: {
    name: string;
  };

  employee: {
    name: string;
  };
}


export default function AssignmentsPage() {

  const [
    assignments,
    setAssignments,
  ] = useState<Assignment[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");


  async function getAssignments() {

    try {

      setLoading(true);

      const res = await fetch(
        "/api/assignments"
      );

      const data =
        await res.json();

      setAssignments(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }


  async function handleReturn(
    id: string
  ) {

    try {

      const res = await fetch(
        `/api/assignments/${id}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        "Activo devuelto"
      );

      getAssignments();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error devolviendo activo"
      );
    }
  }


  async function handleDelete(
    id: string
  ) {

    const confirmDelete = confirm(
      "¿Eliminar asignación?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `/api/assignments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        "Asignación eliminada"
      );

      getAssignments();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error eliminando asignación"
      );
    }
  }


  useEffect(() => {
    getAssignments();
  }, []);


  const filteredAssignments =
    useMemo(() => {

      return assignments.filter(
        (assignment) => {

          const text = `
            ${assignment.asset.name}
            ${assignment.employee.name}
          `.toLowerCase();

          return text.includes(
            search.toLowerCase()
          );
        }
      );

    }, [assignments, search]);


  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Asignaciones
        </h1>

        <p className="text-gray-500">
          Gestión de asignaciones de activos
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Total asignaciones
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {assignments.length}
          </h2>

        </div>

      </div>

      {/* Form */}

      <AssignmentForm
        onSaved={
          getAssignments
        }
      />

      {/* Table */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Lista de asignaciones
            </h2>

            <p className="text-sm text-gray-500">
              Administración de activos asignados
            </p>

          </div>

          <input
            type="text"
            placeholder="Buscar..."
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
            Cargando asignaciones...
          </p>

        ) : filteredAssignments.length ===
          0 ? (

          <p>
            No hay asignaciones
          </p>

        ) : (

          <AssignmentTable
            assignments={
              filteredAssignments
            }
            onReturn={
              handleReturn
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