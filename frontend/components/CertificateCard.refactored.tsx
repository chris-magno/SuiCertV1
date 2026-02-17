/**
 * Certificate Card - Refactored
 * Clean, hierarchical design with hover states
 */

"use client";

import { Certificate } from "@/lib/types";
import { CERT_TYPE_NAMES, RANK_NAMES } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";
import { Shield, Award, Calendar, ExternalLink } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  certificate: Certificate;
  onClick?: () => void;
  selected?: boolean;
}

export function CertificateCard({ certificate, onClick, selected = false }: CertificateCardProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      hoverable
      clickable
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden",
        selected && "ring-2 ring-indigo-500"
      )}
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
            {certificate.title}
          </h3>
          <p className="text-sm text-slate-400">
            {certificate.issuerName}
          </p>
        </div>
        
        <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
        {certificate.description}
      </p>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="primary" size="sm" dot>
          <Shield className="w-3 h-3" />
          {RANK_NAMES[certificate.trustRank]}
        </Badge>
        
        <Badge variant="default" size="sm">
          <Award className="w-3 h-3" />
          {CERT_TYPE_NAMES[certificate.certType]}
        </Badge>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatTimestamp(certificate.issuedAt)}</span>
        </div>
        
        {certificate.bountyAmount && certificate.bountyAmount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <span className="text-xs font-semibold text-yellow-400">
              {(certificate.bountyAmount / 1_000_000_000).toFixed(3)} SUI
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
