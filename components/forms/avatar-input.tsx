import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { UseFormReturn } from "react-hook-form";

interface AvatarInputProps {
  form: UseFormReturn<any>;
  currentImageUrl?: string | null;
}

export function AvatarInput({ form, currentImageUrl }: AvatarInputProps) {
  const { previewUrl, handleImageChange, cleanup } = useAvatarUpload();
  const [imageError, setImageError] = useState(false);
  
  // Reset error state when URL changes
  useEffect(() => {
    setImageError(false);
  }, [currentImageUrl]);

  // Process the image URL to ensure it's valid
  const processImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return "";
    
    // If it's a full URL (starts with http), use it directly
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative path, ensure it starts with /
    if (!imageUrl.startsWith('/')) {
      return `/${imageUrl}`;
    }
    
    return imageUrl;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image must be less than 1MB"
        });
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        form.setError("image", {
          type: "manual",
          message: "Only JPEG, PNG, WebP and GIF formats are supported"
        });
        return;
      }
    }
    
    handleImageChange(file);
    form.setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.clearErrors("image");
    setImageError(false);
  };

  const handleRemove = () => {
    handleImageChange(null);
    form.setValue("image", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.clearErrors("image");
  };

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const displayUrl = previewUrl || (currentImageUrl && !imageError ? processImageUrl(currentImageUrl) : null);
  
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {displayUrl && (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={displayUrl}
                    alt="Avatar preview"
                    fill
                    className="object-cover rounded-full"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 128px) 100vw, 128px"
                    unoptimized={displayUrl.startsWith('blob:')} // Don't optimize blob URLs
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 