import { useState } from 'react';

interface UploadProgress {
  file: File;
  progress: number;
}

interface UseImageUploadReturn {
  uploadProgress: UploadProgress[];
  uploadImages: (files: FileList) => Promise<string[]>;
  isUploading: boolean;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (files: FileList): Promise<string[]> => {
    setIsUploading(true);
    setError(null);
    
    // Initialize progress for each file
    setUploadProgress(
      Array.from(files).map(file => ({ file, progress: 0 }))
    );

    try {
      const uploadPromises = Array.from(files).map((file, index) => {
        return new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('file', file);

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(prev => 
                prev.map((item, i) => 
                  i === index ? { ...item, progress } : item
                )
              );
            }
          });

          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.response);
              resolve(response.url);
            } else {
              reject(new Error('Upload failed'));
            }
          };

          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.open('POST', '/api/upload');
          xhr.send(formData);
        });
      });

      const urls = await Promise.all(uploadPromises);
      setIsUploading(false);
      return urls;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      return [];
    }
  };

  return { uploadProgress, uploadImages, isUploading, error };
};