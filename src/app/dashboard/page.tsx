import DashboardStats from "@/components/dashboard/dashboard-stats";

import RecentAssets from "@/components/dashboard/recent-assets";

import RecentAssignments from "@/components/dashboard/recent-assignments";

export default function DashboardPage() {

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Resumen general del sistema
        </p>

      </div>

      {/* Stats */}

      <DashboardStats />

      {/* Sections */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <RecentAssets />

        <RecentAssignments />

      </div>

    </div>
  );
}