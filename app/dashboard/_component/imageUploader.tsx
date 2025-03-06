import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ value = [], onChange, maxFiles = 5 }: ImageUploaderProps) {
  const { uploadImages, uploadProgress, isUploading } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    try {
      const urls = await uploadImages(e.target.files);
      onChange([...value, ...urls]);
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading || value.length >= maxFiles}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || value.length >= maxFiles}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {value.map((url, index) => (
          <div key={index} className=" bg-muted">
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{item.file.name}</span>
                <span>{Math.round(item.progress)}%</span>
              </div>
              <Progress value={item.progress} />
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}