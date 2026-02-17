"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useAdminCaps } from "@/hooks/useSuiData";
import { Shield, Crown } from "lucide-react";

export function WalletConnect() {
  const account = useCurrentAccount();
  const { data: adminCaps = [] } = useAdminCaps();
  const isAdmin = adminCaps.length > 0;

  return (
    <div className="relative">
      <ConnectButton className="!px-6 !py-3 !bg-gradient-to-r !from-indigo-600 !to-purple-600 !rounded-2xl !text-white !font-bold !transition-all !duration-300 hover:!scale-105 !shadow-lg !shadow-indigo-500/50" />
      
      {account && isAdmin && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg animate-pulse-slow">
          <Crown className="w-3 h-3 text-white" />
          <span className="text-xs font-bold text-white">ADMIN</span>
        </div>
      )}
      
      {account && isAdmin && (
        <div className="absolute -bottom-8 right-0 flex items-center gap-2 px-3 py-1 bg-amber-950/90 backdrop-blur-sm border border-amber-500/50 rounded-lg text-xs text-amber-300 whitespace-nowrap">
          <Shield className="w-3 h-3" />
          {adminCaps[0].institutionName}
        </div>
      )}
    </div>
  );
}
