"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brand } from "../lib/generated/prisma/client";

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; brandId: number }) => void;
  initialData?: Partial<{ name: string; brandId: number }>;
  isEditing: boolean;
  brands: Brand[];
  loading: boolean;
}

export function ModelModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing,
  brands,
  loading,
}: ModelModalProps) {
  const [name, setName] = useState(initialData.name || "");
  const [brandId, setBrandId] = useState(initialData.brandId?.toString() || "");

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || "");
      setBrandId(initialData.brandId?.toString() || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId) {
      alert("Please select a brand");
      return;
    }
    onSubmit({
      name,
      brandId: parseInt(brandId),
    });
  };

  const handleClose = () => {
    onClose();
    setName("");
    setBrandId("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Model" : "Add New Model"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Model" : "Create Model")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}