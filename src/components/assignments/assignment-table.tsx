"use client";

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


interface Props {
  assignments: Assignment[];

  onReturn: (
    id: string
  ) => void;

  onDelete: (
    id: string
  ) => void;
}


export default function AssignmentTable({
  assignments,
  onReturn,
  onDelete,
}: Props) {

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b bg-gray-50">

            <th className="p-4 text-left">
              Activo
            </th>

            <th className="p-4 text-left">
              Empleado
            </th>

            <th className="p-4 text-left">
              Fecha asignación
            </th>

            <th className="p-4 text-left">
              Estado
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {assignments.map(
            (assignment) => (

              <tr
                key={assignment.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {
                    assignment.asset
                      .name
                  }
                </td>

                <td className="p-4">
                  {
                    assignment
                      .employee.name
                  }
                </td>

                <td className="p-4">
                  {new Date(
                    assignment.assignedAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">

                  {assignment.returnedAt ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      Devuelto
                    </span>

                  ) : (

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                      Asignado
                    </span>
                  )}

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    {!assignment.returnedAt && (

                      <button
                        onClick={() =>
                          onReturn(
                            assignment.id
                          )
                        }
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      >
                        Devolver
                      </button>
                    )}

                    <button
                      onClick={() =>
                        onDelete(
                          assignment.id
                        )
                      }
                      className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}