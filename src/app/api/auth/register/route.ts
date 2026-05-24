import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createAccessToken, createRefreshToken, saveRefreshToken, setAuthCookies } from "@/services/authService";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "User exists" }, { status: 409 });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });

  const access = createAccessToken({ userId: user.id, role: user.role });
  const refresh = createRefreshToken({ userId: user.id });
  await saveRefreshToken(user.id, refresh);

  let res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  res = setAuthCookies(res, access, refresh);

  return res;
}
