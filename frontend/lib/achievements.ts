// Admin Achievement System

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: number;
  requiredIssued: number;
  color: string;
  gradient: string;
  benefits?: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "starter",
    name: "Certificate Starter",
    description: "Issue your first certificate",
    icon: "🌱",
    tier: 1,
    requiredIssued: 1,
    color: "text-gray-300",
    gradient: "from-gray-400 to-gray-600",
    benefits: ["Access to basic certificate templates"],
  },
  {
    id: "educator",
    name: "Emerging Educator",
    description: "Issue 5 certificates",
    icon: "📚",
    tier: 2,
    requiredIssued: 5,
    color: "text-blue-300",
    gradient: "from-blue-400 to-blue-600",
    benefits: ["Unlock skill badges", "Basic analytics"],
  },
  {
    id: "instructor",
    name: "Certified Instructor",
    description: "Issue 10 certificates",
    icon: "🎓",
    tier: 3,
    requiredIssued: 10,
    color: "text-green-300",
    gradient: "from-green-400 to-green-600",
    benefits: ["Batch issuance", "Custom templates", "Advanced analytics"],
  },
  {
    id: "institution",
    name: "Trusted Institution",
    description: "Issue 25 certificates",
    icon: "🏛️",
    tier: 4,
    requiredIssued: 25,
    color: "text-purple-300",
    gradient: "from-purple-400 to-purple-600",
    benefits: ["Institution verification badge", "Priority indexing", "API access"],
  },
  {
    id: "academy",
    name: "Renowned Academy",
    description: "Issue 50 certificates",
    icon: "🏆",
    tier: 5,
    requiredIssued: 50,
    color: "text-amber-300",
    gradient: "from-amber-400 to-amber-600",
    benefits: ["Featured institution status", "Custom branding", "Dedicated support"],
  },
  {
    id: "university",
    name: "Elite University",
    description: "Issue 100 certificates",
    icon: "👑",
    tier: 6,
    requiredIssued: 100,
    color: "text-pink-300",
    gradient: "from-pink-400 to-pink-600",
    benefits: ["Governance participation", "Revenue sharing", "Partnership opportunities"],
  },
  {
    id: "legend",
    name: "Educational Legend",
    description: "Issue 250+ certificates",
    icon: "⭐",
    tier: 7,
    requiredIssued: 250,
    color: "text-yellow-300",
    gradient: "from-yellow-400 via-orange-400 to-red-500",
    benefits: ["All features unlocked", "Platform ambassador", "Lifetime benefits"],
  },
];

export function getCurrentAchievement(totalIssued: number): Achievement {
  // Find the highest achievement tier the admin has reached
  let currentAchievement = ACHIEVEMENTS[0];
  
  for (const achievement of ACHIEVEMENTS) {
    if (totalIssued >= achievement.requiredIssued) {
      currentAchievement = achievement;
    } else {
      break;
    }
  }
  
  return currentAchievement;
}

export function getNextAchievement(totalIssued: number): Achievement | null {
  for (const achievement of ACHIEVEMENTS) {
    if (totalIssued < achievement.requiredIssued) {
      return achievement;
    }
  }
  return null; // Already at max level
}

export function getProgressToNext(totalIssued: number): number {
  const next = getNextAchievement(totalIssued);
  if (!next) return 100; // Max level
  
  const current = getCurrentAchievement(totalIssued);
  const range = next.requiredIssued - current.requiredIssued;
  const progress = totalIssued - current.requiredIssued;
  
  return Math.min((progress / range) * 100, 100);
}

export function getAllUnlockedAchievements(totalIssued: number): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => totalIssued >= achievement.requiredIssued);
}
