import { useState } from "react";

export const useAvatarUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = (file: File | null) => {
    // Cleanup previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFile(file);
    } else {
      setPreviewUrl(null);
      setFile(null);
    }
  };

  // Cleanup on unmount
  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return {
    previewUrl,
    file,
    handleImageChange,
    cleanup
  };
}; 