import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const link = await prisma.link.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = linkSchema.partial().parse(body);

    const updated = await prisma.link.update({
      where: { id: params.id },
      data: {
        ...data,
        iconUrl: data.iconUrl || null,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const link = await prisma.link.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
