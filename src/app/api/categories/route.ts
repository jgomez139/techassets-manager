import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";

export async function GET() {

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

    const categories =
      await prisma.category.findMany({

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return NextResponse.json(
      categories
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error obteniendo categorías",
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

    const category =
      await prisma.category.create({

        data: {
          name:
            body.name,

          description:
            body.description,
        },
      });

    return NextResponse.json(
      category
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error creando categoría",
      },
      {
        status: 500,
      }
    );
  }
}