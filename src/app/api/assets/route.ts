import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const assets =
      await prisma.asset.findMany({

        where: {
          isDeleted: false,
        },

        include: {
          category: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(assets);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error obteniendo activos",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request
) {
  try {

    const body = await req.json();

    const asset =
      await prisma.asset.create({

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

          supplier:
            body.supplier,

          invoiceNumber:
            body.invoiceNumber,
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
        error: "Error creando activo",
      },
      { status: 500 }
    );
  }
}