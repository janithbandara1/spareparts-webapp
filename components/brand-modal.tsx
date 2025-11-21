"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  initialData?: Partial<{ name: string }>;
  isEditing: boolean;
  loading: boolean;
}

export function BrandModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing,
  loading,
}: BrandModalProps) {
  const [name, setName] = useState(initialData.name || "");

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  const handleClose = () => {
    onClose();
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Brand" : "Add New Brand"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Brand" : "Create Brand")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}