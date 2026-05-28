import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";


// =========================
// UPDATE CATEGORY
// =========================

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

    const body =
      await req.json();

    const {
      name,
      description,
    } = body;

    const { id } =
      await params;

    const updatedCategory =
      await prisma.category.update({

        where: {
          id,
        },

        data: {
          name,
          description,
        },
      });

    return NextResponse.json(
      updatedCategory
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando categoría",
      },
      {
        status: 500,
      }
    );
  }
}


// =========================
// DELETE CATEGORY
// =========================

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

    const { id } =
      await params;

    // Verificar si existen activos
    // usando esta categoría

    const assetsCount =
      await prisma.asset.count({

        where: {
          categoryId: id,
        },
      });

    // Si existen activos
    // NO permitir eliminar

    if (assetsCount > 0) {

      return NextResponse.json(
        {
          error:
            "No puedes eliminar esta categoría porque tiene activos asociados",
        },
        {
          status: 400,
        }
      );
    }

    // Eliminar categoría

    await prisma.category.delete({

      where: {
        id,
      },
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error eliminando categoría",
      },
      {
        status: 500,
      }
    );
  }
}