import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  try {

    const { id } = await params;

    const body = await req.json();

    const asset =
      await prisma.asset.update({

        where: {
          id,
        },

        data: {
          name: body.name,

          brand: body.brand,

          model: body.model,

          serialNumber:
            body.serialNumber,

          inventoryCode:
            body.inventoryCode,

          status: body.status,

          description:
            body.description,

          categoryId:
            body.categoryId,

          purchaseCost:
            body.purchaseCost
              ? Number(
                  body.purchaseCost
                )
              : null,
        },

        include: {
          category: true,
        },
      });

    return NextResponse.json(asset);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error actualizando activo",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  try {

    const { id } = await params;

    await prisma.asset.update({

      where: {
        id,
      },

      data: {
        isDeleted: true,
      },
    });

    return NextResponse.json({
      message:
        "Activo eliminado",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error eliminando activo",
      },
      { status: 500 }
    );
  }
}