# SuiCert - Quick Start Guide

## 🚀 Getting Started with Refactored Architecture

### Prerequisites
- Sui CLI installed
- Node.js 18+ installed
- Pinata account (for IPFS)

---

## 📦 Move Contract Setup

### 1. Build the Contracts

```bash
cd contract
sui move build
```

### 2. Run Tests

```bash
sui move test
```

### 3. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

**Save the following from the output:**
- Package ID
- PlatformRegistry ID

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env.local`:

```env
# Sui Network
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=<your_package_id>
NEXT_PUBLIC_PLATFORM_REGISTRY_ID=<your_registry_id>

# Pinata IPFS
NEXT_PUBLIC_PINATA_JWT=<your_pinata_jwt>
NEXT_PUBLIC_PINATA_GATEWAY=<your_pinata_gateway>
```

### 3. Update Constants

Edit `frontend/lib/constants.ts`:

```typescript
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '';
export const PLATFORM_REGISTRY_ID = process.env.NEXT_PUBLIC_PLATFORM_REGISTRY_ID || '';
```

### 4. Apply Refactored CSS

Rename or replace CSS file:

```bash
mv app/globals.css app/globals.old.css
mv app/globals.refactored.css app/globals.css
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🏗️ Using the Modular Architecture

### Move Contract Modules

#### Import in Your Code

```move
use suicert::types::{Certificate, AdminCap};
use suicert::constants;
use suicert::validator;
use suicert::events;
```

#### Example: Custom Certificate Type

1. **Add constant** in `constants.move`:
```move
public fun cert_type_workshop(): u8 { 6 }
```

2. **Initialize in registry** in `certificate_refactored.move`:
```move
vec_map::insert(&mut certificate_types, 
    constants::cert_type_workshop(), 
    string::utf8(b"Workshop")
);
```

3. **Use validation**:
```move
validator::validate_certificate_type(cert_type, types::registry_certificate_types(registry));
```

### Frontend Services

#### Using Certificate Service

```typescript
import { CertificateService } from '@/services';

// Validate data
const errors = CertificateService.validateCertificateData({
  recipient: '0x123...',
  title: 'My Certificate',
  description: 'Description',
  pinataCid: 'QmXxx...',
  certType: 1,
});

if (errors.length > 0) {
  console.error('Validation errors:', errors);
  return;
}

// Create transaction
const tx = CertificateService.createIssueCertificateTx({
  adminCapId: 'xxx',
  recipient: '0x123...',
  certType: 1,
  title: 'My Certificate',
  description: 'Description',
  pinataCid: 'QmXxx...',
  ipfsUrl: 'https://gateway/ipfs/QmXxx',
});

// Sign and execute
signAndExecute({ transaction: tx });
```

#### Using IPFS Service

```typescript
import { IPFSService } from '@/services';

// Validate file
const errors = IPFSService.validateFile(file, 10); // 10MB max
if (errors.length > 0) {
  toast.error(errors[0]);
  return;
}

// Upload file
const result = await IPFSService.uploadFile(file);
if (result) {
  console.log('CID:', result.cid);
  console.log('URL:', result.url);
}

// Upload metadata
const metadataResult = await IPFSService.uploadMetadata({
  name: 'Certificate Name',
  description: 'Description',
  issuer: 'Institution',
  recipient: '0x123...',
  certificateType: 'Course',
  trustRank: 'Novice',
});
```

### UI Components

#### Button Component

```typescript
import { Button } from '@/components/ui';

<Button 
  variant="primary"    // primary | secondary | outline | ghost | danger
  size="base"         // sm | base | lg
  loading={isLoading}
  icon={<CheckIcon />}
  iconPosition="left" // left | right
  fullWidth
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Card Component

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="elevated" padding="lg" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
</Card>
```

#### Modal Component

```typescript
import { Modal, ModalFooter, Button } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  description="Modal description"
  size="md"           // sm | md | lg | xl | full
  closeOnBackdrop={true}
>
  <div>Modal content</div>
  
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

#### Input Component

```typescript
import { Input, Textarea } from '@/components/ui';

<Input
  label="Email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  helperText="We'll never share your email"
  icon={<MailIcon />}
  iconPosition="left"
/>

<Textarea
  label="Description"
  placeholder="Enter description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
/>
```

---

## 🎨 Design System Usage

### Using Design Tokens

```typescript
import { colors, spacing, typography, shadows } from '@/lib/design-tokens';

// In your components
<div style={{
  color: colors.primary[500],
  padding: spacing[4],
  fontSize: typography.fontSize.lg,
  boxShadow: shadows.lg,
}}>
  Content
</div>
```

### Using Theme

```typescript
import { theme } from '@/lib/theme';

// Use semantic color names
<div style={{
  backgroundColor: theme.colors.background.primary,
  color: theme.colors.text.primary,
  borderColor: theme.colors.border.brand,
}}>
  Content
</div>
```

### Tailwind with Design System

The refactored CSS includes utilities:

```tsx
<div className="glass">Glass morphism effect</div>
<div className="gradient-text">Gradient text</div>
<div className="animate-slide-in">Sliding animation</div>
<div className="grid-background">Grid pattern background</div>
```

---

## 📊 Component Migration Examples

### Before (Old Component)

```typescript
// Old way
<div className="bg-slate-900/95 backdrop-blur-custom border border-indigo-500/30 rounded-3xl p-8">
  <h3 className="text-3xl font-black text-white mb-2">
    Title
  </h3>
  <button className="...long className string...">
    Click Me
  </button>
</div>
```

### After (Refactored)

```typescript
// New way - cleaner, more maintainable
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="primary">Click Me</Button>
  </CardContent>
</Card>
```

---

## 🔧 Common Tasks

### Task 1: Add a New Certificate Type

1. **Move Contract**:
   ```move
   // In constants.move
   public fun cert_type_internship(): u8 { 7 }
   ```

2. **Initialize in Registry**:
   ```move
   // In certificate_refactored.move init()
   vec_map::insert(&mut certificate_types, 
       constants::cert_type_internship(), 
       string::utf8(b"Internship")
   );
   ```

3. **Frontend Constants**:
   ```typescript
   // In lib/constants.ts
   export const CERT_TYPES = {
     // ... existing
     INTERNSHIP: 7,
   };
   
   export const CERT_TYPE_NAMES = {
     // ... existing
     7: "Internship",
   };
   ```

### Task 2: Create a Custom Service

```typescript
// services/myCustomService.ts
export class MyCustomService {
  static async myMethod(param: string): Promise<Result> {
    // Your logic here
  }
  
  static validateData(data: Data): string[] {
    const errors: string[] = [];
    // Validation logic
    return errors;
  }
}

// Export from services/index.ts
export { MyCustomService } from './myCustomService';
```

### Task 3: Create a Custom UI Component

```typescript
// components/ui/MyComponent.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface MyComponentProps {
  variant?: 'default' | 'custom';
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'default',
  children,
}) => {
  return (
    <div className={cn(
      'base-styles',
      variant === 'custom' && 'custom-styles'
    )}>
      {children}
    </div>
  );
};

// Export from components/ui/index.ts
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

---

## 🐛 Debugging Tips

### Move Contract Debugging

```bash
# Verbose build output
sui move build --verbose

# Run specific test
sui move test test_issue_certificate

# Check gas estimation
sui client dry-run --tx-bytes <bytes>
```

### Frontend Debugging

```typescript
// Enable React Query dev tools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

---

## 📚 Additional Resources

- [Sui Move Documentation](https://docs.sui.io/build/move)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Design System Best Practices](https://www.designsystems.com/)

---

## 🤝 Contributing

When contributing to the refactored codebase:

1. Follow SOLID principles
2. Use TypeScript strictly
3. Add proper types and interfaces
4. Write unit tests
5. Use the design system
6. Document your code

---

## 📝 License

MIT License - See LICENSE file for details
