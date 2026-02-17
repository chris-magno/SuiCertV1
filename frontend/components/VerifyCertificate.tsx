"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyCertificate } from "@/hooks/useSuiData";
import { Certificate } from "@/lib/types";
import { CERT_TYPE_NAMES, RANK_NAMES, RANK_ICONS } from "@/lib/constants";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Shield,
  User,
  Calendar,
  Award,
  Building2,
  Loader2,
  Share2,
  Copy
} from "lucide-react";
import { toast } from "sonner";

export function VerifyCertificate() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const { data: verificationResult, isLoading } = useVerifyCertificate(certificateId);

  // Check URL parameters on mount
  useEffect(() => {
    const certId = searchParams.get("id");
    if (certId) {
      setInputValue(certId);
      setCertificateId(certId);
    }
  }, [searchParams]);

  const handleVerify = () => {
    if (inputValue.trim()) {
      setCertificateId(inputValue.trim());
      // Update URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.set("id", inputValue.trim());
      window.history.pushState({}, "", url);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleReset = () => {
    setInputValue("");
    setCertificateId(null);
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.pushState({}, "", url);
  };

  const handleShareLink = () => {
    if (!certificateId) return;
    const url = `${window.location.origin}/verify?id=${certificateId}`;
    navigator.clipboard.writeText(url);
    toast.success("Verification link copied to clipboard!");
  };

  const handleCopyId = () => {
    if (!certificateId) return;
    navigator.clipboard.writeText(certificateId);
    toast.success("Certificate ID copied to clipboard!");
  };

  const renderVerificationResult = () => {
    if (!certificateId) return null;

    if (isLoading) {
      return (
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            <p className="text-white">Verifying certificate on blockchain...</p>
          </div>
        </div>
      );
    }

    if (!verificationResult) return null;

    // Invalid certificate
    if (!verificationResult.isValid) {
      return (
        <div className="mt-8 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-red-400 mb-2">Invalid Certificate</h3>
              <p className="text-red-300/80">{verificationResult.error}</p>
              <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm text-red-300/60">
                  This certificate ID does not exist on the Sui blockchain or is not a valid SuiCert certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Valid certificate
    const certificate = verificationResult.certificate as Certificate;
    const isExpired = verificationResult.isExpired;

    return (
      <div className="mt-8 space-y-6">
        {/* Verification Status */}
        <div className={`backdrop-blur-xl border rounded-2xl p-8 ${
          isExpired 
            ? "bg-yellow-500/10 border-yellow-500/30"
            : "bg-green-500/10 border-green-500/30"
        }`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {isExpired ? (
                <AlertCircle className="w-12 h-12 text-yellow-400" />
              ) : (
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${
                isExpired ? "text-yellow-400" : "text-green-400"
              }`}>
                {isExpired ? "Valid but Expired Certificate" : "Verified Authentic Certificate"}
              </h3>
              <p className={isExpired ? "text-yellow-300/80" : "text-green-300/80"}>
                {isExpired 
                  ? "This certificate is authentic but has expired."
                  : "This certificate is authentic and verified on the Sui blockchain."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-indigo-400" />
            Certificate Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-indigo-400 mt-1" />
                <div>
                  <p className="text-sm text-indigo-300/60 mb-1">Title</p>
                  <p className="text-lg font-semibold text-white">{certificate.title}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {certificate.description && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm text-indigo-300/60 mb-1">Description</p>
                <p className="text-white/80">{certificate.description}</p>
              </div>
            )}

            {/* Issuer */}
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-indigo-400 mt-1" />
              <div>
                <p className="text-sm text-indigo-300/60 mb-1">Issued By</p>
                <p className="text-white font-medium">{certificate.issuerName}</p>
                <p className="text-xs text-indigo-300/40 font-mono break-all">{certificate.issuer}</p>
              </div>
            </div>

            {/* Owner */}
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-indigo-400 mt-1" />
              <div>
                <p className="text-sm text-indigo-300/60 mb-1">Recipient</p>
                <p className="text-xs text-white font-mono break-all">{certificate.owner}</p>
              </div>
            </div>

            {/* Issue Date */}
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-indigo-400 mt-1" />
              <div>
                <p className="text-sm text-indigo-300/60 mb-1">Issued On</p>
                <p className="text-white">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Certificate Type */}
            <div>
              <p className="text-sm text-indigo-300/60 mb-1">Type</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {CERT_TYPE_NAMES[certificate.certType] || "Unknown"}
              </span>
            </div>

            {/* Trust Rank */}
            <div>
              <p className="text-sm text-indigo-300/60 mb-1">Trust Rank</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {RANK_ICONS[certificate.trustRank]} {RANK_NAMES[certificate.trustRank] || "Unknown"}
              </span>
            </div>

            {/* Expiration */}
            {certificate.expiresAt > 0 && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-indigo-400 mt-1" />
                <div>
                  <p className="text-sm text-indigo-300/60 mb-1">
                    {isExpired ? "Expired On" : "Expires On"}
                  </p>
                  <p className={isExpired ? "text-yellow-400" : "text-white"}>
                    {new Date(certificate.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Certificate ID */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-indigo-300/60 mb-1">Certificate ID</p>
              <p className="text-xs text-indigo-300/80 font-mono break-all bg-white/5 p-3 rounded-lg border border-white/10">
                {certificate.id}
              </p>
            </div>

            {/* IPFS Link */}
            {certificate.ipfsUrl && (
              <div className="col-span-1 md:col-span-2">
                <a
                  href={certificate.ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on IPFS</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleShareLink}
            className="px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Verification Link</span>
          </button>
          
          <button
            onClick={handleCopyId}
            className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Certificate ID</span>
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200"
          >
            Verify Another Certificate
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-2xl mb-4">
          <Search className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">
          Verify Certificate
        </h1>
        <p className="text-xl text-indigo-300/80">
          Enter a certificate ID to verify its authenticity on the blockchain
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
        <label className="block text-sm font-medium text-indigo-300 mb-3">
          Certificate ID
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter certificate object ID (e.g., 0x123abc...)"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          />
          <button
            onClick={handleVerify}
            disabled={!inputValue.trim() || isLoading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Verify</span>
              </>
            )}
          </button>
        </div>
        <p className="mt-3 text-sm text-indigo-300/60">
          The certificate ID is a Sui object ID starting with "0x" (e.g., 0x1234abcd...).
        </p>
        <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-sm text-indigo-300/80 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              You can find the certificate ID in your certificate details or by checking the certificate on the Sui blockchain explorer.
            </span>
          </p>
        </div>
      </div>

      {/* Verification Result */}
      {renderVerificationResult()}
    </div>
  );
}
