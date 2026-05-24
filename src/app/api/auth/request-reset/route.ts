import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Skeleton: create a password reset token and (TODO) send email
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ ok: false }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true }); // don't reveal

  const token = uuidv4();
  // TODO: persist token and send email. For now just return token in response for dev.
  return NextResponse.json({ ok: true, token });
}
