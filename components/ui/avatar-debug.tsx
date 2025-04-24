"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import { Button } from "./button";

export function AvatarDebug() {
  const { refreshUserData, ...user } = useUser();
  const [imageError, setImageError] = useState(false);
  
  // Process the image URL to ensure it's valid
  const processImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return "";
    
    if (imageUrl.startsWith('http')) return imageUrl;
    if (!imageUrl.startsWith('/')) return `/${imageUrl}`;
    return imageUrl;
  };

  const imageUrl = processImageUrl(user?.image);
  
  // For testing, try different combinations
  const testUrls = [
    imageUrl,
    user?.image || "",
    `/avatars/${user?.image?.split('/').pop() || ""}`,
    `${window.location.origin}${imageUrl}`
  ];
  
  return (
    <div className="p-6 bg-card rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Avatar Image Debug</h2>
      <div className="grid grid-cols-2 gap-4">
        {testUrls.map((url, i) => (
          <div key={i} className="border rounded p-4 space-y-2">
            <p className="text-sm font-mono break-all">{url || "(empty)"}</p>
            {url && (
              <div className="relative w-16 h-16 mx-auto">
                <Image
                  src={url}
                  alt={`Test ${i+1}`}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                  onError={() => console.log(`Image error on URL: ${url}`)}
                  unoptimized
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Button 
        onClick={() => {
          refreshUserData();
          setImageError(false);
        }}
      >
        Refresh User Data
      </Button>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
} 