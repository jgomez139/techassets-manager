import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const maintenances =
      await prisma.maintenance.findMany({

        include: {

          asset: true,

          technician: true,
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
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const maintenance =
      await prisma.maintenance.create({

        data: {

          assetId:
            body.assetId,

          technicianId:
            body.technicianId,

          description:
            body.description,

          maintenanceDate:
            new Date(
              body.maintenanceDate
            ),

          type: body.type,

          cost: body.cost
            ? Number(body.cost)
            : null,

          status:
            body.status,
        },

        include: {

          asset: true,

          technician: true,
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
      {
        status: 500,
      }
    );
  }
}