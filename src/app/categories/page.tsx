"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  async function getCategories() {
    const res = await fetch("/api/categories");

    const data = await res.json();

    setCategories(data);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await fetch("/api/categories", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        description,
      }),
    });

    setName("");
    setDescription("");

    getCategories();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    getCategories();
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>

      <h1 className="mb-6 text-3xl font-bold">
        Categorías
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-xl bg-white p-6 shadow"
      >

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded-lg border p-3"
          required
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Crear categoría
        </button>

      </form>

      {/* TABLE */}
      <div className="rounded-xl bg-white p-6 shadow">

        <table className="w-full">

          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Nombre</th>
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

                <td className="p-3">
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

    </div>
  );
}