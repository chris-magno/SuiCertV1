"use client";

import { Certificate } from "@/lib/types";
import { RANK_COLORS, RANK_ICONS, RANK_NAMES } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
  index: number;
}

export function CertificateCard({ certificate, onClick, index }: CertificateCardProps) {
  return (
    <div
      onClick={onClick}
      className={`certificate-card relative w-full h-96 rounded-3xl p-8 bg-gradient-to-br ${
        RANK_COLORS[certificate.trustRank]
      } shadow-2xl overflow-hidden cursor-pointer animate-fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="shine-effect"></div>

      {/* Holographic Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <svg
            className="w-12 h-12 text-white/90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>

          {/* Trust Rank Badge */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-2xl">{RANK_ICONS[certificate.trustRank]}</span>
            <span className="text-white font-bold text-sm">
              {RANK_NAMES[certificate.trustRank]}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white leading-tight">
            {certificate.title}
          </h3>
          <p className="text-white/80 text-sm font-medium">
            {certificate.issuerName}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-xs">
            Issued {formatTimestamp(certificate.issuedAt)}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10"></div>
      <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/5"></div>
    </div>
  );
}
