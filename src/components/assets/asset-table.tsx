"use client";

import {
  assetStatusLabels,
  assetStatusColors,
} from "@/lib/asset-status";

interface Asset {
  id: string;
  name: string;
  status:
    | "IN_USE"
    | "IN_STORAGE"
    | "UNDER_REPAIR"
    | "DISPOSED";
}

interface Props {
  assets: Asset[];
}

export default function AssetTable({
  assets,
}: Props) {

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Nombre
            </th>

            <th className="p-3 text-left">
              Estado
            </th>
          </tr>
        </thead>

        <tbody>

          {assets.map((asset) => (

            <tr
              key={asset.id}
              className="border-b"
            >

              <td className="p-3">
                {asset.name}
              </td>

              {/* AQUÍ VA EL CÓDIGO */}

              <td className="p-3">

                <span
                  className={`rounded px-2 py-1 text-sm ${
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

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}