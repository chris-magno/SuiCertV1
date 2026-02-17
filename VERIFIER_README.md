# Certificate Verifier Feature

## Overview
The Certificate Verifier allows anyone to verify the authenticity of SuiCert certificates by checking them against the Sui blockchain. This feature helps prevent certificate fraud by providing a public verification mechanism.

## How It Works

### For Certificate Holders
1. Open your certificate details (click on any certificate card)
2. Click the "Verify Link" button in the modal
3. Share the copied verification link with anyone who needs to verify your certificate

### For Verifiers
1. Navigate to the "Verify" page using the navigation link in the header
2. Enter or paste the certificate ID (Object ID from Sui blockchain)
3. Click "Verify" to check the certificate

## Features

### 🔍 Blockchain Verification
- Verifies certificate existence on the Sui blockchain
- Validates certificate type (ensures it's a genuine SuiCert certificate)
- Checks certificate expiration status

### 💚 Clear Status Indicators
- **Green Badge**: Valid and authentic certificate
- **Yellow Badge**: Valid but expired certificate
- **Red Badge**: Invalid or non-existent certificate

### 📋 Detailed Certificate Information
When a certificate is verified, the following information is displayed:
- Certificate title and description
- Issuing institution name and address
- Recipient address
- Issue date and expiration date (if applicable)
- Certificate type (Course, Degree, Skill, Achievement, Bootcamp)
- Trust rank level
- Certificate ID for reference
- IPFS link to certificate metadata

### 🔗 Shareable Verification Links
- URL parameter support (e.g., `/verify?id=0x123abc...`)
- Share verification links via the "Share Verification Link" button
- Copy certificate ID for manual verification

### 📱 User-Friendly Interface
- Clean, modern UI with glassmorphic design
- Responsive layout for mobile and desktop
- Loading states during verification
- Toast notifications for user feedback
- Easy navigation between pages

## Technical Implementation

### New Files Created
1. **`hooks/useSuiData.ts`** - Updated with `useVerifyCertificate` hook
2. **`components/VerifyCertificate.tsx`** - Main verification component
3. **`app/verify/page.tsx`** - Verification page route

### Modified Files
1. **`components/Header.tsx`** - Added navigation links and verify button
2. **`components/CertificateModal.tsx`** - Added "Share Verification Link" button
3. **`components/index.ts`** - Exported new VerifyCertificate component

### Key Functions

#### `useVerifyCertificate(certificateId)`
React hook that fetches and verifies a certificate from the blockchain.

**Returns:**
```typescript
{
  isValid: boolean;
  certificate?: Certificate;
  isExpired?: boolean;
  error?: string;
}
```

**Validation Steps:**
1. Checks if object exists on blockchain
2. Validates object type is a SuiCert certificate
3. Parses certificate data
4. Checks expiration status
5. Returns verification result with detailed information

## Usage Examples

### Direct Verification
```
https://yourdomain.com/verify?id=0xABCDEF123456...
```

### Manual Entry
1. Get certificate ID from owner
2. Go to /verify page
3. Paste ID in input field
4. Click "Verify"

## Security Considerations

- ✅ All verification happens on-chain (no centralized database)
- ✅ Immutable blockchain records prevent tampering
- ✅ Public verification allows anyone to check authenticity
- ✅ No authentication required for verification
- ✅ Soulbound certificates prevent transfers (ownership stays with original recipient)

## Future Enhancements

Potential improvements for the verifier:
- [ ] QR code scanning support
- [ ] Batch verification for multiple certificates
- [ ] Verification history
- [ ] PDF/Print verification report
- [ ] Email verification results
- [ ] API endpoint for programmatic verification
- [ ] Embed verification widget for institutions

