import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/services/authService";

export async function POST(req: NextRequest) {
  let res = NextResponse.json({ ok: true });
  res = clearAuthCookies(res);
  return res;
}
