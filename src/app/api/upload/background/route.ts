import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!user || user.plan === "FREE") {
    return NextResponse.json(
      { error: "Custom backgrounds are available on Pro and Business plans." },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, or WebP." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum 10 MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const path = `backgrounds/${session.user.id}.${ext}`;

    let url: string;
    try {
      url = await uploadFile("pagedrop", path, buffer, file.type);
      url = `${url}?t=${Date.now()}`;
    } catch {
      // Fallback to base64 if Supabase Storage is not configured
      const base64 = buffer.toString("base64");
      url = `data:${file.type};base64,${base64}`;
    }

    await prisma.page.update({
      where: { userId: session.user.id },
      data: { customBgUrl: url },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Background upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
