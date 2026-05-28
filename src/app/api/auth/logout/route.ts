import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/services/authService";

export async function POST() {

  try {

    const response =
      NextResponse.json({
        ok: true,
      });

    clearAuthCookies(
      response
    );

    return response;

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error cerrando sesión",
      },
      {
        status: 500,
      }
    );
  }
}
