'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export function HeroImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [altText, setAltText] = useState<string>('Premium Auto Parts');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { url, publicId } = await uploadResponse.json();
      setImageUrl(url);

      // Save to database
      const saveResponse = await fetch('/api/hero-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: url,
          altText,
          publicId,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save hero image');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Image Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        {preview || imageUrl ? (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={preview || imageUrl}
              alt={altText}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <p>Image preview will appear here</p>
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload New Image</label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="cursor-pointer"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreview('');
                setImageUrl('');
              }}
              disabled={!imageUrl && !preview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Alt Text</label>
          <Input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            Hero image updated successfully!
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Uploading...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
