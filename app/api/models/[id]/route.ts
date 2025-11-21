import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const modelId = parseInt(id);
    const { name, brandId } = await request.json();
    const model = await prisma.model.update({
      where: { id: modelId },
      data: { name, brandId },
      include: { brand: true },
    });
    return NextResponse.json(model);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update model" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const modelId = parseInt(id);
    await prisma.model.delete({
      where: { id: modelId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete model" }, { status: 500 });
  }
}