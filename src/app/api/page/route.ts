import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let page = await prisma.page.findUnique({
    where: { userId: session.user.id },
  });

  if (!page) {
    page = await prisma.page.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json(page);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = pageSchema.parse(body);

    const page = await prisma.page.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { userId: session.user.id, ...data },
    });

    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }
}
