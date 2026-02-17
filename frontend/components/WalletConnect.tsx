"use client";

import { ConnectButton } from "@mysten/dapp-kit";

export function WalletConnect() {
  return (
    <ConnectButton className="!px-6 !py-3 !bg-gradient-to-r !from-indigo-600 !to-purple-600 !rounded-2xl !text-white !font-bold !transition-all !duration-300 hover:!scale-105 !shadow-lg !shadow-indigo-500/50" />
  );
}
