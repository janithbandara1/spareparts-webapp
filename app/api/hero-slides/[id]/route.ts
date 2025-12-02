import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const heroSlide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!heroSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(heroSlide);
  } catch (error) {
    console.error("Error fetching hero slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slide" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { imageUrl, title, description, order } = body;

    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    const heroSlide = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(title && { title }),
        ...(description && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(heroSlide);
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Hero slide deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 }
    );
  }
}
