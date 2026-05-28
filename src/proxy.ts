import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "change_this";

export async function proxy(
  request: NextRequest
) {

  const token =
    request.cookies.get(
      "accessToken"
    )?.value;

  const pathname =
    request.nextUrl.pathname;

  // Rutas protegidas
  const protectedRoutes = [
    "/dashboard",
    "/assets",
    "/employees",
    "/categories",
    "/assignments",
    "/maintenances",
  ];

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  // Verificar token
  let authenticated =
    false;

  if (token) {

    try {

      jwt.verify(
        token,
        JWT_SECRET
      );

      authenticated = true;

    } catch (error) {

      authenticated = false;
    }
  }

  // Si NO está autenticado
  if (
    !authenticated &&
    isProtectedRoute
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  // Si YA está autenticado
  if (
    authenticated &&
    (
      pathname.startsWith(
        "/login"
      ) ||
      pathname.startsWith(
        "/register"
      )
    )
  ) {

    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {

  matcher: [
    "/dashboard/:path*",
    "/assets/:path*",
    "/employees/:path*",
    "/categories/:path*",
    "/assignments/:path*",
    "/maintenances/:path*",
    "/login",
    "/register",
  ],
};