"use client";

import { UserProfile } from "@/lib/types";
import { RANK_NAMES } from "@/lib/constants";
import { Shield, Award, TrendingUp, Star, Crown, FileCheck, Users, Target, Medal } from "lucide-react";

interface StatsSidebarProps {
  profile: UserProfile | null;
  totalCerts: number;
  isAdmin?: boolean;
  totalIssued?: number;
  institutionName?: string;
  badgesEarned?: number;
  totalBadges?: number;
}

export function StatsSidebar({ 
  profile, 
  totalCerts, 
  isAdmin = false,
  totalIssued = 0,
  institutionName = "",
  badgesEarned = 0,
  totalBadges = 0
}: StatsSidebarProps) {
  const trustRank = profile?.trustRank ?? 0;
  const reputation = profile?.reputation ?? 0;

  if (isAdmin) {
    // Admin Stats View
    return (
      <aside className="w-80 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="bg-slate-900/95 backdrop-blur-custom border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 p-6 sticky top-28">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/20">
            <div className="p-2 bg-amber-600/20 rounded-xl">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-white text-2xl font-black">Admin Stats</h3>
          </div>

          <div className="space-y-6">
            {/* Institution Info */}
            <div className="bg-amber-950/40 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 text-sm font-semibold">Institution</span>
              </div>
              <p className="text-white font-bold text-lg truncate" title={institutionName}>
                {institutionName || "N/A"}
              </p>
            </div>

            {/* Total Certificates Issued */}
            <div className="bg-orange-950/40 border border-orange-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-300 text-sm font-semibold">Issued</span>
                </div>
                <span className="text-3xl font-black text-white">{totalIssued}</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/50"
                  style={{ width: `${Math.min((totalIssued / 50) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-400/70 mt-2">
                {totalIssued < 50 ? `${50 - totalIssued} more to 50 milestone` : "Milestone achieved! 🎉"}
              </p>
            </div>

            {/* Impact Score */}
            <div className="bg-amber-950/40 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 text-sm font-semibold">Impact Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {totalIssued * 10}
                </span>
                <span className="text-sm text-amber-400/70">points</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/50"
                    style={{ width: `${Math.min((totalIssued / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-300 text-sm font-semibold">Badges Earned</span>
                </div>
                <span className="text-2xl font-black text-white">{badgesEarned}/{totalBadges}</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/50"
                  style={{ width: `${totalBadges > 0 ? (badgesEarned / totalBadges) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-indigo-400/70 mt-2">
                {badgesEarned < totalBadges ? `${totalBadges - badgesEarned} more to collect all` : "All badges collected! 🎉"}
              </p>
            </div>
          </div>

          {/* Footer Tip */}
          <div className="mt-6 pt-4 border-t border-amber-500/20">
            <p className="text-xs text-amber-400/60 text-center">
              Issue more certificates to increase impact
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Regular User Stats View
  return (
    <aside className="w-80 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="bg-slate-900/95 backdrop-blur-custom border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/10 p-6 sticky top-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-500/20">
          <div className="p-2 bg-indigo-600/20 rounded-xl">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-white text-2xl font-black">Your Stats</h3>
        </div>

        <div className="space-y-6">
          {/* Total Certificates */}
          <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span className="text-indigo-300 text-sm font-semibold">Certificates</span>
              </div>
              <span className="text-3xl font-black text-white">{totalCerts}</span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/50"
                style={{ width: `${Math.min((totalCerts / 10) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-indigo-400/70 mt-2">
              {totalCerts < 10 ? `${10 - totalCerts} more to next milestone` : "Milestone achieved! 🎉"}
            </p>
          </div>

          {/* Trust Rank */}
          <div className="bg-amber-950/40 border border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-amber-300 text-sm font-semibold">Trust Rank</span>
              </div>
              <span className="text-xl font-black text-amber-400">{RANK_NAMES[trustRank]}</span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/50"
                style={{ width: `${((trustRank + 1) / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-amber-400/70">
              <span>Level {trustRank + 1}/5</span>
              <span>{trustRank < 4 ? `Next: ${RANK_NAMES[trustRank + 1]}` : "Max Rank"}</span>
            </div>
          </div>

          {/* Reputation Score */}
          <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 text-sm font-semibold">Reputation</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {reputation.toLocaleString()}
              </span>
              <span className="text-sm text-purple-400/70">points</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 animate-glow"
                  style={{ width: `${Math.min((reputation / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tip */}
        <div className="mt-6 pt-4 border-t border-indigo-500/20">
          <p className="text-xs text-indigo-400/60 text-center">
            Earn certificates to increase your reputation
          </p>
        </div>
      </div>
    </aside>
  );
}
