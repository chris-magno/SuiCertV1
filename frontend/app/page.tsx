"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Header } from "@/components/Header";
import { CertificateCard } from "@/components/CertificateCard";
import { CertificateModal } from "@/components/CertificateModal";
import { StatsSidebar } from "@/components/StatsSidebar";
import { useCertificates, useUserProfile } from "@/hooks/useSuiData";
import { Certificate, ViewMode } from "@/lib/types";
import { Plus, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const account = useCurrentAccount();
  const { data: certificates = [], isLoading: certsLoading } = useCertificates();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleAddCertificate = () => {
    toast.info("Add Certificate", {
      description: "In production, this will open a form to mint a new certificate on Sui blockchain",
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <BackgroundEffects />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h1 className="text-6xl font-black text-white mb-4 animate-fade-in">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                SuiCert
              </span>
            </h1>
            <p className="text-xl text-indigo-300 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              The Internet of Verified Skills
            </p>
            <p className="text-indigo-300/80 mb-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              Connect your Sui wallet to view and manage your soulbound certificates
            </p>
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Header onToggleView={toggleViewMode} viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-x-hidden">
      <BackgroundEffects />
      
      <Header onToggleView={toggleViewMode} viewMode={viewMode} />

      {/* Main Content */}
      <main className="relative z-10 p-6 mt-8">
        <div className="max-w-7xl mx-auto">
          {certsLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-indigo-300">Loading your certificates...</p>
              </div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Certificates Yet</h3>
                <p className="text-indigo-300 mb-6">
                  Start your journey by earning your first certificate or create a user profile
                </p>
                <button
                  onClick={handleAddCertificate}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold hover:scale-105 transition-transform"
                >
                  Get Started
                </button>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "grid grid-cols-1 max-w-2xl mx-auto gap-8"
              }
            >
              {certificates.map((cert, index) => (
                <CertificateCard
                  key={cert.id}
                  certificate={cert}
                  onClick={() => setSelectedCertificate(cert)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Stats Sidebar */}
      <StatsSidebar profile={profile} totalCerts={certificates.length} />

      {/* Certificate Detail Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* Floating Action Button */}
      <button
        onClick={handleAddCertificate}
        className="fixed bottom-6 right-6 z-20 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 animate-float"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Instructions */}
      <div className="fixed bottom-6 left-6 z-10 bg-slate-900/70 backdrop-blur-xl border border-indigo-500/20 rounded-2xl px-4 py-3 text-indigo-300 text-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <span className="font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Tip:
        </span>{" "}
        Click certificates to view details • Hover for preview
      </div>
    </div>
  );
}
