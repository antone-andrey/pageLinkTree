import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reorderSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { links } = reorderSchema.parse(body);

    await prisma.$transaction(
      links.map((link) =>
        prisma.link.updateMany({
          where: { id: link.id, userId: session.user.id },
          data: { position: link.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }
}
