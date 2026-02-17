import { NextRequest, NextResponse } from "next/server";
import { uploadFileToPinata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    // Upload to Pinata
    const cid = await uploadFileToPinata(file);
    
    console.log(`File uploaded successfully: CID=${cid}`);

    return NextResponse.json({
      success: true,
      cid,
      ipfsUrl: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${cid}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error("Error in upload-file API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file to IPFS";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
