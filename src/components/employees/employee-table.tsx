"use client";

interface Employee {
  id: string;

  name: string;

  email: string;

  phone?: string;

  position: string;

  department?: string;
}


interface Props {
  employees: Employee[];

  onEdit: (
    employee: Employee
  ) => void;

  onDelete: (
    id: string
  ) => void;
}


export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: Props) {

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b bg-gray-50">

            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-left">
              Correo
            </th>

            <th className="p-4 text-left">
              Teléfono
            </th>

            <th className="p-4 text-left">
              Cargo
            </th>

            <th className="p-4 text-left">
              Departamento
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {employees.map(
            (employee) => (

              <tr
                key={employee.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {employee.name}
                </td>

                <td className="p-4">
                  {employee.email}
                </td>

                <td className="p-4">
                  {employee.phone}
                </td>

                <td className="p-4">
                  {employee.position}
                </td>

                <td className="p-4">
                  {
                    employee.department
                  }
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        onEdit(
                          employee
                        )
                      }
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          employee.id
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