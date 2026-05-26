"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";


interface Asset {
  id: string;

  name: string;

  status: string;
}


interface Props {
  onSaved: () => void;
}


export default function MaintenanceForm({
  onSaved,
}: Props) {

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      assetId: "",

      technicianName: "",

      type: "PREVENTIVE",

      description: "",

      maintenanceDate: "",

      cost: "",

      observations: "",
    });


  async function loadAssets() {

    try {

      const res = await fetch(
        "/api/assets"
      );

      const data =
        await res.json();

      // Excluir activos eliminados y dados de baja

      const availableAssets =
        data.filter(
          (asset: any) =>
            !asset.isDeleted &&
            asset.status !==
              "DISPOSED"
        );

      setAssets(
        availableAssets
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Error cargando activos"
      );
    }
  }


  useEffect(() => {
    loadAssets();
  }, []);


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

    try {

      setLoading(true);

      const res = await fetch(
        "/api/maintenances",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.error ||
            "Error creando mantenimiento"
        );

        return;
      }

      toast.success(
        "Mantenimiento registrado"
      );

      setFormData({
        assetId: "",

        technicianName: "",

        type: "PREVENTIVE",

        description: "",

        maintenanceDate: "",

        cost: "",

        observations: "",
      });

      onSaved();

      loadAssets();

    } catch (error) {

      console.error(error);

      toast.error(
        "Error creando mantenimiento"
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
          Nuevo mantenimiento
        </h2>

        <p className="text-sm text-gray-500">
          Registrar mantenimiento técnico
        </p>

      </div>

      {/* Grid */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Activo */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Activo
          </label>

          <select
            name="assetId"
            value={formData.assetId}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          >

            <option value="">
              Seleccionar activo
            </option>

            {assets.map(
              (asset) => (

                <option
                  key={asset.id}
                  value={asset.id}
                >
                  {asset.name}
                </option>
              )
            )}

          </select>

        </div>

        {/* Técnico */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Técnico responsable
          </label>

          <input
            type="text"
            name="technicianName"
            placeholder="Nombre técnico"
            value={
              formData.technicianName
            }
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />

        </div>

        {/* Tipo */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Tipo mantenimiento
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >

            <option value="PREVENTIVE">
              Preventivo
            </option>

            <option value="CORRECTIVE">
              Correctivo
            </option>

          </select>

        </div>

        {/* Fecha */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Fecha mantenimiento
          </label>

          <input
            type="date"
            name="maintenanceDate"
            value={
              formData.maintenanceDate
            }
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />

        </div>

        {/* Costo */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Costo
          </label>

          <input
            type="number"
            name="cost"
            placeholder="0"
            value={formData.cost}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

        </div>

      </div>

      {/* Descripción */}

      <div className="mt-4">

        <label className="mb-2 block text-sm font-medium">
          Descripción
        </label>

        <textarea
          name="description"
          placeholder="Descripción mantenimiento..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl border p-3"
          required
        />

      </div>

      {/* Observaciones */}

      <div className="mt-4">

        <label className="mb-2 block text-sm font-medium">
          Observaciones
        </label>

        <textarea
          name="observations"
          placeholder="Observaciones..."
          value={formData.observations}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-xl border p-3"
        />

      </div>

      {/* Botón */}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
      >

        {loading
          ? "Guardando..."
          : "Registrar mantenimiento"}

      </button>

    </form>
  );
}