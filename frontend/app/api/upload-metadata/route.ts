import { NextRequest, NextResponse } from "next/server";
import { uploadMetadataToPinata, CertificateMetadata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.issuer || !body.recipient) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const metadata: CertificateMetadata = {
      name: body.name,
      description: body.description,
      image: body.image,
      issuer: body.issuer,
      recipient: body.recipient,
      issuedDate: body.issuedDate || new Date().toISOString(),
      certificateType: body.certificateType || "Certificate",
      trustRank: body.trustRank || "Novice",
      attributes: body.attributes || [],
    };

    // Upload to Pinata
    const cid = await uploadMetadataToPinata(metadata);

    return NextResponse.json({ 
      success: true, 
      cid,
      ipfsUrl: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${cid}`
    });
  } catch (error) {
    console.error("Error in upload-metadata API:", error);
    return NextResponse.json(
      { error: "Failed to upload metadata to IPFS" },
      { status: 500 }
    );
  }
}
