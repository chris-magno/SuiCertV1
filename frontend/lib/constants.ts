// Contract Configuration
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "";
export const PLATFORM_REGISTRY_ID = process.env.NEXT_PUBLIC_PLATFORM_REGISTRY_ID || "";

// Certificate Types
export const CERT_TYPES = {
  COURSE: 1,
  DEGREE: 2,
  SKILL: 3,
  ACHIEVEMENT: 4,
  BOOTCAMP: 5,
} as const;

export const CERT_TYPE_NAMES: Record<number, string> = {
  1: "Course",
  2: "Degree",
  3: "Skill",
  4: "Achievement",
  5: "Bootcamp",
};

// Trust Rank Levels
export const TRUST_RANKS = {
  NOVICE: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
  EXPERT: 3,
  MASTER: 4,
} as const;

export const RANK_NAMES: Record<number, string> = {
  0: "Novice",
  1: "Intermediate",
  2: "Advanced", 
  3: "Expert",
  4: "Master",
};

export const RANK_ICONS: Record<number, string> = {
  0: "🌱",
  1: "⭐",
  2: "💎",
  3: "👑",
  4: "🏆",
};

export const RANK_COLORS: Record<number, string> = {
  0: "from-gray-400 to-gray-600",
  1: "from-blue-400 to-blue-600",
  2: "from-purple-400 to-purple-600",
  3: "from-amber-400 to-amber-600",
  4: "from-indigo-400 to-indigo-700",
};

// Constants
export const MIN_BOUNTY_AMOUNT = 1_000_000; // 0.001 SUI
export const MASTER_RANK_THRESHOLD = 10;

// IPFS Configuration
export const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";
