import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { brand: true, model: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    const body = await request.json();
    const { partNumber, name, description, price, quantity, imageUrl, condition, brandId, modelId } = body;

    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        partNumber,
        name,
        description,
        price,
        quantity,
        imageUrl,
        condition,
        brandId,
        modelId,
      },
      include: { brand: true, model: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);

    await prisma.item.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}