import { prisma } from "@/lib/prisma";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import {
  NextRequest,
  NextResponse,
} from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "change_this";

const JWT_REFRESH_SECRET =
  process.env
    .JWT_REFRESH_SECRET ??
  "change_this_too";


// =========================
// PASSWORDS
// =========================

export async function hashPassword(
  password: string
) {

  return bcrypt.hash(
    password,
    10
  );
}

export async function verifyPassword(
  password: string,
  hash: string
) {

  return bcrypt.compare(
    password,
    hash
  );
}


// =========================
// TOKENS
// =========================

export function createAccessToken(
  payload: object
) {

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function createRefreshToken(
  payload: object
) {

  return jwt.sign(
    payload,
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
}


// =========================
// REFRESH TOKENS
// =========================

export async function saveRefreshToken(
  userId: string,
  token: string
) {

  const hash =
    await bcrypt.hash(
      token,
      10
    );

  const decoded =
    jwt.decode(token) as {
      exp?: number;
    } | null;

  const expiresAt =
    decoded?.exp
      ? new Date(
          decoded.exp * 1000
        )
      : new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        );

  return prisma.refreshToken.create({
    data: {
      userId,

      tokenHash: hash,

      expiresAt,
    },
  });
}

export async function verifyRefreshToken(
  token: string
) {

  try {

    const payload =
      jwt.verify(
        token,
        JWT_REFRESH_SECRET
      ) as {
        userId: string;
      };

    const tokens =
      await prisma.refreshToken.findMany({
        where: {
          userId:
            payload.userId,
        },
      });

    for (const t of tokens) {

      const ok =
        await bcrypt.compare(
          token,
          t.tokenHash
        );

      if (ok) {
        return payload;
      }
    }

    return null;

  } catch (error) {

    console.error(error);

    return null;
  }
}


// =========================
// COOKIES
// =========================

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {

  const isProd =
    process.env.NODE_ENV ===
    "production";

  response.cookies.set(
    "accessToken",
    accessToken,
    {
      httpOnly: true,

      secure: isProd,

      sameSite: "lax",

      path: "/",

      maxAge:
        60 * 15,
    }
  );

  response.cookies.set(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,

      secure: isProd,

      sameSite: "lax",

      path: "/",

      maxAge:
        60 *
        60 *
        24 *
        7,
    }
  );

  return response;
}

export function clearAuthCookies(
  response: NextResponse
) {

  response.cookies.set(
    "accessToken",
    "",
    {
      expires:
        new Date(0),

      path: "/",
    }
  );

  response.cookies.set(
    "refreshToken",
    "",
    {
      expires:
        new Date(0),

      path: "/",
    }
  );

  return response;
}


// =========================
// USER FROM REQUEST
// =========================

export async function getUserFromRequest(
  request: NextRequest
) {

  try {

    const accessToken =
      request.cookies.get(
        "accessToken"
      )?.value;

    if (!accessToken) {
      return null;
    }

    const payload =
      jwt.verify(
        accessToken,
        JWT_SECRET
      ) as {
        userId: string;
      };

    const user =
      await prisma.user.findUnique({
        where: {
          id:
            payload.userId,
        },
      });

    return user;

  } catch (error) {

    console.error(error);

    return null;
  }
}


// =========================
// ROLES
// =========================

export function hasRole(
  user: any,
  roles: string[] | string
) {

  if (!user) {
    return false;
  }

  const allowedRoles =
    Array.isArray(roles)
      ? roles
      : [roles];

  return allowedRoles.includes(
    user.role
  );
}
