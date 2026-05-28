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

    const employees =
      await prisma.employee.findMany({

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return NextResponse.json(
      employees
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error obteniendo empleados",
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

    const employee =
      await prisma.employee.create({

        data: {
          name:
            body.name,

          email:
            body.email,

          phone:
            body.phone,

          position:
            body.position,

          department:
            body.department,
        },
      });

    return NextResponse.json(
      employee
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error creando empleado",
      },
      {
        status: 500,
      }
    );
  }
}