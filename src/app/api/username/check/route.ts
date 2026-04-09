import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usernameSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    usernameSchema.parse(username);
  } catch {
    return NextResponse.json({ available: false, error: "Invalid username format" });
  }

  const session = await auth();
  const existing = await prisma.user.findUnique({ where: { username } });

  // If the found user is the current user, the username is still "available" to them
  const isSelf = existing && session?.user?.id && existing.id === session.user.id;
  return NextResponse.json({ available: !existing || isSelf });
}
