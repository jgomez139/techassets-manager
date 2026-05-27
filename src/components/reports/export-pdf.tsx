"use client";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";


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


export default function ExportPDF({
  assets,
}: Props) {

  function exportToPDF() {

    const doc = new jsPDF();

    // Header

    doc.setFontSize(20);

    doc.text(
      "Reporte de Activos",
      14,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Fecha: ${new Date().toLocaleDateString()}`,
      14,
      30
    );

    // Table

    autoTable(doc, {

      startY: 40,

      head: [[
        "Nombre",
        "Marca",
        "Modelo",
        "Serial",
        "Estado",
        "Categoría",
      ]],

      body: assets.map(
        (asset) => [

          asset.name,

          asset.brand || "-",

          asset.model || "-",

          asset.serialNumber || "-",

          formatStatus(
            asset.status
          ),

          asset.category?.name ||
            "Sin categoría",
        ]
      ),

      styles: {
        fontSize: 10,
      },

      headStyles: {
        fillColor: [0, 0, 0],
      },
    });

    doc.save(
      "reporte-activos.pdf"
    );
  }


  return (
    <button
      onClick={exportToPDF}
      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
    >

      Exportar PDF

    </button>
  );
}