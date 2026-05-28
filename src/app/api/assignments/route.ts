import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";

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

    const assignments =
      await prisma.assignment.findMany({

        include: {
          asset: true,

          employee: true,
        },

        orderBy: {
          assignedAt:
            "desc",
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

    const body =
      await req.json();

    const assignment =
      await prisma.assignment.create({

        data: {
          assetId:
            body.assetId,

          employeeId:
            body.employeeId,

          notes:
            body.notes,
        },

        include: {
          asset: true,

          employee: true,
        },
      });

    await prisma.asset.update({

        where: {
          id: body.assetId,
        },

        data: {
          status:
            "IN_USE",
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
      {
        status: 500,
      }
    );
  }
}