"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

interface Category {
  id: string;

  name: string;
}

interface AssetFormProps {
  onSaved: () => void;

  editingAsset?: any;

  clearEditing?: () => void;
}

export default function AssetForm({
  onSaved,
  editingAsset,
  clearEditing,
}: AssetFormProps) {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",

      brand: "",

      model: "",

      serialNumber: "",

      inventoryCode: "",

      status: "IN_STORAGE",

      description: "",

      categoryId: "",

      purchaseCost: "",
    });

  async function getCategories() {

    try {

      const res = await fetch(
        "/api/categories",
        {
          credentials:
            "include",
        }
      );

      const data =
        await res.json();

      if (Array.isArray(data)) {

        setCategories(data);
      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Error cargando categorías"
      );
    }
  }

  useEffect(() => {

    getCategories();

  }, []);

  useEffect(() => {

    if (editingAsset) {

      setForm({

        name:
          editingAsset.name || "",

        brand:
          editingAsset.brand || "",

        model:
          editingAsset.model || "",

        serialNumber:
          editingAsset.serialNumber || "",

        inventoryCode:
          editingAsset.inventoryCode || "",

        status:
          editingAsset.status ||
          "IN_STORAGE",

        description:
          editingAsset.description ||
          "",

        categoryId:
          editingAsset.categoryId ||
          "",

        purchaseCost:
          editingAsset.purchaseCost?.toString() ||
          "",
      });

    }

  }, [editingAsset]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
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
        editingAsset
          ? `/api/assets/${editingAsset.id}`
          : "/api/assets";

      const method =
        editingAsset
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

          body: JSON.stringify({
            ...form,

            purchaseCost:
              form.purchaseCost
                ? parseFloat(
                    form.purchaseCost
                  )
                : null,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.error ||
            "Error guardando activo"
        );

        return;
      }

      toast.success(
        editingAsset
          ? "Activo actualizado"
          : "Activo creado"
      );

      setForm({

        name: "",

        brand: "",

        model: "",

        serialNumber: "",

        inventoryCode: "",

        status: "IN_STORAGE",

        description: "",

        categoryId: "",

        purchaseCost: "",
      });

      clearEditing?.();

      onSaved();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error guardando activo"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">

        {editingAsset
          ? "Editar activo"
          : "Nuevo activo"}

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
          type="text"
          name="brand"
          placeholder="Marca"
          value={form.brand}
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          name="model"
          placeholder="Modelo"
          value={form.model}
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          name="serialNumber"
          placeholder="Serial"
          value={
            form.serialNumber
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          name="inventoryCode"
          placeholder="Código inventario"
          value={
            form.inventoryCode
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        />

        <select
          name="status"
          value={form.status}
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3"
        >

          <option value="IN_STORAGE">
            En almacén
          </option>

          <option value="IN_USE">
            En uso
          </option>

          <option value="UNDER_REPAIR">
            En reparación
          </option>

          <option value="DISPOSED">
            Dado de baja
          </option>

        </select>

        <select
          name="categoryId"
          value={
            form.categoryId
          }
          onChange={
            handleChange
          }
          required
          className="rounded-xl border px-4 py-3"
        >

          <option value="">
            Selecciona categoría
          </option>

          {categories.map(
            (category) => (

              <option
                key={
                  category.id
                }
                value={
                  category.id
                }
              >

                {
                  category.name
                }

              </option>
            )
          )}

        </select>

        <input
          type="number"
          step="0.01"
          name="purchaseCost"
          placeholder="Costo"
          value={
            form.purchaseCost
          }
          onChange={
            handleChange
          }
          className="rounded-xl border px-4 py-3"
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
          className="md:col-span-2 rounded-xl border px-4 py-3"
          rows={4}
        />

        <div className="md:col-span-2 flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >

            {loading
              ? "Guardando..."
              : editingAsset
              ? "Actualizar"
              : "Crear"}

          </button>

          {editingAsset && (

            <button
              type="button"
              onClick={() => {

                clearEditing?.();

                setForm({

                  name: "",

                  brand: "",

                  model: "",

                  serialNumber: "",

                  inventoryCode: "",

                  status:
                    "IN_STORAGE",

                  description:
                    "",

                  categoryId:
                    "",

                  purchaseCost:
                    "",
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