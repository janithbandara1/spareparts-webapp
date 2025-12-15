"use client";

import { useEffect, useState } from "react";
import { Model, Brand } from "@prisma/client";

type ModelWithBrand = Model & {
  brand?: Brand | null;
};
import { Button } from "@/components/ui/button";
import { ModelModal } from "@/components/model-modal";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

export default function AdminModelsPage() {
  const [models, setModels] = useState<ModelWithBrand[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelWithBrand | null>(null);

  const columns: ColumnDef<ModelWithBrand>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const model = row.original;
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleEdit(model)} variant="outline" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleDelete(model.id)}
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
    const fetchModels = async () => {
      const response = await fetch("/api/models");
      if (response.ok) {
        const data: Model[] = await response.json();
        setModels(data);
      }
    };
    const fetchBrands = async () => {
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data: Brand[] = await response.json();
        setBrands(data);
      }
    };
    fetchModels();
    fetchBrands();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this model?")) {
      try {
        const response = await fetch(`/api/models/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setModels(models.filter(model => model.id !== id));
        } else {
          alert("Error deleting model");
        }
      } catch {
        alert("Error deleting model");
      }
    }
  };

  const handleEdit = (model: ModelWithBrand) => {
    setSelectedModel(model);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: { name: string; brandId: number }) => {
    setLoading(true);

    try {
      let response;
      if (isEditing && selectedModel) {
        response = await fetch(`/api/models/${selectedModel.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/models", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        const updatedModel = await response.json();
        if (isEditing) {
          setModels(models.map(model => model.id === selectedModel!.id ? updatedModel : model));
        } else {
          setModels([...models, updatedModel]);
        }
        setDialogOpen(false);
        setIsEditing(false);
        setSelectedModel(null);
      } else {
        alert(`Error ${isEditing ? "updating" : "creating"} model`);
      }
    } catch {
      alert(`Error ${isEditing ? "updating" : "creating"} model`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Models</h1>
        <Button onClick={() => { setIsEditing(false); setSelectedModel(null); setDialogOpen(true); }}>Add New Model</Button>
      </div>
      <ModelModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedModel || {}}
        isEditing={isEditing}
        brands={brands}
        loading={loading}
      />
      <DataTable columns={columns} data={models} />
    </>
  );
}