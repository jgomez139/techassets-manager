"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  id?: string;
  name: string;
  description?: string;
}

interface Props {
  onSaved: () => void;
  editingCategory?: Category | null;
  clearEditing: () => void;
}

export default function CategoryForm({
  onSaved,
  editingCategory,
  clearEditing,
}: Props) {

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (editingCategory) {
      setName(editingCategory.name);

      setDescription(
        editingCategory.description || ""
      );

    } else {
      setName("");
      setDescription("");
    }

  }, [editingCategory]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        "El nombre es obligatorio"
      );

      return;
    }

    try {

      setLoading(true);

      const isEditing =
        !!editingCategory;

      const url = isEditing
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const method = isEditing
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        isEditing
          ? "Categoría actualizada"
          : "Categoría creada"
      );

      setName("");
      setDescription("");

      clearEditing();

      onSaved();

    } catch {

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
      className="mb-8 rounded-xl bg-white p-6 shadow"
    >

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

        <div className="flex gap-3">

          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            {loading
              ? "Guardando..."
              : editingCategory
              ? "Actualizar"
              : "Crear categoría"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={clearEditing}
              className="rounded-lg bg-gray-300 px-6 py-3"
            >
              Cancelar
            </button>
          )}

        </div>

      </div>

    </form>
  );
}