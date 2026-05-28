import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  hashPassword,
} from "@/services/authService";

export async function POST(
  req: NextRequest
) {

  try {

    const body =
      await req.json();

    const {
      name,
      email,
      password,
    } = body;

    // Validaciones
    if (
      !name ||
      !email ||
      !password
    ) {

      return NextResponse.json(
        {
          error:
            "Todos los campos son obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    // Verificar usuario existente
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {

      return NextResponse.json(
        {
          error:
            "El correo ya está registrado",
        },
        {
          status: 400,
        }
      );
    }

    // Hash password
    const hashedPassword =
      await hashPassword(
        password
      );

    // Crear usuario
    const user =
      await prisma.user.create({
        data: {
          name,

          email,

          password:
            hashedPassword,

          role: "ADMIN",
        },
      });

    return NextResponse.json({
      ok: true,

      user: {
        id: user.id,

        name: user.name,

        email: user.email,
      },
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error registrando usuario",
      },
      {
        status: 500,
      }
    );
  }
}
