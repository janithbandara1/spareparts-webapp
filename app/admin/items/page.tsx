"use client";

import { useEffect, useState } from "react";
import { Item, Brand, Model } from "@prisma/client";

type ItemWithRelations = Item & { brand: Brand | null; model: Model | null };
import { Button } from "@/components/ui/button";
import { ItemModal } from "@/components/item-modal";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

export default function AdminItemsPage() {
  const [items, setItems] = useState<ItemWithRelations[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithRelations | null>(null);

  const columns: ColumnDef<ItemWithRelations>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "productNumber",
      header: "Product Number",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <div>Rs {price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "brand.name",
      header: "Brand",
      cell: ({ row }) => {
        const brand = row.original.brand;
        return <div>{brand?.name || "None"}</div>;
      },
    },
    {
      accessorKey: "model.name",
      header: "Model",
      cell: ({ row }) => {
        const model = row.original.model;
        return <div>{model?.name || "None"}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleEdit(item)} variant="outline" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleDelete(item.id)}
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
    const fetchItems = async () => {
      const response = await fetch("/api/items");
      if (response.ok) {
        const data: ItemWithRelations[] = await response.json();
        setItems(data);
      }
    };
    const fetchBrands = async () => {
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data: Brand[] = await response.json();
        setBrands(data);
      }
    };
    const fetchModels = async () => {
      const response = await fetch("/api/models");
      if (response.ok) {
        const data: Model[] = await response.json();
        setModels(data);
      }
    };
    fetchItems();
    fetchBrands();
    fetchModels();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setItems(items.filter(item => item.id !== id));
        } else {
          alert("Error deleting item");
        }
      } catch {
        alert("Error deleting item");
      }
    }
  };

  const handleEdit = (item: ItemWithRelations) => {
    setSelectedItem(item);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: {
    partNumber: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    condition: 'BRAND_NEW' | 'RECONDITIONED' | 'USED';
    brandId: number | null;
    modelId: number | null;
  }) => {
    setLoading(true);

    try {
      let response;
      if (isEditing && selectedItem) {
        response = await fetch(`/api/items/${selectedItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        const updatedItem = await response.json();
        if (isEditing) {
          setItems(items.map(item => item.id === selectedItem!.id ? updatedItem : item));
        } else {
          setItems([...items, updatedItem]);
        }
        setDialogOpen(false);
        setIsEditing(false);
        setSelectedItem(null);
      } else {
        alert(`Error ${isEditing ? "updating" : "creating"} item`);
      }
    } catch {
      alert(`Error ${isEditing ? "updating" : "creating"} item`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Items</h1>
        <Button onClick={() => { setIsEditing(false); setSelectedItem(null); setDialogOpen(true); }}>Add New Item</Button>
      </div>
      <ItemModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedItem || {}}
        isEditing={isEditing}
        brands={brands}
        models={models}
        loading={loading}
      />
      <DataTable columns={columns} data={items} />
    </>
  );
}