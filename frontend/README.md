# SuiCert Frontend

A beautiful, functional frontend for the SuiCert soulbound credential system on Sui blockchain.

## Features

- ✨ Beautiful gradient UI with animations
- 🔗 Sui Wallet integration with @mysten/dapp-kit
- 📜 View and manage your certificates
- 🏆 Trust rank and reputation system
- 📊 User stats and profile tracking
- 🌐 IPFS integration for certificate metadata
- 📱 Responsive design

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@mysten/dapp-kit** - Sui wallet integration
- **@tanstack/react-query** - Data fetching
- **Framer Motion** - Animations
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sui Wallet browser extension

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your contract addresses after deployment:
```env
NEXT_PUBLIC_PACKAGE_ID=your_package_id_here
NEXT_PUBLIC_PLATFORM_REGISTRY_ID=your_registry_id_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main dashboard page
│   ├── providers.tsx       # Sui and React Query providers
│   └── globals.css         # Global styles
├── components/
│   ├── BackgroundEffects.tsx
│   ├── CertificateCard.tsx
│   ├── CertificateModal.tsx
│   ├── Header.tsx
│   ├── StatsSidebar.tsx
│   └── WalletConnect.tsx
├── hooks/
│   └── useSuiData.ts      # Custom hooks for blockchain data
├── lib/
│   ├── constants.ts       # Contract constants
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Key Components

### WalletConnect
Sui wallet connection button using @mysten/dapp-kit

### CertificateCard
Displays individual certificates with trust rank badges and animations

### CertificateModal
Detailed view of certificates with IPFS links and sharing

### StatsSidebar
Shows user statistics, reputation, and trust rank

### BackgroundEffects
Animated gradient orbs and floating particles

## Custom Hooks

### useCertificates()
Fetches all certificates owned by the connected wallet

### useUserProfile()
Fetches user profile data from the blockchain

## Styling

The app uses a custom design system with:
- Sui-themed indigo color palette
- Space Grotesk font
- Custom animations (float, glow, slide-in)
- Certificate card hover effects with 3D transforms
- Glassmorphism effects

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms

Build the production app:
```bash
npm run build
npm start
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Sui wallet
2. **View Certificates**: See all your soulbound certificates in grid or list view
3. **Certificate Details**: Click any certificate to view full details
4. **View on IPFS**: Access the 3D metadata and assets via IPFS
5. **Share**: Share your achievements with others

## Contract Integration

The frontend connects to the SuiCert Move contract to:
- Fetch user certificates
- Display certificate metadata
- Show trust ranks and reputation
- Access IPFS data via Pinata CIDs

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PACKAGE_ID` | SuiCert package ID | Yes |
| `NEXT_PUBLIC_PLATFORM_REGISTRY_ID` | Platform registry object ID | Yes |
| `NEXT_PUBLIC_PINATA_GATEWAY` | IPFS gateway URL | No (default provided) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
