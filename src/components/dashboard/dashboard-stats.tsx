"use client";

import { useEffect, useState } from "react";

import StatCard from "./stat-card";

export default function DashboardStats() {

  const [stats, setStats] =
    useState({
      assets: 0,

      employees: 0,

      assignments: 0,

      maintenances: 0,
    });

  async function loadStats() {

    try {

      const [
        assetsRes,
        employeesRes,
        assignmentsRes,
        maintenancesRes,
      ] = await Promise.all([
        fetch("/api/assets"),

        fetch("/api/employees"),

        fetch("/api/assignments"),

        fetch("/api/maintenances"),
      ]);

      const assets =
        await assetsRes.json();

      const employees =
        await employeesRes.json();

      const assignments =
        await assignmentsRes.json();

      const maintenances =
        await maintenancesRes.json();

      setStats({
        assets: assets.length,

        employees:
          employees.length,

        assignments:
          assignments.length,

        maintenances:
          maintenances.length,
      });

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Activos"
        value={stats.assets}
        color="bg-blue-600"
      />

      <StatCard
        title="Empleados"
        value={stats.employees}
        color="bg-green-600"
      />

      <StatCard
        title="Asignaciones"
        value={stats.assignments}
        color="bg-purple-600"
      />

      <StatCard
        title="Mantenimientos"
        value={stats.maintenances}
        color="bg-orange-600"
      />

    </div>
  );
}