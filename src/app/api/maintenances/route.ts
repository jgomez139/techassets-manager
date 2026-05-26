import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";


export async function GET() {

  try {

    const maintenances =
      await prisma.maintenance.findMany({

        include: {
          asset: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      maintenances
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error obteniendo mantenimientos",
      },
      { status: 500 }
    );
  }
}


export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      assetId,
      technicianName,
      type,
      description,
      maintenanceDate,
      cost,
      observations,
    } = body;

    // Validar activo

    const asset =
      await prisma.asset.findUnique({
        where: {
          id: assetId,
        },
      });

    if (!asset) {

      return NextResponse.json(
        {
          error:
            "Activo no encontrado",
        },
        { status: 404 }
      );
    }

    // Crear mantenimiento

    const maintenance =
      await prisma.maintenance.create({

        data: {
          assetId,

          technicianName,

          type,

          description,

          maintenanceDate:
            new Date(
              maintenanceDate
            ),

          cost:
            cost && cost !== ""
              ? parseFloat(cost)
              : null,

          observations,

          status: "PENDING",
        },

        include: {
          asset: true,
        },
      });

    // Cambiar activo a reparación

    await prisma.asset.update({
      where: {
        id: assetId,
      },

      data: {
        status:
          "UNDER_REPAIR",
      },
    });

    return NextResponse.json(
      maintenance
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error creando mantenimiento",
      },
      { status: 500 }
    );
  }
}