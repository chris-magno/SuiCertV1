import { PinataSDK } from "pinata";

// Initialize Pinata client (server-side only)
let pinataClient: PinataSDK | null = null;

if (typeof window === "undefined" && process.env.PINATA_JWT) {
  pinataClient = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
  });
}

export interface CertificateMetadata {
  name: string;
  description: string;
  image?: string;
  issuer: string;
  recipient: string;
  issuedDate: string;
  certificateType: string;
  trustRank: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Upload certificate metadata to IPFS via Pinata
 * This should be called from an API route, not client-side
 */
export async function uploadMetadataToPinata(
  metadata: CertificateMetadata
): Promise<string> {
  if (!pinataClient) {
    throw new Error("Pinata client not initialized. Check PINATA_JWT environment variable.");
  }

  try {
    const result = await (pinataClient as any).upload.json(metadata);
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}

/**
 * Upload a file to IPFS via Pinata
 * This should be called from an API route, not client-side
 */
export async function uploadFileToPinata(
  file: File
): Promise<string> {
  if (!pinataClient) {
    throw new Error("Pinata client not initialized. Check PINATA_JWT environment variable.");
  }

  try {
    const result = await (pinataClient as any).upload.file(file);
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
}

/**
 * Get the full IPFS URL for a CID
 */
export function getIpfsUrl(cid: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || "https://beige-hilarious-cobra-60.mypinata.cloud/ipfs";
  return `${gateway}/${cid}`;
}
