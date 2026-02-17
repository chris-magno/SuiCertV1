"use client";

import { Certificate } from "@/lib/types";
import { CERT_TYPE_NAMES, RANK_NAMES } from "@/lib/constants";
import { Eye, Calendar, User, Award, Hash, ExternalLink } from "lucide-react";

interface IssuedCertificatesTableProps {
  certificates: Certificate[];
  onViewCertificate: (cert: Certificate) => void;
}

export function IssuedCertificatesTable({ certificates, onViewCertificate }: IssuedCertificatesTableProps) {
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl overflow-hidden">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-indigo-950/50 border-b border-indigo-500/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Certificate
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Trust Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Issued Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                IPFS
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-indigo-500/20">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-indigo-300/50">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-semibold">No certificates issued yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              certificates.map((cert, index) => (
                <tr
                  key={cert.id}
                  className="hover:bg-indigo-950/30 transition-colors cursor-pointer"
                  onClick={() => onViewCertificate(cert)}
                >
                  {/* Certificate Title & ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm mb-1">
                          {cert.title}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-indigo-400/70">
                          <Hash className="w-3 h-3" />
                          {truncateAddress(cert.id)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Recipient */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span className="text-indigo-200 text-sm font-mono">
                        {truncateAddress(cert.owner)}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {CERT_TYPE_NAMES[cert.certType] || "Unknown"}
                    </span>
                  </td>

                  {/* Trust Rank */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs">{cert.trustRank + 1}</span>
                      </div>
                      <span className="text-amber-300 text-sm font-medium">
                        {RANK_NAMES[cert.trustRank] || "Novice"}
                      </span>
                    </div>
                  </td>

                  {/* Issued Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-indigo-300 text-sm">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {formatDate(cert.issuedAt)}
                    </div>
                  </td>

                  {/* IPFS */}
                  <td className="px-6 py-4">
                    {cert.pinataCid ? (
                      <a
                        href={cert.ipfsUrl || `https://ipfs.io/ipfs/${cert.pinataCid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCertificate(cert);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {certificates.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-indigo-300 px-2">
          <div>
            Showing <span className="font-bold text-white">{certificates.length}</span> issued certificate{certificates.length !== 1 ? 's' : ''}
          </div>
          <div className="text-indigo-400/70">
            Click any row to view details
          </div>
        </div>
      )}
    </div>
  );
}
