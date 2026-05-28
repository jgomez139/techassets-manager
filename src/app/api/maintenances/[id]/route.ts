import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// COMPLETAR MANTENIMIENTO
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const maintenance = await prisma.maintenance.update({
      where: {
        id,
      },

      data: {
        status: "COMPLETED",
      },

      include: {
        asset: true,
        technician: true,
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error updating maintenance" },
      { status: 500 }
    );
  }
}

// ELIMINAR MANTENIMIENTO
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.maintenance.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Maintenance deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error deleting maintenance" },
      { status: 500 }
    );
  }
}