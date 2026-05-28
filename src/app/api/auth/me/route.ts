import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import { prisma } from "@/lib/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "change_this";

export async function GET(
  req: NextRequest
) {
  try {

    const token =
      req.cookies.get(
        "accessToken"
      )?.value;

    if (!token) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );
    }

    const payload =
      jwt.verify(
        token,
        JWT_SECRET
      ) as {
        userId: string;
      };

    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

    if (!user) {

      return NextResponse.json(
        {
          error: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Token inválido",
      },
      {
        status: 401,
      }
    );
  }
}