"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { assetStatusLabels } from "@/lib/asset-status";

interface Category {
  id: string;
  name: string;
}

interface Asset {
  id?: string;

  name: string;

  brand: string;

  model: string;

  serialNumber: string;

  inventoryCode: string;

  status:
    | "IN_USE"
    | "IN_STORAGE"
    | "UNDER_REPAIR"
    | "DISPOSED";

  description?: string;

  categoryId: string;

  purchaseCost?: number;
}

interface Props {
  onSaved: () => void;

  editingAsset?: Asset | null;

  clearEditing: () => void;
}

export default function AssetForm({
  onSaved,
  editingAsset,
  clearEditing,
}: Props) {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<Asset>({
      name: "",

      brand: "",

      model: "",

      serialNumber: "",

      inventoryCode: "",

      status: "IN_STORAGE",

      description: "",

      categoryId: "",

      purchaseCost: 0,
    });

  async function getCategories() {

    try {

      const res = await fetch(
        "/api/categories"
      );

      const data = await res.json();

      setCategories(data);

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

      setFormData({
        id: editingAsset.id,

        name: editingAsset.name,

        brand: editingAsset.brand,

        model: editingAsset.model,

        serialNumber:
          editingAsset.serialNumber,

        inventoryCode:
          editingAsset.inventoryCode,

        status: editingAsset.status,

        description:
          editingAsset.description || "",

        categoryId:
          editingAsset.categoryId,

        purchaseCost:
          editingAsset.purchaseCost || 0,
      });

    } else {

      setFormData({
        name: "",

        brand: "",

        model: "",

        serialNumber: "",

        inventoryCode: "",

        status: "IN_STORAGE",

        description: "",

        categoryId: "",

        purchaseCost: 0,
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

    if (
      !formData.name ||
      !formData.brand ||
      !formData.model ||
      !formData.serialNumber ||
      !formData.inventoryCode ||
      !formData.categoryId
    ) {

      toast.error(
        "Completa todos los campos obligatorios"
      );

      return;
    }

    try {

      setLoading(true);

      const isEditing =
        !!editingAsset;

      const url = isEditing
        ? `/api/assets/${editingAsset?.id}`
        : "/api/assets";

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
          ? "Activo actualizado correctamente"
          : "Activo creado correctamente"
      );

      clearEditing();

      onSaved();

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

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">

          {editingAsset
            ? "Editar activo"
            : "Nuevo activo"}

        </h2>

        <p className="text-sm text-gray-500">

          Completa la información del activo tecnológico

        </p>

      </div>

      {/* Grid */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Nombre */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Nombre
          </label>

          <input
            type="text"
            name="name"
            placeholder="Ej: Laptop Dell"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          />

        </div>

        {/* Marca */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Marca
          </label>

          <input
            type="text"
            name="brand"
            placeholder="Ej: Dell"
            value={formData.brand}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          />

        </div>

        {/* Modelo */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Modelo
          </label>

          <input
            type="text"
            name="model"
            placeholder="Ej: Latitude 5420"
            value={formData.model}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          />

        </div>

        {/* Serial */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Serial
          </label>

          <input
            type="text"
            name="serialNumber"
            placeholder="Número serial"
            value={formData.serialNumber}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          />

        </div>

        {/* Inventory Code */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Código inventario
          </label>

          <input
            type="text"
            name="inventoryCode"
            placeholder="Ej: INV-001"
            value={formData.inventoryCode}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          />

        </div>

        {/* Purchase Cost */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Costo compra
          </label>

          <input
            type="number"
            name="purchaseCost"
            placeholder="Ej: 2500"
            value={formData.purchaseCost}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          />

        </div>

        {/* Categoría */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Categoría
          </label>

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          >

            <option value="">
              Selecciona categoría
            </option>

            {categories.map((category) => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}

          </select>

        </div>

        {/* Estado */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Estado
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          >

            <option value="IN_USE">
              {assetStatusLabels.IN_USE}
            </option>

            <option value="IN_STORAGE">
              {assetStatusLabels.IN_STORAGE}
            </option>

            <option value="UNDER_REPAIR">
              {assetStatusLabels.UNDER_REPAIR}
            </option>

            <option value="DISPOSED">
              {assetStatusLabels.DISPOSED}
            </option>

          </select>

        </div>

      </div>

      {/* Description */}

      <div className="mt-4">

        <label className="mb-2 block text-sm font-medium">
          Descripción
        </label>

        <textarea
          name="description"
          placeholder="Información adicional del activo..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
        />

      </div>

      {/* Buttons */}

      <div className="mt-6 flex gap-3">

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
        >

          {loading
            ? "Guardando..."
            : editingAsset
            ? "Actualizar activo"
            : "Crear activo"}

        </button>

        {editingAsset && (

          <button
            type="button"
            onClick={clearEditing}
            className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}

      </div>

    </form>
  );
}