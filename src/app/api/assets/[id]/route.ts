import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";


// =========================
// UPDATE ASSET
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

    // IMPORTANTE:
    // Next.js 16 requiere await params

    const { id } =
      await params;

    const body =
      await req.json();

    const updatedAsset =
      await prisma.asset.update({

        where: {
          id,
        },

        data: {

          name:
            body.name,

          brand:
            body.brand,

          model:
            body.model,

          serialNumber:
            body.serialNumber,

          inventoryCode:
            body.inventoryCode,

          description:
            body.description,

          status:
            body.status,

          purchaseCost:
            body.purchaseCost
              ? Number(
                  body.purchaseCost
                )
              : null,

          categoryId:
            body.categoryId,
        },

        include: {
          category: true,
        },
      });

    return NextResponse.json(
      updatedAsset
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando activo",
      },
      {
        status: 500,
      }
    );
  }
}


// =========================
// DELETE ASSET
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

    // IMPORTANTE:
    // Next.js 16 requiere await params

    const { id } =
      await params;

    await prisma.asset.delete({

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
          "Error eliminando activo",
      },
      {
        status: 500,
      }
    );
  }
}