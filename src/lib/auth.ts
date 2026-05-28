import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "change_this";

export async function getUserFromToken() {

  try {

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "accessToken"
      )?.value;

    if (!token) {

      return null;
    }

    const payload =
      jwt.verify(
        token,
        JWT_SECRET
      ) as {
        userId: string;

        role: string;
      };

    return {
      userId:
        payload.userId,

      role:
        payload.role,
    };

  } catch (error) {

    console.error(error);

    return null;
  }
}

export async function requireRole(
  roles: string[]
) {

  const user =
    await getUserFromToken();

  if (!user) {

    return {
      error:
        "No autorizado",

      status: 401,
    };
  }

  if (
    !roles.includes(
      user.role
    )
  ) {

    return {
      error:
        "Acceso denegado",

      status: 403,
    };
  }

  return user;
}