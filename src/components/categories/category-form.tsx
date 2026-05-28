"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

interface Category {
  id: string;

  name: string;

  description?: string;
}

interface CategoryFormProps {
  onSaved: () => void;

  editingCategory?: Category | null;

  clearEditing?: () => void;
}

export default function CategoryForm({
  onSaved,
  editingCategory,
  clearEditing,
}: CategoryFormProps) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",

      description: "",
    });

  useEffect(() => {

    if (editingCategory) {

      setForm({

        name:
          editingCategory.name || "",

        description:
          editingCategory.description || "",
      });
    }

  }, [editingCategory]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
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

      const url =
        editingCategory
          ? `/api/categories/${editingCategory.id}`
          : "/api/categories";

      const method =
        editingCategory
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
            "Error guardando categoría"
        );

        return;
      }

      toast.success(
        editingCategory
          ? "Categoría actualizada"
          : "Categoría creada"
      );

      setForm({

        name: "",

        description: "",
      });

      clearEditing?.();

      onSaved();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error guardando categoría"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">

        {editingCategory
          ? "Editar categoría"
          : "Nueva categoría"}

      </h2>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Nombre de la categoría"
          value={form.name}
          onChange={
            handleChange
          }
          required
          className="w-full rounded-xl border px-4 py-3"
        />

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
          className="w-full rounded-xl border px-4 py-3"
        />

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >

            {loading
              ? "Guardando..."
              : editingCategory
              ? "Actualizar"
              : "Crear"}

          </button>

          {editingCategory && (

            <button
              type="button"
              onClick={() => {

                clearEditing?.();

                setForm({

                  name: "",

                  description: "",
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