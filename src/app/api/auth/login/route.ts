import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  saveRefreshToken,
  setAuthCookies,
} from "@/services/authService";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest
) {

  try {

    const body =
      await req.json();

    const {
      email,
      password,
    } = body;

    if (
      !email ||
      !password
    ) {

      return NextResponse.json(
        {
          error:
            "Faltan campos",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.user.findUnique({

        where: {
          email,
        },
      });

    if (!user) {

      return NextResponse.json(
        {
          error:
            "Credenciales inválidas",
        },
        {
          status: 401,
        }
      );
    }

    const ok =
      await verifyPassword(
        password,
        user.password
      );

    if (!ok) {

      return NextResponse.json(
        {
          error:
            "Credenciales inválidas",
        },
        {
          status: 401,
        }
      );
    }

    const access =
      createAccessToken({

        userId:
          user.id,

        role:
          user.role,
      });

    const refresh =
      createRefreshToken({

        userId:
          user.id,
      });

    await saveRefreshToken(
      user.id,
      refresh
    );

    const response =
  NextResponse.json({

    ok: true,

    user: {
      id: user.id,

      email:
        user.email,

      name:
        user.name,

      role:
        user.role,
    },
  });

setAuthCookies(
  response,
  access,
  refresh
);

return response;

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error iniciando sesión",
      },
      {
        status: 500,
      }
    );
  }
}
