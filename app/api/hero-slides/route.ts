import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(heroSlides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, title, description, order } = body;

    if (!imageUrl || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const heroSlide = await prisma.heroSlide.create({
      data: {
        imageUrl,
        title,
        description,
        order: order ?? 0,
      },
    });

    return NextResponse.json(heroSlide, { status: 201 });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to create hero slide" },
      { status: 500 }
    );
  }
}
