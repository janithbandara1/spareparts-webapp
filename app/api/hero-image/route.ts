import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const heroImage = await prisma.heroImage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!heroImage) {
      return NextResponse.json({
        imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop',
        altText: 'Premium Auto Parts',
      });
    }

    return NextResponse.json(heroImage);
  } catch (error) {
    console.error('Error fetching hero image:', error);
    return NextResponse.json({ error: 'Failed to fetch hero image' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, altText, publicId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Delete old hero image if it exists
    const oldHeroImage = await prisma.heroImage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (oldHeroImage?.publicId) {
      // Optionally delete from Cloudinary here if needed
      try {
        const { v2: cloudinary } = require('cloudinary');
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        await cloudinary.uploader.destroy(oldHeroImage.publicId);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
      }
    }

    // Create new hero image
    const heroImage = await prisma.heroImage.create({
      data: {
        imageUrl,
        altText: altText || 'Premium Auto Parts',
        publicId: publicId || null,
      },
    });

    return NextResponse.json(heroImage);
  } catch (error) {
    console.error('Error saving hero image:', error);
    return NextResponse.json({ error: 'Failed to save hero image' }, { status: 500 });
  }
}
