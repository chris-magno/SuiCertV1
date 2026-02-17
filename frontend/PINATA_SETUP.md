# Pinata IPFS Setup Guide

This guide will help you set up Pinata for IPFS storage in your SuiCert application.

## Prerequisites

- A Pinata account (sign up at [https://pinata.cloud](https://pinata.cloud))
- Pinata API credentials

## Steps to Setup Pinata

### 1. Create a Pinata Account

1. Go to [https://app.pinata.cloud/register](https://app.pinata.cloud/register)
2. Sign up for a free account
3. Verify your email address

### 2. Generate API Keys

1. Log in to your Pinata dashboard
2. Navigate to **API Keys** in the left sidebar
3. Click **New Key** button
4. Configure your key:
   - **Key Name**: `SuiCert Development` (or any name you prefer)
   - **Permissions**: Enable `pinFileToIPFS` and `pinJSONToIPFS`
5. Click **Generate Key**
6. **IMPORTANT**: Copy your JWT token immediately (you won't be able to see it again)

### 3. Configure Environment Variables

1. Open your `.env.local` file in the frontend directory
2. Replace the placeholder with your actual Pinata JWT:

```env
PINATA_JWT=your_actual_pinata_jwt_token_here
```

3. Save the file

### 4. Optional: Set Up a Dedicated Gateway

For better performance and branding:

1. In Pinata dashboard, go to **Gateways**
2. Create a dedicated gateway (available on paid plans)
3. Update your `.env.local`:

```env
NEXT_PUBLIC_PINATA_GATEWAY_URL=https://your-gateway.mypinata.cloud/ipfs
```

## Features Implemented

### 📤 Upload Metadata to IPFS
- Automatically uploads certificate metadata as JSON
- Returns IPFS CID for blockchain storage
- Includes certificate details, issuer, recipient info

### 🖼️ Upload Images/Files
- Support for certificate images
- Support for 3D models and other assets
- File size limit: 100MB per file

### 🔗 API Routes
- `POST /api/upload-metadata` - Upload JSON metadata
- `POST /api/upload-file` - Upload files (images, 3D models)

### 🎯 Integration with Smart Contract
- Stores IPFS CID in certificate NFT
- Links to full metadata on IPFS
- Permanent, decentralized storage

## Testing Pinata Integration

### Test Metadata Upload

```bash
curl -X POST http://localhost:3000/api/upload-metadata \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Certificate",
    "description": "Testing IPFS upload",
    "issuer": "Test University",
    "recipient": "0x123...",
    "certificateType": "Course",
    "trustRank": "Novice"
  }'
```

### Test File Upload

```bash
curl -X POST http://localhost:3000/api/upload-file \
  -F "file=@/path/to/image.png"
```

## Usage in Application

### Using the Hook

```typescript
import { usePinata } from "@/hooks/usePinata";

function MyComponent() {
  const { uploadMetadata, uploadFile, uploading } = usePinata();

  const handleUpload = async () => {
    // Upload metadata
    const result = await uploadMetadata({
      name: "Certificate Name",
      description: "Description",
      issuer: "Issuer Name",
      recipient: "0x...",
      certificateType: "Course",
      trustRank: "Novice",
    });

    if (result) {
      console.log("IPFS CID:", result.cid);
      console.log("IPFS URL:", result.ipfsUrl);
    }
  };
}
```

### Using the Issue Certificate Form

The `IssueCertificateForm` component handles the entire flow:
1. Upload image to IPFS (optional)
2. Create and upload metadata JSON to IPFS
3. Mint certificate on Sui blockchain with IPFS CID

```typescript
<IssueCertificateForm
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  adminCapId="0x..." // Your AdminCap object ID
/>
```

## Pinata Plans

### Free Plan
- ✅ 1 GB storage
- ✅ 100 GB bandwidth/month
- ✅ Perfect for testing and small projects

### Paid Plans
- 🚀 More storage and bandwidth
- 🚀 Dedicated gateways
- 🚀 Advanced analytics
- 🚀 Priority support

## Troubleshooting

### "Pinata client not initialized"
- Check that `PINATA_JWT` is set in `.env.local`
- Restart your development server after adding environment variables

### "Failed to upload to IPFS"
- Verify your Pinata JWT is valid
- Check your API key permissions
- Ensure you haven't exceeded your plan limits

### Files not accessible
- Check that your IPFS gateway URL is correct
- Try accessing via public gateway: `https://gateway.pinata.cloud/ipfs/{CID}`
- Files may take a few seconds to propagate

## Security Best Practices

1. ✅ **Never commit** your `PINATA_JWT` to version control
2. ✅ Keep `.env.local` in your `.gitignore`
3. ✅ Use different API keys for development and production
4. ✅ Regularly rotate your API keys
5. ✅ Set appropriate permissions for API keys

## Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata SDK](https://github.com/PinataCloud/pinata-web3)

## Support

For issues with Pinata integration:
- Check the [Pinata Discord](https://discord.gg/pinata)
- Review [Pinata Documentation](https://docs.pinata.cloud/)
- Contact Pinata support

---

**Ready to go!** 🎉 Your SuiCert application now has IPFS storage via Pinata.
