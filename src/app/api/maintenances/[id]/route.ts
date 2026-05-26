import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";


export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    // Buscar mantenimiento

    const maintenance =
      await prisma.maintenance.findUnique({

        where: {
          id,
        },
      });

    if (!maintenance) {

      return NextResponse.json(
        {
          error:
            "Mantenimiento no encontrado",
        },
        { status: 404 }
      );
    }

    // Actualizar mantenimiento

    const updatedMaintenance =
      await prisma.maintenance.update({

        where: {
          id,
        },

        data: {
          status:
            "COMPLETED",
        },
      });

    // Cambiar activo nuevamente a almacén

    await prisma.asset.update({

      where: {
        id:
          maintenance.assetId,
      },

      data: {
        status:
          "IN_STORAGE",
      },
    });

    return NextResponse.json(
      updatedMaintenance
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando mantenimiento",
      },
      { status: 500 }
    );
  }
}