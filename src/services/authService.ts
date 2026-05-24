import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET ?? "change_this";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "change_this_too";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export async function saveRefreshToken(userId: string, token: string) {
  // store a hash of the refresh token for revocation support
  const hash = await bcrypt.hash(token, 10);
  const decoded: any = jwt.decode(token) || {};
  const exp = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);

  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hash,
      expiresAt: exp,
    },
  });
}

export async function verifyRefreshToken(token: string) {
  try {
    const payload: any = jwt.verify(token, JWT_REFRESH_SECRET);
    const tokens = await prisma.refreshToken.findMany({ where: { userId: payload.userId } });
    for (const t of tokens) {
      const ok = await bcrypt.compare(token, t.tokenHash);
      if (ok) return payload;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 15,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth",
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

export async function getUserFromRequest(request: NextRequest) {
  const access = request.cookies.get("accessToken")?.value;
  if (!access) return null;

  try {
    const payload: any = jwt.verify(access, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
  } catch (err) {
    return null;
  }
}

export function hasRole(user: any, roles: string[] | string) {
  if (!user) return false;
  const wanted = Array.isArray(roles) ? roles : [roles];
  return wanted.includes(user.role);
}
