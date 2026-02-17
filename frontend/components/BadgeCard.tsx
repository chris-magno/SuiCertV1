"use client";

import { Crown, Award, Star, Shield, Sparkles, CheckCircle } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "crown" | "award" | "star" | "shield" | "sparkles";
  tier: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedDate?: number;
  requirement?: string;
}

interface BadgeCardProps {
  badge: Badge;
  index?: number;
}

const iconMap = {
  crown: Crown,
  award: Award,
  star: Star,
  shield: Shield,
  sparkles: Sparkles,
};

const tierColors = {
  common: {
    bg: "from-slate-600 to-slate-700",
    border: "border-slate-500/50",
    text: "text-slate-300",
    glow: "shadow-slate-500/20",
    iconBg: "bg-slate-500/30",
  },
  rare: {
    bg: "from-blue-600 to-indigo-700",
    border: "border-blue-500/50",
    text: "text-blue-300",
    glow: "shadow-blue-500/30",
    iconBg: "bg-blue-500/30",
  },
  epic: {
    bg: "from-purple-600 to-violet-700",
    border: "border-purple-500/50",
    text: "text-purple-300",
    glow: "shadow-purple-500/30",
    iconBg: "bg-purple-500/30",
  },
  legendary: {
    bg: "from-amber-500 to-orange-600",
    border: "border-amber-500/50",
    text: "text-amber-300",
    glow: "shadow-amber-500/40",
    iconBg: "bg-amber-500/30",
  },
};

export function BadgeCard({ badge, index = 0 }: BadgeCardProps) {
  const Icon = iconMap[badge.icon];
  const colors = tierColors[badge.tier];
  
  return (
    <div
      className={`relative animate-fade-in ${!badge.earned ? 'opacity-60 grayscale' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Badge Card */}
      <div className={`group relative bg-gradient-to-br ${colors.bg} p-[2px] rounded-2xl ${colors.glow} hover:shadow-xl transition-all duration-300 ${badge.earned ? 'hover:scale-105' : ''}`}>
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl p-6 h-full">
          {/* Earned Indicator */}
          {badge.earned && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-green-500 rounded-full p-1 border-2 border-slate-900">
                <CheckCircle className="w-5 h-5 text-white fill-green-500" />
              </div>
            </div>
          )}

          {/* Tier Badge */}
          <div className={`inline-block px-3 py-1 ${colors.border} border rounded-full mb-4`}>
            <span className={`text-xs font-bold uppercase ${colors.text}`}>
              {badge.tier}
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`relative p-6 ${colors.iconBg} rounded-2xl ${badge.earned ? 'animate-pulse' : ''}`}>
              <Icon className={`w-12 h-12 ${colors.text}`} strokeWidth={2} />
              {!badge.earned && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
              )}
            </div>
          </div>

          {/* Badge Info */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
            <p className="text-sm text-slate-300 mb-3">{badge.description}</p>
            
            {badge.earned && badge.earnedDate ? (
              <p className="text-xs text-green-400 font-semibold">
                Earned {new Date(badge.earnedDate).toLocaleDateString()}
              </p>
            ) : badge.requirement ? (
              <p className="text-xs text-slate-400 italic">
                {badge.requirement}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Glow Effect for Earned Badges */}
      {badge.earned && (
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-2xl blur-xl -z-10 opacity-50`}></div>
      )}
    </div>
  );
}
