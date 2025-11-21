import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: { brand: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, brandId } = await request.json();
    const model = await prisma.model.create({
      data: { name, brandId },
      include: { brand: true },
    });
    return NextResponse.json(model);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create model" }, { status: 500 });
  }
}