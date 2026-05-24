"use client";

import { useEffect, useMemo, useState } from "react";

import AssetForm from "@/components/assets/asset-form";

import {
  assetStatusLabels,
  assetStatusColors,
} from "@/lib/asset-status";

interface Asset {
  id: string;

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

  category: {
    id: string;
    name: string;
  };
}

export default function AssetsPage() {

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [editingAsset, setEditingAsset] =
    useState<Asset | null>(null);

  async function getAssets() {

    try {

      setLoading(true);

      const res = await fetch(
        "/api/assets"
      );

      const data = await res.json();

      setAssets(data);

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
      "¿Eliminar este activo?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `/api/assets/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      await getAssets();

    } catch (error) {

      console.error(error);

      alert(
        "Error eliminando activo"
      );
    }
  }

  useEffect(() => {
    getAssets();
  }, []);

  const filteredAssets =
    useMemo(() => {

      return assets.filter((asset) => {

        const text = `
          ${asset.name}
          ${asset.brand}
          ${asset.model}
          ${asset.serialNumber}
          ${asset.inventoryCode}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );
      });

    }, [assets, search]);

  const totalAssets =
    assets.length;

  const inUseAssets =
    assets.filter(
      (a) => a.status === "IN_USE"
    ).length;

  const storageAssets =
    assets.filter(
      (a) =>
        a.status === "IN_STORAGE"
    ).length;

  const repairAssets =
    assets.filter(
      (a) =>
        a.status ===
        "UNDER_REPAIR"
    ).length;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          Activos Tecnológicos

        </h1>

        <p className="text-gray-500">

          Gestión de activos de la empresa

        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Total activos
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalAssets}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            En uso
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {inUseAssets}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            En almacén
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {storageAssets}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            En reparación
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {repairAssets}
          </h2>

        </div>

      </div>

      {/* Form */}

      <AssetForm
        onSaved={getAssets}
        editingAsset={editingAsset}
        clearEditing={() =>
          setEditingAsset(null)
        }
      />

      {/* Table */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Lista de activos
            </h2>

            <p className="text-sm text-gray-500">
              Administración de activos tecnológicos
            </p>

          </div>

          {/* Search */}

          <input
            type="text"
            placeholder="Buscar activo..."
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

          <div className="py-10 text-center">

            <p>
              Cargando activos...
            </p>

          </div>

        ) : filteredAssets.length === 0 ? (

          <div className="py-10 text-center">

            <h3 className="text-lg font-semibold">
              No se encontraron activos
            </h3>

            <p className="text-gray-500">
              Intenta crear uno nuevo
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">
                    Nombre
                  </th>

                  <th className="p-4 text-left">
                    Marca
                  </th>

                  <th className="p-4 text-left">
                    Modelo
                  </th>

                  <th className="p-4 text-left">
                    Categoría
                  </th>

                  <th className="p-4 text-left">
                    Estado
                  </th>

                  <th className="p-4 text-left">
                    Serial
                  </th>

                  <th className="p-4 text-left">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredAssets.map(
                  (asset) => (

                    <tr
                      key={asset.id}
                      className="border-b transition hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {asset.name}
                      </td>

                      <td className="p-4">
                        {asset.brand}
                      </td>

                      <td className="p-4">
                        {asset.model}
                      </td>

                      <td className="p-4">
                        {
                          asset.category.name
                        }
                      </td>

                      <td className="p-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            assetStatusColors[
                              asset.status
                            ]
                          }`}
                        >

                          {
                            assetStatusLabels[
                              asset.status
                            ]
                          }

                        </span>

                      </td>

                      <td className="p-4">
                        {
                          asset.serialNumber
                        }
                      </td>

                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              setEditingAsset(
                                asset
                              )
                            }
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                asset.id
                              )
                            }
                            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
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
        )}

      </div>

    </div>
  );
}