import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: { brand: true, model: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, name, description, price, quantity, imageUrl, condition, brandId, modelId } = body;

    const item = await prisma.item.create({
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

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}