import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";


export async function GET() {

  try {

    const assignments =
      await prisma.assignment.findMany({

        include: {
          asset: true,

          employee: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      assignments
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error obteniendo asignaciones",
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
      employeeId,
      notes,
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

    // Verificar disponibilidad

    if (
      asset.status !==
      "IN_STORAGE"
    ) {

      return NextResponse.json(
        {
          error:
            "El activo no está disponible",
        },
        { status: 400 }
      );
    }

    // Crear asignación

    const assignment =
      await prisma.assignment.create({
        data: {
          assetId,

          employeeId,

          notes,
        },

        include: {
          asset: true,

          employee: true,
        },
      });

    // Cambiar estado activo

    await prisma.asset.update({
      where: {
        id: assetId,
      },

      data: {
        status: "IN_USE",
      },
    });

    return NextResponse.json(
      assignment
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error creando asignación",
      },
      { status: 500 }
    );
  }
}