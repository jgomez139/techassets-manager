import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";


// =========================
// UPDATE EMPLOYEE
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

    const updatedEmployee =
      await prisma.employee.update({

        where: {
          id,
        },

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
      updatedEmployee
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando empleado",
      },
      {
        status: 500,
      }
    );
  }
}


// =========================
// DELETE EMPLOYEE
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

    await prisma.employee.delete({

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
          "Error eliminando empleado",
      },
      {
        status: 500,
      }
    );
  }
}