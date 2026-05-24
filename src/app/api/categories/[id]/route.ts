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

    const category =
      await prisma.category.update({
        where: {
          id,
        },
        data: {
          name: body.name,
          description: body.description,
        },
      });

    return NextResponse.json(category);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error actualizando categoría",
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

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Categoría eliminada",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error eliminando categoría",
      },
      { status: 500 }
    );
  }
}