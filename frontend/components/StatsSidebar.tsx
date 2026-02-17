"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types";
import { RANK_NAMES } from "@/lib/constants";
import { Shield, Award, TrendingUp, Star, ChevronRight, ChevronLeft } from "lucide-react";

interface StatsSidebarProps {
  profile: UserProfile | null;
  totalCerts: number;
}

export function StatsSidebar({ profile, totalCerts }: StatsSidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const trustRank = profile?.trustRank ?? 0;
  const reputation = profile?.reputation ?? 0;

  return (
    <div 
      className={`fixed top-28 right-6 z-10 animate-fade-in transition-all duration-300 ${
        isMinimized ? 'w-14' : 'w-80'
      }`} 
      style={{ animationDelay: "0.4s" }}
    >
      <div className="bg-slate-900/95 backdrop-blur-custom border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
        {/* Minimized View */}
        {isMinimized ? (
          <div className="p-4">
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center justify-center p-2 hover:bg-indigo-600/20 rounded-xl transition-colors group"
              title="Expand Stats"
            >
              <ChevronLeft className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </button>
            
            {/* Minimized Stats Icons */}
            <div className="mt-4 space-y-4">
              <div className="flex flex-col items-center gap-1 p-2 bg-indigo-600/10 rounded-xl" title="Certificates">
                <Award className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-white">{totalCerts}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 p-2 bg-amber-600/10 rounded-xl" title="Trust Rank">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-amber-400">{trustRank + 1}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 p-2 bg-purple-600/10 rounded-xl" title="Reputation">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-purple-400">{Math.floor(reputation / 100)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/20 rounded-xl">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-white text-2xl font-black">Your Stats</h3>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-indigo-600/20 rounded-xl transition-colors group"
                title="Minimize"
              >
                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </button>
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
        )}
      </div>
    </div>
  );
}
