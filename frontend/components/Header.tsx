"use client";

import { WalletConnect } from "./WalletConnect";
import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onToggleView?: () => void;
  viewMode?: "grid" | "list";
}

export function Header({ onToggleView, viewMode }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="relative z-10 p-6 pb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="animate-fade-in">
          <Link href="/">
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2 cursor-pointer hover:opacity-80 transition-opacity">
              SuiCert{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Vault
              </span>
            </h1>
          </Link>
          <p className="text-indigo-300 text-sm tracking-wide flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            The Internet of Verified Skills
          </p>
        </div>

        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Navigation Links */}
          <Link
            href="/"
            className={`px-6 py-3 backdrop-blur-xl border rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
              pathname === "/"
                ? "bg-indigo-600/50 border-indigo-400/50 text-white"
                : "bg-indigo-600/20 border-indigo-400/20 text-indigo-300 hover:bg-indigo-600/30"
            }`}
          >
            My Certificates
          </Link>
          
          <Link
            href="/verify"
            className={`px-6 py-3 backdrop-blur-xl border rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
              pathname === "/verify"
                ? "bg-green-600/50 border-green-400/50 text-white"
                : "bg-green-600/20 border-green-400/20 text-green-300 hover:bg-green-600/30"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify</span>
          </Link>

          {/* View Toggle Button (only show on home page) */}
          {onToggleView && viewMode && (
            <button
              onClick={onToggleView}
              className="px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 backdrop-blur-xl border border-indigo-400/30 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              {viewMode === "grid" ? "📋 List View" : "⊞ Grid View"}
            </button>
          )}
          
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
