"use client";

import { UserProfile } from "@/lib/types";
import { RANK_NAMES } from "@/lib/constants";
import { Shield } from "lucide-react";

interface StatsSidebarProps {
  profile: UserProfile | null;
  totalCerts: number;
}

export function StatsSidebar({ profile, totalCerts }: StatsSidebarProps) {
  const trustRank = profile?.trustRank ?? 0;
  const reputation = profile?.reputation ?? 0;

  return (
    <div className="fixed top-24 right-6 z-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="bg-slate-900/80 backdrop-blur-custom border border-indigo-500/30 rounded-3xl p-6 shadow-2xl w-72">
        <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Your Stats
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-indigo-300">Total Certificates</span>
              <span className="text-white font-bold">{totalCerts}</span>
            </div>
            <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-glow transition-all duration-500"
                style={{ width: `${Math.min((totalCerts / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-indigo-300">Trust Rank</span>
              <span className="text-white font-bold">{RANK_NAMES[trustRank]}</span>
            </div>
            <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 animate-glow transition-all duration-500"
                style={{ width: `${((trustRank + 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-500/20">
            <div className="text-xs text-indigo-400 mb-2">Reputation Score</div>
            <div className="text-3xl font-black text-white">{reputation.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
