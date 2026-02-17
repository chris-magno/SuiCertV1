/**
 * IPFS Service
 * Single Responsibility: Handle IPFS/Pinata operations
 * Open/Closed: Can extend with other IPFS providers without modifying existing code
 */

export interface IPFSMetadata {
  name: string;
  description: string;
  issuer: string;
  recipient: string;
  certificateType: string;
  trustRank: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface IPFSUploadResult {
  cid: string;
  url: string;
}

export class IPFSService {
  /**
   * Upload file to IPFS via Pinata API
   */
  static async uploadFile(file: File): Promise<IPFSUploadResult | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return {
        cid: data.cid,
        url: data.url,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  /**
   * Upload metadata JSON to IPFS
   */
  static async uploadMetadata(metadata: IPFSMetadata): Promise<IPFSUploadResult | null> {
    try {
      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error('Failed to upload metadata');
      }

      const data = await response.json();
      return {
        cid: data.cid,
        url: data.url,
      };
    } catch (error) {
      console.error('Error uploading metadata:', error);
      return null;
    }
  }

  /**
   * Get IPFS gateway URL from CID
   */
  static getGatewayUrl(cid: string, gateway?: string): string {
    const defaultGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    const selectedGateway = gateway || defaultGateway || 'https://gateway.pinata.cloud';
    
    return `${selectedGateway}/ipfs/${cid}`;
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File, maxSizeMB: number = 10): string[] {
    const errors: string[] = [];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type must be JPEG, PNG, GIF, WebP, or SVG');
    }

    return errors;
  }
}
