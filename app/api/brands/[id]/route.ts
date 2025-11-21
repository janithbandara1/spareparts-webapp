import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brandId = parseInt(id);
    const { name } = await request.json();
    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: { name },
    });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brandId = parseInt(id);
    await prisma.brand.delete({
      where: { id: brandId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}