import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


// PUT - Actualizar empleado

export async function PUT(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const body = await req.json();

    const { id } =
      await context.params;

    const employee =
      await prisma.employee.update({
        where: {
          id,
        },

        data: {
          name: body.name,

          email: body.email,

          phone: body.phone,

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
          "Error actualizando empleado",
      },
      {
        status: 500,
      }
    );
  }
}


// DELETE - Eliminar empleado

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    await prisma.employee.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "Empleado eliminado",
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