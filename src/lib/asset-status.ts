import { AssetStatus } from "@prisma/client";

export const assetStatusLabels:
  Record<AssetStatus, string> = {

  IN_USE: "En uso",

  IN_STORAGE: "En almacén",

  UNDER_REPAIR: "En reparación",

  DISPOSED: "Dado de baja",
};

export const assetStatusColors:
  Record<AssetStatus, string> = {

  IN_USE:
    "bg-green-100 text-green-700",

  IN_STORAGE:
    "bg-blue-100 text-blue-700",

  UNDER_REPAIR:
    "bg-yellow-100 text-yellow-700",

  DISPOSED:
    "bg-red-100 text-red-700",
};