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
 * Upload certificate metadata to IPFS via Pinata using REST API
 * This should be called from an API route, not client-side
 */
export async function uploadMetadataToPinata(
  metadata: CertificateMetadata
): Promise<string> {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT not configured");
  }

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `certificate-${metadata.name.replace(/\s+/g, '-').toLowerCase()}`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata API error:", errorText);
      throw new Error(`Pinata metadata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw error;
  }
}

/**
 * Upload a file to IPFS via Pinata using REST API
 * This should be called from an API route, not client-side
 */
export async function uploadFileToPinata(
  file: File
): Promise<string> {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT not configured");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata API error:", errorText);
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
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
