"use client";

import { useEffect, useState } from "react";
import { Brand } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { BrandModal } from "@/components/brand-modal";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleEdit(brand)} variant="outline" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleDelete(brand.id)}
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data: Brand[] = await response.json();
        setBrands(data);
      }
    };
    fetchBrands();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        const response = await fetch(`/api/brands/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setBrands(brands.filter(brand => brand.id !== id));
        } else {
          alert("Error deleting brand");
        }
      } catch {
        alert("Error deleting brand");
      }
    }
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: { name: string }) => {
    setLoading(true);

    try {
      let response;
      if (isEditing && selectedBrand) {
        response = await fetch(`/api/brands/${selectedBrand.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/brands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        const updatedBrand = await response.json();
        if (isEditing) {
          setBrands(brands.map(brand => brand.id === selectedBrand!.id ? updatedBrand : brand));
        } else {
          setBrands([...brands, updatedBrand]);
        }
        setDialogOpen(false);
        setIsEditing(false);
        setSelectedBrand(null);
      } else {
        alert(`Error ${isEditing ? "updating" : "creating"} brand`);
      }
    } catch {
      alert(`Error ${isEditing ? "updating" : "creating"} brand`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Brands</h1>
        <Button onClick={() => { setIsEditing(false); setSelectedBrand(null); setDialogOpen(true); }}>Add New Brand</Button>
      </div>
      <BrandModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedBrand || {}}
        isEditing={isEditing}
        loading={loading}
      />
      <DataTable columns={columns} data={brands} />
    </>
  );
}