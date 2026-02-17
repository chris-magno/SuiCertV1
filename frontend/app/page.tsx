"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Header } from "@/components/Header";
import { CertificateCard } from "@/components/CertificateCard";
import { CertificateModal } from "@/components/CertificateModal";
import { StatsSidebar } from "@/components/StatsSidebar";
import { IssueCertificateForm } from "@/components/IssueCertificateForm";
import { IssuedCertificatesTable } from "@/components/IssuedCertificatesTable";
import { useCertificates, useUserProfile, useAdminCaps, useIssuedCertificates } from "@/hooks/useSuiData";
import { Certificate, ViewMode } from "@/lib/types";
import { Plus, Lightbulb, Shield, Crown, Award, FileCheck, User, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type AdminViewMode = "my-certificates" | "issued-certificates";

export default function Home() {
  const account = useCurrentAccount();
  const { data: certificates = [], isLoading: certsLoading, refetch: refetchCerts } = useCertificates();
  const { data: issuedCertificates = [], isLoading: issuedLoading, refetch: refetchIssued } = useIssuedCertificates();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: adminCaps = [] } = useAdminCaps();
  const isAdmin = adminCaps.length > 0;
  
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [adminViewMode, setAdminViewMode] = useState<AdminViewMode>("my-certificates");
  const [showIssueForm, setShowIssueForm] = useState(false);

  const handleAddCertificate = () => {
    setShowIssueForm(true);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleRefresh = () => {
    if (adminViewMode === "issued-certificates") {
      refetchIssued();
      toast.success("Refreshing issued certificates...");
    } else {
      refetchCerts();
      toast.success("Refreshing certificates...");
    }
  };

  // Determine which certificates to display
  const displayCertificates = isAdmin && adminViewMode === "issued-certificates" 
    ? issuedCertificates 
    : certificates;
  
  const isLoading = adminViewMode === "issued-certificates" ? issuedLoading : certsLoading;

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

      {/* Admin Banner */}
      {isAdmin && (
        <div className="relative z-10 px-6 mt-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-amber-900/40 via-orange-900/40 to-amber-900/40 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-lg shadow-amber-500/20 animate-fade-in">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Crown className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-white">Admin Access</h3>
                      <span className="px-3 py-1 bg-amber-500/30 border border-amber-400/50 rounded-full text-xs font-semibold text-amber-300">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-amber-200/90 mb-3">
                      You are authorized to issue certificates as{" "}
                      <span className="font-semibold text-amber-300">
                        {adminCaps[0].institutionName}
                      </span>
                    </p>
                    <div className="flex items-center gap-6 text-sm text-amber-300/80">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Institution Address: {adminCaps[0].institutionAddress.slice(0, 10)}...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>Total Issued: {adminCaps[0].totalIssued}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddCertificate}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/30 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Issue Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 p-6 mt-8">
        <div className="max-w-7xl mx-auto">
          {/* Admin View Toggle */}
          {isAdmin && (
            <div className="mb-8 flex justify-center items-center gap-4">
              <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5">
                <button
                  onClick={() => setAdminViewMode("my-certificates")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    adminViewMode === "my-certificates"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-indigo-300 hover:text-white"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>My Certificates</span>
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {certificates.length}
                  </span>
                </button>
                <button
                  onClick={() => setAdminViewMode("issued-certificates")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    adminViewMode === "issued-certificates"
                      ? "bg-amber-600 text-white shadow-lg"
                      : "text-amber-300 hover:text-white"
                  }`}
                >
                  <FileCheck className="w-5 h-5" />
                  <span>Issued Certificates</span>
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {issuedCertificates.length}
                  </span>
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 backdrop-blur-xl border border-white/10 rounded-xl text-white transition-all duration-300 hover:scale-105 disabled:scale-100"
                title="Refresh certificates"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-indigo-300">
                  {adminViewMode === "issued-certificates" 
                    ? "Loading issued certificates..." 
                    : "Loading your certificates..."}
                </p>
              </div>
            </div>
          ) : displayCertificates.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">
                  {adminViewMode === "issued-certificates" ? "📋" : "📜"}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {adminViewMode === "issued-certificates" 
                    ? "No Certificates Issued Yet" 
                    : "No Certificates Yet"}
                </h3>
                <p className="text-indigo-300 mb-6">
                  {adminViewMode === "issued-certificates"
                    ? "You haven't issued any certificates yet, or they are still being indexed by the blockchain."
                    : "Start your journey by earning your first certificate or create a user profile"}
                </p>
                {isAdmin && adminViewMode === "issued-certificates" && (
                  <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-200 text-sm">
                    <p className="mb-2">💡 <strong>Just issued a certificate?</strong></p>
                    <p className="mb-2">The page automatically refreshes every 5 seconds to check for new certificates.</p>
                    <p className="text-xs text-indigo-300">Note: Blockchain events may take 10-30 seconds to be indexed. The "Total Issued" count in the admin banner updates immediately.</p>
                  </div>
                )}
                {isAdmin && (
                  <button
                    onClick={handleAddCertificate}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold hover:scale-105 transition-transform"
                  >
                    Issue Certificate
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Display certificates
            isAdmin && adminViewMode === "issued-certificates" ? (
              // Table view for admin's issued certificates
              <IssuedCertificatesTable
                certificates={displayCertificates}
                onViewCertificate={(cert) => setSelectedCertificate(cert)}
              />
            ) : (
              // Card/Grid view for user's certificates
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "grid grid-cols-1 max-w-2xl mx-auto gap-8"
                }
              >
                {displayCertificates.map((cert, index) => (
                  <CertificateCard
                    key={cert.id}
                    certificate={cert}
                    onClick={() => setSelectedCertificate(cert)}
                    index={index}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {/* Stats Sidebar */}
      <StatsSidebar 
        profile={profile} 
        totalCerts={adminViewMode === "issued-certificates" ? issuedCertificates.length : certificates.length} 
      />

      {/* Certificate Detail Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* Issue Certificate Form */}
      <IssueCertificateForm
        isOpen={showIssueForm}
        onClose={() => setShowIssueForm(false)}
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
