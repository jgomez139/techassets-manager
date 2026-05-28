import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

/* =========================================
   ACTUALIZAR ASIGNACIÓN
========================================= */

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {

    // Next.js 16
    const { id } =
      await params;

    // Soportar body vacío
    let body: any = {};

    try {

      body =
        await req.json();

    } catch {

      body = {};
    }

    const assignment =
      await prisma.assignment.update({

        where: {
          id,
        },

        data: {

          returnedAt:
            body.returnedAt
              ? new Date(
                  body.returnedAt
                )
              : new Date(),

          notes:
            body.notes ??
            undefined,
        },

        include: {

          asset: true,

          employee: true,
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
          "Error actualizando asignación",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   ELIMINAR ASIGNACIÓN
========================================= */

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {

    // Next.js 16
    const { id } =
      await params;

    await prisma.assignment.delete({

      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
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