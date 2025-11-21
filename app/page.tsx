import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Footer from "@/components/footer";

export default function Home() {
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop",
      title: "Premium Auto Parts",
      description: "Discover quality spare parts for every vehicle"
    },
    {
      url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=600&fit=crop",
      title: "Fast & Reliable",
      description: "Quick delivery to get you back on the road"
    },
    {
      url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&h=600&fit=crop",
      title: "Expert Support",
      description: "Professional guidance for all your needs"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Full-Width Carousel */}
      <section className="relative">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[600px] w-full">
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center justify-center">
                    <div className="text-white text-center max-w-2xl px-4">
                      <h1 className="text-6xl font-extrabold mb-6">
                        {image.title}
                      </h1>
                      <p className="text-2xl mb-8">
                        {image.description}
                      </p>
                      <div className="space-x-4">
                        <Button asChild size="lg">
                          <Link href="/items">Browse Items</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose spareparts-webapp?
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
