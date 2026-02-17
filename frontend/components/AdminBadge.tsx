"use client";

import { Crown, Shield, Award, CheckCircle, Plus } from "lucide-react";
import { useAdminCaps } from "@/hooks/useSuiData";

interface AdminBadgeProps {
  onIssueClick?: () => void;
}

export function AdminBadge({ onIssueClick }: AdminBadgeProps = {}) {
  const { data: adminCaps = [] } = useAdminCaps();
  
  if (adminCaps.length === 0) return null;

  const adminCap = adminCaps[0];

  return (
    <div className="relative group">
      {/* Main Badge */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-[2px] rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">
        <div className="bg-gradient-to-br from-amber-900/95 to-orange-900/95 backdrop-blur-xl rounded-2xl p-6">
          <div className="flex items-center gap-4">
            {/* Badge Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full"></div>
              <div className="relative p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <Crown className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              {/* Verified Check Mark */}
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-amber-900">
                <CheckCircle className="w-4 h-4 text-white fill-green-500" />
              </div>
            </div>

            {/* Badge Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-amber-100">Admin Badge Earned</h3>
                <span className="px-2 py-0.5 bg-amber-500/30 border border-amber-400/50 rounded-full text-xs font-semibold text-amber-300">
                  VERIFIED
                </span>
              </div>
              <p className="text-amber-200/80 text-sm font-medium">
                {adminCap.institutionName}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 px-6 border-l border-amber-500/30">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-2xl font-bold text-amber-100">
                    {adminCap.totalIssued}
                  </span>
                </div>
                <p className="text-xs text-amber-300/60 font-medium">Issued</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-2xl font-bold text-amber-100">
                    {adminCap.authorizedTypes?.length || 0}
                  </span>
                </div>
                <p className="text-xs text-amber-300/60 font-medium">Types</p>
              </div>
            </div>

            {/* Issue Button */}
            {onIssueClick && (
              <button
                onClick={onIssueClick}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/30 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Issue Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover Tooltip with More Info */}
      <div className="absolute left-0 right-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-xl p-4 shadow-2xl">
          <p className="text-amber-200 text-sm mb-2 font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Institution Details
          </p>
          <div className="space-y-1 text-xs text-amber-300/70">
            <p>
              <span className="font-semibold text-amber-200">Address:</span>{" "}
              <span className="font-mono">{adminCap.institutionAddress.slice(0, 20)}...</span>
            </p>
            <p>
              <span className="font-semibold text-amber-200">Total Certificates Issued:</span>{" "}
              {adminCap.totalIssued}
            </p>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
    </div>
  );
}
