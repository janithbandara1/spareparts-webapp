import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getHeroImage() {
  try {
    const heroImage = await prisma.heroImage.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return heroImage || null;
  } catch (error) {
    console.error('Error fetching hero image:', error);
    return null;
  }
}

export default async function Home() {
  // Fetch the latest hero image from database
  const heroImage = await getHeroImage();

  // Fallback to default image if none exists
  const imageData = heroImage || {
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop',
    altText: 'Premium Auto Parts',
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[600px] w-full">
          <Image
            src={imageData.imageUrl}
            alt={imageData.altText || "Premium Auto Parts"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center justify-center">
            <div className="text-white text-center max-w-2xl px-4">
              <h1 className="text-6xl font-extrabold mb-6">
                Premium Auto Parts
              </h1>
              <p className="text-2xl mb-8">
                Discover quality spare parts for every vehicle
              </p>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/items">Browse Items</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose HexaDrive?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-blue-600">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We source only the highest quality spare parts from trusted manufacturers worldwide.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-blue-600">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quick and reliable shipping to get your vehicle back on the road as soon as possible.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-blue-600">Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our knowledgeable team is here to help you find the perfect parts for your needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to Find Your Parts?
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Explore our extensive catalog of spare parts and get started today.
          </p>
          <Button asChild size="lg">
            <Link href="/items">Start Browsing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
