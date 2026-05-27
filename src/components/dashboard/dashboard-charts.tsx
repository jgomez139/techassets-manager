"use client";

import dynamic from "next/dynamic";

const PieChart = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.PieChart
    ),
  { ssr: false }
);

const Pie = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Pie
    ),
  { ssr: false }
);

const Cell = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Cell
    ),
  { ssr: false }
);

const Tooltip = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Tooltip
    ),
  { ssr: false }
);

const ResponsiveContainer = dynamic(
  () =>
    import("recharts").then(
      (mod) =>
        mod.ResponsiveContainer
    ),
  { ssr: false }
);

const BarChart = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.BarChart
    ),
  { ssr: false }
);

const Bar = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Bar
    ),
  { ssr: false }
);

const XAxis = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.XAxis
    ),
  { ssr: false }
);

const YAxis = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.YAxis
    ),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () =>
    import("recharts").then(
      (mod) =>
        mod.CartesianGrid
    ),
  { ssr: false }
);


interface Asset {
  id: string;

  status: string;

  category?: {
    name: string;
  };
}


interface Maintenance {
  id: string;

  type: string;
}


interface Props {
  assets: Asset[];

  maintenances: Maintenance[];
}


export default function DashboardCharts({
  assets,
  maintenances,
}: Props) {

  const assetsByStatus = [
    {
      name: "En uso",

      value: assets.filter(
        (a) =>
          a.status ===
          "IN_USE"
      ).length,
    },

    {
      name: "En almacén",

      value: assets.filter(
        (a) =>
          a.status ===
          "IN_STORAGE"
      ).length,
    },

    {
      name: "En reparación",

      value: assets.filter(
        (a) =>
          a.status ===
          "UNDER_REPAIR"
      ).length,
    },

    {
      name: "Baja",

      value: assets.filter(
        (a) =>
          a.status ===
          "DISPOSED"
      ).length,
    },
  ];


  const categoryMap:
    Record<string, number> =
    {};

  assets.forEach((asset) => {

    const category =
      asset.category?.name ||
      "Sin categoría";

    categoryMap[category] =
      (categoryMap[category] || 0) +
      1;
  });


  const assetsByCategory =
    Object.entries(
      categoryMap
    ).map(
      ([name, value]) => ({
        name,
        value,
      })
    );


  const maintenanceData = [
    {
      name: "Preventivos",

      total:
        maintenances.filter(
          (m) =>
            m.type ===
            "PREVENTIVE"
        ).length,
    },

    {
      name: "Correctivos",

      total:
        maintenances.filter(
          (m) =>
            m.type ===
            "CORRECTIVE"
        ).length,
    },
  ];


  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#eab308",
    "#dc2626",
  ];


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* Estados */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold">
          Activos por estado
        </h2>

        <div className="h-[320px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={
                  assetsByStatus
                }
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                {assetsByStatus.map(
                  (_, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Categorías */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold">
          Activos por categoría
        </h2>

        <div className="h-[320px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={
                assetsByCategory
              }
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Mantenimientos */}

      <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">

        <h2 className="mb-4 text-xl font-bold">
          Tipos de mantenimiento
        </h2>

        <div className="h-[320px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={
                maintenanceData
              }
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}