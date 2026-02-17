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

    console.log("Uploading metadata:", JSON.stringify(metadata, null, 2));

    // Upload to Pinata
    const cid = await uploadMetadataToPinata(metadata);

    console.log(`Metadata uploaded successfully: CID=${cid}`);

    return NextResponse.json({ 
      success: true, 
      cid,
      ipfsUrl: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${cid}`
    });
  } catch (error) {
    console.error("Error in upload-metadata API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload metadata to IPFS";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
