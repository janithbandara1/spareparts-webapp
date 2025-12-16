import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEM_CONDITIONS = [
  { value: 'BRAND_NEW', label: 'Brand New' },
  { value: 'RECONDITIONED', label: 'Reconditioned' },
  { value: 'USED', label: 'Used' },
] as const;

const ITEMS_PER_PAGE = 10;

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const condition = typeof params.condition === 'string' ? params.condition : undefined;
  const brand = typeof params.brand === 'string' ? params.brand : undefined;
  const model = typeof params.model === 'string' ? params.model : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const currentPage = page > 0 ? page : 1;

  // Fetch brands and models for filter options
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const models = await prisma.model.findMany({ 
    orderBy: { name: 'asc' },
    include: { brand: true }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  
  // Search by name or part number
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { partNumber: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (condition && condition !== 'all') {
    where.condition = condition;
  }
  if (brand && brand !== 'all') {
    where.brandId = parseInt(brand);
  }
  if (model && model !== 'all') {
    where.modelId = parseInt(model);
  }

  // Get total count for pagination
  const totalItems = await prisma.item.count({ where });
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const items = await prisma.item.findMany({ 
    where,
    include: {
      brand: true,
      model: true,
    },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { createdAt: 'desc' },
  });

  // Build query string for pagination links
  const buildQueryString = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (condition && condition !== 'all') params.set('condition', condition);
    if (brand && brand !== 'all') params.set('brand', brand);
    if (model && model !== 'all') params.set('model', model);
    params.set('page', pageNum.toString());
    return `?${params.toString()}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-64 px-4 md:px-0 md:pr-6 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <form method="get" className="space-y-4">
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
              {/* Results info */}
              <div className="mb-4 text-sm text-gray-600">
                {search && totalItems === 0 ? (
                  <p>
                    There are no products that match "<span className="font-semibold">{search}</span>"
                  </p>
                ) : search ? (
                  <p>
                    Showing {totalItems} {totalItems === 1 ? 'result' : 'results'} for "<span className="font-semibold">{search}</span>"
                  </p>
                ) : (
                  <p>Showing {items.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} items</p>
                )}
              </div>

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
                        <p className="text-sm text-gray-600">Part Number: {item.partNumber}</p>
                        <p className="text-base font-semibold">Rs {item.price}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity > 0 ? (
                            <span className="text-green-600">In Stock ({item.quantity})</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Button asChild variant="outline" className="w-full" disabled={item.quantity === 0}>
                          <Link href={`/items/${item.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious href={buildQueryString(currentPage - 1)} />
                        </PaginationItem>
                      )}
                      
                      {getPageNumbers().map((pageNum, index) => (
                        <PaginationItem key={index}>
                          {pageNum === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink 
                              href={buildQueryString(pageNum)} 
                              isActive={pageNum === currentPage}
                            >
                              {pageNum}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext href={buildQueryString(currentPage + 1)} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}