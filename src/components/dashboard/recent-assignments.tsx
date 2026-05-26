"use client";

import { useEffect, useState } from "react";

interface Assignment {
  id: string;

  asset: {
    name: string;
  };

  employee: {
    name: string;
  };
}

export default function RecentAssignments() {

  const [assignments,
    setAssignments] =
    useState<Assignment[]>([]);

  async function loadAssignments() {

    try {

      const res = await fetch(
        "/api/assignments"
      );

      const data =
        await res.json();

      setAssignments(
        data.slice(0, 5)
      );

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-4 text-xl font-bold">
        Últimas asignaciones
      </h2>

      <div className="space-y-4">

        {assignments.map(
          (assignment) => (

            <div
              key={assignment.id}
              className="rounded-xl border p-4"
            >

              <p className="font-medium">
                {assignment.asset.name}
              </p>

              <p className="text-sm text-gray-500">
                Asignado a{" "}
                {
                  assignment.employee
                    .name
                }
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}