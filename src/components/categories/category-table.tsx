"use client";

import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Props {
  categories: Category[];

  onDeleted: () => void;

  onEdit: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onDeleted,
  onEdit,
}: Props) {

  async function handleDelete(id: string) {

    const confirmed = confirm(
      "¿Eliminar categoría?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(
        `/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        "Categoría eliminada"
      );

      onDeleted();

    } catch {

      toast.error(
        "Error eliminando categoría"
      );
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <table className="w-full">

        <thead>
          <tr className="border-b text-left">
            <th className="p-3">
              Nombre
            </th>

            <th className="p-3">
              Descripción
            </th>

            <th className="p-3">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>

          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-b"
            >

              <td className="p-3">
                {category.name}
              </td>

              <td className="p-3">
                {category.description}
              </td>

              <td className="flex gap-2 p-3">

                <button
                  onClick={() =>
                    onEdit(category)
                  }
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    handleDelete(category.id)
                  }
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  Eliminar
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}