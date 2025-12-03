"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brand, Model } from "../lib/generated/prisma/client";

const ITEM_CONDITIONS = [
  { value: 'BRAND_NEW', label: 'Brand New' },
  { value: 'RECONDITIONED', label: 'Reconditioned' },
  { value: 'USED', label: 'Used' },
] as const;

type ItemWithRelations = {
  id: number;
  productNumber: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  condition: 'BRAND_NEW' | 'RECONDITIONED' | 'USED' | null;
  brandId: number | null;
  modelId: number | null;
  brand: Brand | null;
  model: Model | null;
  createdAt: Date;
  updatedAt: Date;
};

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    productNumber: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    condition: 'BRAND_NEW' | 'RECONDITIONED' | 'USED';
    brandId: number | null;
    modelId: number | null;
  }) => void;
  initialData?: Partial<ItemWithRelations>;
  isEditing: boolean;
  brands: Brand[];
  models: Model[];
  loading: boolean;
}

export function ItemModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing,
  brands,
  models,
  loading,
}: ItemModalProps) {
  const [productNumber, setProductNumber] = useState(initialData.productNumber || "");
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price?.toString() || "");
  const [quantity, setQuantity] = useState(initialData.quantity?.toString() || "0");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle file upload to Cloudinary
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      throw error;
    } finally {
      setUploading(false);
    }
  };
  const [condition, setCondition] = useState<'BRAND_NEW' | 'RECONDITIONED' | 'USED'>('BRAND_NEW');
  const [brandId, setBrandId] = useState(initialData.brandId?.toString() || "none");
  const [modelId, setModelId] = useState(initialData.modelId?.toString() || "none");

  // Filter models based on selected brand
  const filteredModels = brandId === "none" 
    ? models 
    : models.filter(model => model.brandId === parseInt(brandId));

  useEffect(() => {
    if (isOpen) {
      setProductNumber(initialData.productNumber || "");
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price?.toString() || "");
      setQuantity(initialData.quantity?.toString() || "0");
      setImageUrl(initialData.imageUrl || "");
      setCondition((initialData.condition as 'BRAND_NEW' | 'RECONDITIONED' | 'USED') || 'BRAND_NEW');
      setBrandId(initialData.brandId?.toString() || "none");
      setModelId(initialData.modelId?.toString() || "none");
    }
  }, [isOpen, initialData]);

  // Reset model selection when brand changes
  useEffect(() => {
    if (modelId !== "none" && !filteredModels.find(model => model.id.toString() === modelId)) {
      setModelId("none");
    }
  }, [brandId, filteredModels, modelId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      productNumber,
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl, // Now contains the Cloudinary URL
      condition,
      brandId: brandId === "none" ? null : parseInt(brandId),
      modelId: modelId === "none" ? null : parseInt(modelId),
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setProductNumber("");
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("0");
    setImageUrl("");
    setImageFile(null);
    setCondition('BRAND_NEW');
    setBrandId("none");
    setModelId("none");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="productNumber">Product Number</Label>
            <Input
              id="productNumber"
              value={productNumber}
              onChange={(e) => setProductNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                step="0.01"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image</Label>
            <Input
              id="imageUrl"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const cloudinaryUrl = await uploadImage(file);
                    setImageFile(file);
                    setImageUrl(cloudinaryUrl);
                  } catch (error) {
                    console.error('Upload error:', error);
                    // Error is already handled in uploadImage
                    e.target.value = ''; // Reset file input
                  }
                }
              }}
              className="cursor-pointer"
              disabled={uploading}
            />
            {(imageFile || imageUrl) && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageFile ? URL.createObjectURL(imageFile) : imageUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(value) => setCondition(value as 'BRAND_NEW' | 'RECONDITIONED' | 'USED')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CONDITIONS.map((conditionOption) => (
                  <SelectItem key={conditionOption.value} value={conditionOption.value}>
                    {conditionOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="brand">Brand</Label>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Brand</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="model">Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Model</SelectItem>
                  {filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {uploading 
                ? "Uploading..." 
                : loading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Item" : "Create Item")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}