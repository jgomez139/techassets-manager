import { prisma } from "@/lib/prisma";

import {
  NextResponse,
} from "next/server";

import {
  requireRole,
} from "@/lib/auth";

export async function GET() {

  const auth =
    await requireRole([
      "ADMIN",
      "SUPERVISOR",
    ]);

  if ("error" in auth) {

    return NextResponse.json(
      {
        error: auth.error,
      },
      {
        status:
          auth.status,
      }
    );
  }

  try {

    const assets =
      await prisma.asset.findMany({

        include: {
          category: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return NextResponse.json(
      assets
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error obteniendo activos",
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

  const auth =
    await requireRole([
      "ADMIN",
    ]);

  if ("error" in auth) {

    return NextResponse.json(
      {
        error: auth.error,
      },
      {
        status:
          auth.status,
      }
    );
  }

  try {

    const body =
      await req.json();

    const asset =
      await prisma.asset.create({

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
              ? parseFloat(
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
      asset
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error creando activo",
      },
      {
        status: 500,
      }
    );
  }
}