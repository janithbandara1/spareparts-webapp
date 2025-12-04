import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ZoomableImage from "@/components/zoomable-image";

const ITEM_CONDITIONS = [
  { value: 'BRAND_NEW', label: 'Brand New' },
  { value: 'RECONDITIONED', label: 'Reconditioned' },
  { value: 'USED', label: 'Used' },
] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const itemId = parseInt(id, 10);
  if (isNaN(itemId)) {
    notFound();
  }
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { brand: true, model: true },
  });

  if (!item) {
    notFound();
  }

  const whatsappMessage = `Hi, I'm interested in the spare part: ${item.name}. Price: $${item.price}. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const conditionLabel = ITEM_CONDITIONS.find(c => c.value === item.condition)?.label || item.condition;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              {item.imageUrl && (
                <Card>
                  <CardContent className="p-0">
                    <ZoomableImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-96 lg:h-[500px]"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-4">
                  <h1 className="text-3xl font-bold">${item.price}</h1>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Part Number:</span> {item.partNumber}</p>
                  {item.brand && (
                    <p className="text-gray-700"><span className="font-medium">Brand:</span> {item.brand.name}</p>
                  )}
                  {item.model && (
                    <p className="text-gray-700"><span className="font-medium">Model:</span> {item.model.name}</p>
                  )}
                  {item.condition && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Condition:</span>
                      <Badge variant={item.condition === 'BRAND_NEW' ? 'default' : item.condition === 'RECONDITIONED' ? 'secondary' : 'outline'}>
                        {conditionLabel}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Availability:</span>
                    <Badge variant={item.quantity > 0 ? 'default' : 'destructive'}>
                      {item.quantity > 0 ? `In Stock (${item.quantity})` : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Seller</h2>
                <p className="text-gray-600">Get in touch with the seller for more details or to make a purchase.</p>
                <Button asChild size="lg" className="w-full sm:w-auto" disabled={item.quantity === 0}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    {item.quantity === 0 ? 'Out of Stock' : 'Contact via WhatsApp'}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}