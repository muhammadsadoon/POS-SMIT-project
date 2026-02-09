"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import Image from 'next/image';

interface ImageUploadProps {
  currentImageUrl?: string;
  currentImagePublicId?: string;
  onImageUploaded: (url: string, publicId: string) => void;
  onImageDeleted: () => void;
}

export default function ImageUpload({
  currentImageUrl,
  currentImagePublicId,
  onImageUploaded,
  onImageDeleted,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notifications.show({
        title: 'Error',
        message: 'Please select an image file',
        color: 'red',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: 'Error',
        message: 'Image size must be less than 5MB',
        color: 'red',
      });
      return;
    }

    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const result = await uploadImage(file, 'products');
      onImageUploaded(result.secure_url, result.public_id);
      
      notifications.show({
        title: 'Success',
        message: 'Image uploaded successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to upload image',
        color: 'red',
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImagePublicId) {
      setPreview(null);
      onImageDeleted();
      return;
    }

    try {
      await deleteImage(currentImagePublicId);
      setPreview(null);
      onImageDeleted();
      notifications.show({
        title: 'Success',
        message: 'Image deleted successfully',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete image',
        color: 'red',
      });
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <Card className="p-4">
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={preview}
                alt="Product preview"
                fill
                className="object-cover"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleDelete}
            >
              <IconX size={16} />
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Change Image'}
          </Button>
        </Card>
      ) : (
        <Card
          className="border-2 border-dashed p-8 cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <IconPhoto size={48} className="text-gray-400" />
            <div className="text-center">
              <Button variant="outline" disabled={uploading}>
                <IconUpload size={16} className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
