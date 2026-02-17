"use client";

import { WalletConnect } from "./WalletConnect";
import { Star } from "lucide-react";

interface HeaderProps {
  onToggleView: () => void;
  viewMode: "grid" | "list";
}

export function Header({ onToggleView, viewMode }: HeaderProps) {
  return (
    <header className="relative z-10 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            SuiCert{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Vault
            </span>
          </h1>
          <p className="text-indigo-300 text-sm tracking-wide flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            The Internet of Verified Skills
          </p>
        </div>

        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={onToggleView}
            className="px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 backdrop-blur-xl border border-indigo-400/30 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            {viewMode === "grid" ? "📋 List View" : "⊞ Grid View"}
          </button>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
