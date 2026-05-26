import {
  MaintenanceStatus,
  MaintenanceType,
} from "@prisma/client";


export const maintenanceTypeLabels:
  Record<
    MaintenanceType,
    string
  > = {

  PREVENTIVE:
    "Preventivo",

  CORRECTIVE:
    "Correctivo",
};


export const maintenanceStatusLabels:
  Record<
    MaintenanceStatus,
    string
  > = {

  PENDING:
    "Pendiente",

  IN_PROGRESS:
    "En progreso",

  COMPLETED:
    "Completado",
};


export const maintenanceStatusColors:
  Record<
    MaintenanceStatus,
    string
  > = {

  PENDING:
    "bg-yellow-100 text-yellow-700",

  IN_PROGRESS:
    "bg-blue-100 text-blue-700",

  COMPLETED:
    "bg-green-100 text-green-700",
};