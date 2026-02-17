/**
 * Certificate Modal - Refactored
 * Clean UI/UX hierarchy with design system components
 */

"use client";

import { Certificate } from "@/lib/types";
import { CERT_TYPE_NAMES, RANK_NAMES } from "@/lib/constants";
import { formatTimestamp, getIpfsUrl } from "@/lib/utils";
import { toast } from "sonner";
import { ExternalLink, Share2, Copy, User, Calendar, Shield, Award } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Modal, ModalFooter, Button, Badge } from "@/components/ui";

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  const account = useCurrentAccount();
  
  if (!certificate) return null;

  const isViewingAsIssuer = account?.address && certificate.issuer === account.address;

  // ===== Handlers =====
  
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
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Share text copied to clipboard!");
    }
  };

  const handleCopyVerificationLink = () => {
    const verificationUrl = `${window.location.origin}/verify?id=${certificate.id}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success("Verification link copied!");
  };

  const handleCopyObjectId = () => {
    navigator.clipboard.writeText(certificate.id);
    toast.success("Object ID copied!");
  };

  const handleCopyRecipientAddress = () => {
    navigator.clipboard.writeText(certificate.owner);
    toast.success("Recipient address copied!");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certificate.title}
      description={certificate.issuerName}
      size="lg"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-950/80 to-indigo-900/40 rounded-2xl p-4 border border-indigo-500/30 hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            Trust Rank
          </div>
          <div className="text-white text-2xl font-bold">
            {RANK_NAMES[certificate.trustRank]}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-950/80 to-purple-900/40 rounded-2xl p-4 border border-purple-500/30 hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            Type
          </div>
          <div className="text-white text-lg font-bold">
            {CERT_TYPE_NAMES[certificate.certType]}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-950/80 to-blue-900/40 rounded-2xl p-4 border border-blue-500/30 hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Issued
          </div>
          <div className="text-white text-sm font-semibold">
            {formatTimestamp(certificate.issuedAt)}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
        <p className="text-slate-200 leading-relaxed">
          {certificate.description}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {/* Recipient */}
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Recipient</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-slate-300 font-mono">
              {certificate.owner.slice(0, 8)}...{certificate.owner.slice(-6)}
            </code>
            <button
              onClick={handleCopyRecipientAddress}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
              aria-label="Copy recipient address"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Object ID */}
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <span className="text-sm text-slate-400">Object ID</span>
          <div className="flex items-center gap-2">
            <code className="text-xs text-slate-300 font-mono">
              {certificate.id.slice(0, 8)}...{certificate.id.slice(-6)}
            </code>
            <button
              onClick={handleCopyObjectId}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
              aria-label="Copy object ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expiration */}
        {certificate.expiresAt > 0 && (
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <span className="text-sm text-slate-400">Expires</span>
            <Badge variant={Date.now() < certificate.expiresAt ? "success" : "error"}>
              {formatTimestamp(certificate.expiresAt)}
            </Badge>
          </div>
        )}

        {/* Bounty */}
        {certificate.bountyAmount && certificate.bountyAmount > 0 && (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-950/50 to-yellow-900/30 rounded-xl border border-yellow-500/30">
            <span className="text-sm text-yellow-400">Bounty Reward</span>
            <span className="text-yellow-300 font-bold">
              {(certificate.bountyAmount / 1_000_000_000).toFixed(3)} SUI
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <ModalFooter className="pt-6">
        <Button
          variant="outline"
          onClick={handleCopyVerificationLink}
          icon={<Copy className="w-4 h-4" />}
        >
          Copy Verification Link
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleShare}
          icon={<Share2 className="w-4 h-4" />}
        >
          Share
        </Button>
        
        <Button
          variant="primary"
          onClick={handleViewIPFS}
          icon={<ExternalLink className="w-4 h-4" />}
        >
          View on IPFS
        </Button>
      </ModalFooter>
    </Modal>
  );
}
