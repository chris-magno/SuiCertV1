"use client";

import { useState } from "react";
import { toast } from "sonner";

interface UploadMetadataParams {
  name: string;
  description: string;
  issuer: string;
  recipient: string;
  certificateType: string;
  trustRank: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface UploadResult {
  success: boolean;
  cid: string;
  ipfsUrl: string;
}

export function usePinata() {
  const [uploading, setUploading] = useState(false);

  const uploadMetadata = async (params: UploadMetadataParams): Promise<UploadResult | null> => {
    setUploading(true);
    try {
      const response = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload metadata");
      }

      const result = await response.json();
      toast.success("Metadata uploaded to IPFS successfully!");
      return result;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      toast.error("Failed to upload metadata to IPFS");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
      }

      const result = await response.json();
      toast.success(`File uploaded to IPFS successfully!`);
      return result;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file to IPFS");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadMetadata,
    uploadFile,
    uploading,
  };
}
