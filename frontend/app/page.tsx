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
import { AchievementSystem } from "@/components/AchievementSystem";
import { AdminBadge } from "@/components/AdminBadge";
import { BadgeCard, Badge } from "@/components/BadgeCard";
import { useCertificates, useUserProfile, useAdminCaps, useIssuedCertificates } from "@/hooks/useSuiData";
import { Certificate, ViewMode, UserProfile } from "@/lib/types";
import { Plus, Lightbulb, Shield, Crown, Award, FileCheck, User, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type AdminViewMode = "my-certificates" | "issued-certificates";

function getBadges(
  isAdmin: boolean, 
  certificates: Certificate[], 
  profile: UserProfile | null
): Badge[] {
  const totalCertificates = certificates.length;
  
  // Sort certificates by issue date to find milestone dates
  const sortedCerts = [...certificates].sort((a, b) => a.issuedAt - b.issuedAt);
  
  // Get earned dates for collector badges
  const bronzeEarnedDate = sortedCerts[4]?.issuedAt; // 5th certificate
  const silverEarnedDate = sortedCerts[9]?.issuedAt; // 10th certificate
  const goldEarnedDate = sortedCerts[19]?.issuedAt; // 20th certificate
  
  // Use profile joinedAt for welcome and early adopter badges
  const joinedAt = profile?.joinedAt || Date.now();
  
  const badges: Badge[] = [
    // Default beginner badge - everyone gets this
    {
      id: "beginner",
      name: "Welcome Badge",
      description: "Your journey begins here",
      icon: "star",
      tier: "common",
      earned: true,
      earnedDate: joinedAt,
    },
    // Admin badge - earned when user has admin cap
    {
      id: "admin",
      name: "Admin Badge",
      description: "Certificate issuer authority",
      icon: "crown",
      tier: "legendary",
      earned: isAdmin,
      earnedDate: isAdmin ? joinedAt : undefined,
      requirement: isAdmin ? undefined : "Obtain an AdminCap to unlock",
    },
    // Certificate collector badges
    {
      id: "collector-bronze",
      name: "Bronze Collector",
      description: "Earned 5 certificates",
      icon: "award",
      tier: "common",
      earned: totalCertificates >= 5,
      earnedDate: bronzeEarnedDate,
      requirement: totalCertificates >= 5 ? undefined : `${totalCertificates}/5 certificates`,
    },
    {
      id: "collector-silver",
      name: "Silver Collector",
      description: "Earned 10 certificates",
      icon: "award",
      tier: "rare",
      earned: totalCertificates >= 10,
      earnedDate: silverEarnedDate,
      requirement: totalCertificates >= 10 ? undefined : `${totalCertificates}/10 certificates`,
    },
    {
      id: "collector-gold",
      name: "Gold Collector",
      description: "Earned 20 certificates",
      icon: "shield",
      tier: "epic",
      earned: totalCertificates >= 20,
      earnedDate: goldEarnedDate,
      requirement: totalCertificates >= 20 ? undefined : `${totalCertificates}/20 certificates`,
    },
    {
      id: "early-adopter",
      name: "Early Adopter",
      description: "One of the first to join SuiCert",
      icon: "sparkles",
      tier: "epic",
      earned: true,
      earnedDate: joinedAt,
    },
  ];

  return badges;
}

export default function Home() {
  const account = useCurrentAccount();
  const { data: certificates = [], isLoading: certsLoading, refetch: refetchCerts } = useCertificates();
  const { data: issuedCertificates = [], isLoading: issuedLoading, refetch: refetchIssued } = useIssuedCertificates();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: adminCaps = [] } = useAdminCaps();
  const isAdmin = adminCaps.length > 0;
  
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const badges = getBadges(isAdmin, certificates, profile);
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

      {/* Admin Badge - Earned for having AdminCap */}
      {isAdmin && (
        <div className="relative z-10 px-6 mt-4">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <AdminBadge onIssueClick={handleAddCertificate} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 p-6 mt-8">
        <div className="max-w-[1920px] mx-auto flex gap-6">
          {/* Content Area */}
          <div className="flex-1 min-w-0">
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
                >  <Award className="w-5 h-5" />
                  <span>Badge Collection</span>
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {badges.filter(b => b.earned).length}/{badges.length}
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

          {/* Achievement System (Admin Only on Issued Certificates View) */}
          {isAdmin && adminViewMode === "issued-certificates" && (
            <div className="mb-8 animate-fade-in">
              <AchievementSystem totalIssued={adminCaps[0]?.totalIssued || 0} />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-indigo-300">
                  {adminViewMode === "issued-certificates" 
                    ? "Loading issued certificates..." 
                    : isAdmin && adminViewMode === "my-certificates"
                      ? "Loading your badges..."
                      : "Loading your certificates..."}
                </p>
              </div>
            </div>
          ) : displayCertificates.length === 0 && !(isAdmin && adminViewMode === "my-certificates") ? (
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
            ) : isAdmin && adminViewMode === "my-certificates" ? (
              // Badge Collection view for admins
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Your Badge Collection</h2>
                  <p className="text-indigo-300">Showcase your achievements and milestones</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {badges.map((badge, index) => (
                    <BadgeCard key={badge.id} badge={badge} index={index} />
                  ))}
                </div>
              </div>
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
        
        {/* Stats Sidebar */}
        <StatsSidebar 
          profile={profile} 
          totalCerts={certificates.length}
          isAdmin={isAdmin}
          totalIssued={adminCaps[0]?.totalIssued || 0}
          institutionName={adminCaps[0]?.institutionName || ""}
          badgesEarned={badges.filter(b => b.earned).length}
          totalBadges={badges.length}
        />
      </div>
      </main>

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
