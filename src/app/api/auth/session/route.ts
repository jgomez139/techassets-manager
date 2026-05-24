import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "change_this";

export async function GET(req: NextRequest) {
  const access = req.cookies.get("accessToken")?.value;
  if (!access) return NextResponse.json({ user: null });

  try {
    const payload: any = jwt.verify(access, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
