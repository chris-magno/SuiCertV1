"use client";

import { Certificate } from "@/lib/types";
import { CERT_TYPE_NAMES, RANK_NAMES } from "@/lib/constants";
import { formatTimestamp, getIpfsUrl } from "@/lib/utils";
import { toast } from "sonner";
import { X, ExternalLink, Share2, ShieldCheck, Copy, User } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  const account = useCurrentAccount();
  
  if (!isOpen || !certificate) return null;

  const isViewingAsIssuer = account?.address && certificate.issuer === account.address;

  const handleViewIPFS = () => {
    const url = getIpfsUrl(certificate.pinataCid);
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    const shareText = `Check out my ${certificate.title} certificate from ${certificate.issuerName}!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: certificate.title,
          text: shareText,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      toast.success("Share link copied to clipboard!");
    }
  };

  const handleShareVerificationLink = () => {
    const verificationUrl = `${window.location.origin}/verify?id=${certificate.id}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success("Verification link copied to clipboard! Anyone can use this link to verify your certificate.");
  };

  const handleCopyObjectId = () => {
    navigator.clipboard.writeText(certificate.id);
    toast.success("Object ID copied to clipboard!");
  };

  const handleCopyRecipientAddress = () => {
    navigator.clipboard.writeText(certificate.owner);
    toast.success("Recipient address copied to clipboard!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-6 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-custom border border-indigo-500/30 rounded-3xl p-8 shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-3xl font-black text-white mb-2">
              {certificate.title}
            </h3>
            <p className="text-indigo-300 text-lg font-medium">
              {certificate.issuerName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-950/50 rounded-2xl p-4 border border-indigo-500/20 hover:scale-105 transition-transform">
            <div className="text-indigo-400 text-xs font-semibold mb-1">
              Trust Rank
            </div>
            <div className="text-white text-2xl font-bold">
              {RANK_NAMES[certificate.trustRank]}
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-2xl p-4 border border-purple-500/20 hover:scale-105 transition-transform">
            <div className="text-purple-400 text-xs font-semibold mb-1">Type</div>
            <div className="text-white text-2xl font-bold">
              {CERT_TYPE_NAMES[certificate.certType]}
            </div>
          </div>

          <div className="bg-indigo-950/50 rounded-2xl p-4 border border-indigo-500/20 hover:scale-105 transition-transform">
            <div className="text-indigo-400 text-xs font-semibold mb-1">
              Issued
            </div>
            <div className="text-white text-lg font-bold">
              {formatTimestamp(certificate.issuedAt)}
            </div>
          </div>
        </div>

        {/* Description */}
        {certificate.description && (
          <div className="mb-6 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-xs font-semibold mb-2">
              Description
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {certificate.description}
            </p>
          </div>
        )}

        {/* Recipient Address - Show when viewing as issuer */}
        {isViewingAsIssuer && (
          <div className="mb-6 bg-amber-950/30 rounded-2xl p-4 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                  <User className="w-4 h-4" />
                  Recipient Address
                </div>
                <p className="text-white/90 text-sm font-mono break-all">
                  {certificate.owner}
                </p>
              </div>
              <button
                onClick={handleCopyRecipientAddress}
                className="ml-3 p-2 bg-amber-600/30 hover:bg-amber-600/50 rounded-lg transition-colors"
                title="Copy recipient address"
              >
                <Copy className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleViewIPFS}
            className="py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:scale-102 transition-transform"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="hidden md:inline">View on IPFS</span>
            <span className="md:hidden">IPFS</span>
          </button>

          <button
            onClick={handleShare}
            className="py-4 bg-indigo-600/30 backdrop-blur-xl border border-indigo-400/30 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-600/50 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden md:inline">Share</span>
            <span className="md:hidden">Share</span>
          </button>

          <button
            onClick={handleShareVerificationLink}
            className="py-4 bg-green-600/30 backdrop-blur-xl border border-green-400/30 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-600/50 transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="hidden md:inline">Verify Link</span>
            <span className="md:hidden">Verify</span>
          </button>

          <button
            onClick={handleCopyObjectId}
            className="py-4 bg-amber-600/30 backdrop-blur-xl border border-amber-400/30 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 hover:bg-amber-600/50 transition-colors"
          >
            <Copy className="w-5 h-5" />
            <span className="hidden md:inline">Copy ID</span>
            <span className="md:hidden">Copy ID</span>
          </button>
        </div>
      </div>
    </div>
  );
}
