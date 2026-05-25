import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


// GET - Obtener empleados

export async function GET() {

  try {

    const employees =
      await prisma.employee.findMany({
        orderBy: {
          createdAt: "desc",
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


// POST - Crear empleado

export async function POST(
  req: Request
) {

  try {

    const body = await req.json();

    const employee =
      await prisma.employee.create({
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
          "Error creando empleado",
      },
      {
        status: 500,
      }
    );
  }
}