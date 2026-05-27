"use client";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";


interface Asset {
  id: string;

  name: string;

  serialNumber?: string;

  brand?: string;

  model?: string;

  status: string;

  category?: {
    name: string;
  };

  createdAt: string;
}


interface Props {
  assets: Asset[];
}


function formatStatus(
  status: string
) {

  switch (status) {

    case "IN_STORAGE":
      return "En almacén";

    case "IN_USE":
      return "En uso";

    case "UNDER_REPAIR":
      return "En reparación";

    case "DISPOSED":
      return "Dado de baja";

    default:
      return status;
  }
}


export default function ExportExcel({
  assets,
}: Props) {

  function exportToExcel() {

    const data = assets.map(
      (asset) => ({
        Nombre: asset.name,

        Serial:
          asset.serialNumber ||
          "-",

        Marca:
          asset.brand || "-",

        Modelo:
          asset.model || "-",

        Estado:
          formatStatus(
            asset.status
          ),

        Categoría:
          asset.category
            ?.name ||
          "Sin categoría",

        Fecha:
          new Date(
            asset.createdAt
          ).toLocaleDateString(),
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Activos"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",

        type: "array",
      });

    const fileData =
      new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

    saveAs(
      fileData,
      "reporte-activos.xlsx"
    );
  }


  return (
    <button
      onClick={exportToExcel}
      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
    >

      Exportar Excel

    </button>
  );
}