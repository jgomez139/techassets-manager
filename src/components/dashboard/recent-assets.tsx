"use client";

import { useEffect, useState } from "react";

import {
  assetStatusLabels,
  assetStatusColors,
} from "@/lib/asset-status";

interface Asset {
  id: string;

  name: string;

  brand: string;

  status:
    | "IN_USE"
    | "IN_STORAGE"
    | "UNDER_REPAIR"
    | "DISPOSED";
}

export default function RecentAssets() {

  const [assets, setAssets] =
    useState<Asset[]>([]);

  async function loadAssets() {

    try {

      const res = await fetch(
        "/api/assets"
      );

      const data =
        await res.json();

      setAssets(data.slice(0, 5));

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-4 text-xl font-bold">
        Últimos activos
      </h2>

      <div className="space-y-4">

        {assets.map((asset) => (

          <div
            key={asset.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >

            <div>

              <h3 className="font-semibold">
                {asset.name}
              </h3>

              <p className="text-sm text-gray-500">
                {asset.brand}
              </p>

            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm ${
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

          </div>
        ))}

      </div>

    </div>
  );
}