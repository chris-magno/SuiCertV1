export interface Certificate {
  id: string;
  owner: string;
  issuer: string;
  issuerName: string;
  certType: number;
  title: string;
  description: string;
  pinataCid: string;
  ipfsUrl: string;
  issuedAt: number;
  expiresAt: number;
  trustRank: number;
  bountyAmount?: number;
}

export interface UserProfile {
  id: string;
  owner: string;
  displayName: string;
  totalCerts: number;
  trustRank: number;
  reputation: number;
  joinedAt: number;
}

export interface AdminCap {
  id: string;
  institutionName: string;
  institutionAddress: string;
  totalIssued: number;
  authorizedTypes: number[];
}

export interface PlatformRegistry {
  id: string;
  adminCapsIssued: number;
  totalCertificates: number;
}

export type ViewMode = "grid" | "list";
