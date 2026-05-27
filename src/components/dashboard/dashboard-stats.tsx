interface Asset {
  id: string;
}

interface Employee {
  id: string;
}

interface Assignment {
  id: string;
}

interface Maintenance {
  id: string;
}


interface Props {
  assets: Asset[];

  employees: Employee[];

  assignments: Assignment[];

  maintenances: Maintenance[];
}


export default function DashboardStats({
  assets,
  employees,
  assignments,
  maintenances,
}: Props) {

  const stats = [
    {
      title: "Activos",
      value: assets.length,
    },

    {
      title: "Empleados",
      value: employees.length,
    },

    {
      title: "Asignaciones",
      value:
        assignments.length,
    },

    {
      title: "Mantenimientos",
      value:
        maintenances.length,
    },
  ];


  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => (

        <div
          key={stat.title}
          className="rounded-2xl bg-white p-6 shadow"
        >

          <p className="text-sm text-gray-500">
            {stat.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stat.value}
          </h2>

        </div>
      ))}

    </div>
  );
}