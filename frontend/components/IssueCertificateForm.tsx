"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { usePinata } from "@/hooks/usePinata";
import { useAdminCaps } from "@/hooks/useSuiData";
import { PACKAGE_ID, PLATFORM_REGISTRY_ID, CERT_TYPES, TRUST_RANKS, CERT_TYPE_NAMES, RANK_NAMES } from "@/lib/constants";
import { toast } from "sonner";
import { X, Upload, Loader2 } from "lucide-react";

interface IssueCertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IssueCertificateForm({ isOpen, onClose }: IssueCertificateFormProps) {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { uploadFile, uploadMetadata, uploading } = usePinata();
  const { data: adminCaps = [] } = useAdminCaps();
  
  const [formData, setFormData] = useState({
    recipient: "",
    title: "",
    description: "",
    certType: CERT_TYPES.COURSE as number,
    image: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user has an AdminCap
      if (adminCaps.length === 0) {
        toast.error("You need an AdminCap to issue certificates. Contact the platform administrator.");
        setIsSubmitting(false);
        return;
      }

      const adminCap = adminCaps[0]; // Use the first AdminCap

      // Step 1: Upload image to IPFS if provided
      let imageCid = "";
      if (formData.image) {
        toast.info("Uploading image to IPFS...");
        const imageResult = await uploadFile(formData.image);
        if (!imageResult) {
          throw new Error("Failed to upload image");
        }
        imageCid = imageResult.cid;
      }

      // Step 2: Create and upload metadata to IPFS
      toast.info("Uploading metadata to IPFS...");
      const metadataResult = await uploadMetadata({
        name: formData.title,
        description: formData.description,
        issuer: adminCap.institutionName || "Unknown",
        recipient: formData.recipient,
        certificateType: CERT_TYPE_NAMES[formData.certType],
        trustRank: RANK_NAMES[TRUST_RANKS.NOVICE],
        image: imageCid ? `ipfs://${imageCid}` : undefined,
        attributes: [
          { trait_type: "Certificate Type", value: CERT_TYPE_NAMES[formData.certType] },
          { trait_type: "Trust Rank", value: RANK_NAMES[TRUST_RANKS.NOVICE] },
          { trait_type: "Institution", value: adminCap.institutionName || "Unknown" },
        ],
      });

      if (!metadataResult) {
        throw new Error("Failed to upload metadata");
      }

      // Step 3: Mint certificate on blockchain
      toast.info("Minting certificate on Sui blockchain...");
      
      const tx = new Transaction();

      // Call the issue_certificate function
      tx.moveCall({
        target: `${PACKAGE_ID}::certificate::issue_certificate`,
        arguments: [
          tx.object(adminCap.id), // admin_cap
          tx.object(PLATFORM_REGISTRY_ID), // registry
          tx.pure.address(formData.recipient), // recipient
          tx.pure.u8(formData.certType), // cert_type
          tx.pure.string(formData.title), // title
          tx.pure.string(formData.description), // description
          tx.pure.string(metadataResult.cid), // pinata_cid
          tx.pure.string(metadataResult.ipfsUrl), // ipfs_url
          tx.pure.u64(0), // expires_at (0 = never)
          tx.object("0x6"), // clock shared object
        ],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: (result) => {
            console.log("Certificate minted successfully:", result);
            toast.success("Certificate issued successfully! 🎉");
            toast.info("Refreshing data... This may take a few seconds.", { duration: 3000 });
            
            // Invalidate and refetch queries immediately
            queryClient.invalidateQueries({ queryKey: ["adminCaps", account?.address] });
            queryClient.invalidateQueries({ queryKey: ["issuedCertificates", account?.address] });
            queryClient.invalidateQueries({ queryKey: ["certificates"] });
            
            // Force refetch after a short delay to allow blockchain to update
            setTimeout(() => {
              queryClient.refetchQueries({ queryKey: ["adminCaps", account?.address] });
              queryClient.refetchQueries({ queryKey: ["issuedCertificates", account?.address] });
            }, 2000);
            
            // Additional refetch after longer delay for blockchain indexing
            setTimeout(() => {
              queryClient.refetchQueries({ queryKey: ["issuedCertificates", account?.address] });
              toast.success("Data refreshed! Check your issued certificates.", { duration: 2000 });
            }, 5000);
            
            onClose();
            // Reset form
            setFormData({
              recipient: "",
              title: "",
              description: "",
              certType: CERT_TYPES.COURSE as number,
              image: null,
            });
          },
          onError: (error) => {
            console.error("Error minting certificate:", error);
            toast.error("Failed to mint certificate on blockchain");
          },
        }
      );
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-custom border border-indigo-500/30 rounded-3xl p-8 shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-3xl font-black text-white mb-2">
              Issue Certificate
            </h3>
            <p className="text-indigo-300">
              Upload to IPFS and mint on Sui blockchain
            </p>
            {adminCaps.length > 0 && (
              <p className="text-sm text-green-400 mt-2">
                ✓ Issuing as: {adminCaps[0].institutionName}
              </p>
            )}
            {adminCaps.length === 0 && (
              <p className="text-sm text-amber-400 mt-2">
                ⚠️ You need an AdminCap to issue certificates
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-semibold text-indigo-300 mb-2">
              Recipient Address *
            </label>
            <input
              type="text"
              required
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-indigo-300 mb-2">
              Certificate Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Blockchain Fundamentals"
              className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-indigo-300 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the achievement..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Certificate Type */}
          <div>
            <label className="block text-sm font-semibold text-indigo-300 mb-2">
              Certificate Type *
            </label>
            <select
              value={formData.certType}
              onChange={(e) => setFormData({ ...formData, certType: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {Object.entries(CERT_TYPES).map(([key, value]) => (
                <option key={value} value={value}>
                  {CERT_TYPE_NAMES[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-indigo-300 mb-2">
              Certificate Image (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl text-white cursor-pointer hover:bg-slate-800/70 transition-colors"
              >
                <Upload className="w-5 h-5" />
                {formData.image ? formData.image.name : "Upload Image"}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || uploading || adminCaps.length === 0}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:scale-102 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploading ? "Uploading to IPFS..." : "Minting Certificate..."}
              </>
            ) : (
              "Issue Certificate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
