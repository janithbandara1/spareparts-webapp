"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface HeroSlide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    description: "",
    order: 0,
  });

  // Handle file upload to Cloudinary
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch("/api/hero-slides");
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchSlides();
        setFormData({ imageUrl: "", title: "", description: "", order: 0 });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error creating slide:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const response = await fetch(`/api/hero-slides/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: formData.imageUrl,
          title: formData.title,
          description: formData.description,
          order: formData.order,
        }),
      });
      if (response.ok) {
        fetchSlides();
        setEditing(null);
        setFormData({ imageUrl: "", title: "", description: "", order: 0 });
      }
    } catch (error) {
      console.error("Error updating slide:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSlides();
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setFormData({
      imageUrl: slide.imageUrl,
      title: slide.title,
      description: slide.description,
      order: slide.order,
    });
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({ imageUrl: "", title: "", description: "", order: 0 });
    setImagePreview("");
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hero Slides</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setFormData({ imageUrl: "", title: "", description: "", order: 0 });
          }}
        >
          Add Slide
        </Button>
      </div>

      {(showForm || editing) && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit Slide" : "Create New Slide"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={editing ? handleUpdate : handleCreate}
              className="space-y-4"
            >
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
                        setFormData({ ...formData, imageUrl: cloudinaryUrl });
                        setImagePreview(URL.createObjectURL(file));
                      } catch (error) {
                        console.error("Upload error:", error);
                        e.target.value = "";
                      }
                    }
                  }}
                  className="cursor-pointer"
                  disabled={uploading}
                />
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Slide title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Slide description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading
                    ? "Uploading..."
                    : editing
                    ? "Update"
                    : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Slides</CardTitle>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <p className="text-gray-500">No slides yet. Create one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="relative w-20 h-12">
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{slide.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {slide.description}
                    </TableCell>
                    <TableCell>{slide.order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(slide)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(slide.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
