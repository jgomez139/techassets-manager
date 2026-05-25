import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


// PUT - Devolver activo

export async function PUT(
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

    // Buscar asignación

    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id,
        },
      });

    if (!assignment) {

      return NextResponse.json(
        {
          error:
            "Asignación no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    // Actualizar asignación

    const updatedAssignment =
      await prisma.assignment.update({
        where: {
          id,
        },

        data: {
          returnedAt:
            new Date(),
        },

        include: {
          asset: true,

          employee: true,
        },
      });

    // Cambiar estado activo

    await prisma.asset.update({
      where: {
        id:
          assignment.assetId,
      },

      data: {
        status:
          "IN_STORAGE",
      },
    });

    return NextResponse.json(
      updatedAssignment
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error devolviendo activo",
      },
      {
        status: 500,
      }
    );
  }
}


// DELETE - Eliminar asignación

export async function DELETE(
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

    await prisma.assignment.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "Asignación eliminada",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error eliminando asignación",
      },
      {
        status: 500,
      }
    );
  }
}