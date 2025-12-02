import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ITEM_CONDITIONS = [
  { value: 'BRAND_NEW', label: 'Brand New' },
  { value: 'RECONDITIONED', label: 'Reconditioned' },
  { value: 'USED', label: 'Used' },
] as const;

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const condition = typeof params.condition === 'string' ? params.condition : undefined;
  const brand = typeof params.brand === 'string' ? params.brand : undefined;
  const model = typeof params.model === 'string' ? params.model : undefined;

  // Fetch brands and models for filter options
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const models = await prisma.model.findMany({ 
    orderBy: { name: 'asc' },
    include: { brand: true }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (condition && condition !== 'all') {
    where.condition = condition;
  }
  if (brand && brand !== 'all') {
    where.brandId = parseInt(brand);
  }
  if (model && model !== 'all') {
    where.modelId = parseInt(model);
  }

  // Search filter for item name or ID
  const search = typeof params.search === 'string' ? params.search.trim() : undefined;
  if (search) {
    if (!isNaN(Number(search))) {
      where.OR = [
        { id: Number(search) },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    } else {
      where.name = { contains: search, mode: 'insensitive' };
    }
  }

  const items = await prisma.item.findMany({ 
    where,
    include: {
      brand: true,
      model: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Filter Sidebar */}
          <aside className="w-64 pr-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <form method="get" className="space-y-4">
              <aside className="w-64 pr-6">
                <div className="mb-6 p-2 bg-white rounded shadow">
                  <Input
                  type="text"
                  name="search"
                  placeholder="🔍 Search by name or ID"
                  defaultValue={search || ""}
                  className="mb-2 border-2 border-blue-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                  />
                  <Button type="submit" variant="default" className="w-full mt-2">Search</Button>
                </div>
              </aside>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select name="condition" defaultValue={condition || 'all'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {ITEM_CONDITIONS.map((conditionOption) => (
                      <SelectItem key={conditionOption.value} value={conditionOption.value}>
                        {conditionOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select name="brand" defaultValue={brand || 'all'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brandOption) => (
                      <SelectItem key={brandOption.id} value={brandOption.id.toString()}>
                        {brandOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Select name="model" defaultValue={model || 'all'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {models.map((modelOption) => (
                      <SelectItem key={modelOption.id} value={modelOption.id.toString()}>
                        {modelOption.name} ({modelOption.brand.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Apply Filters</Button>
            </form>
          </aside>
          {/* Items Grid */}
          <div className="flex-1">
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id}>
                    {item.imageUrl && (
                      <div className="relative w-full h-48">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill
                          className="object-cover" 
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-base font-semibold">${item.price}</p>
                      </div>
                      <div className="mt-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/items/${item.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}