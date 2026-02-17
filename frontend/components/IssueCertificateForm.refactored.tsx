/**
 * Issue Certificate Form - Refactored
 * Clean architecture with service layer integration
 */

"use client";

import { useState, FormEvent } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminCaps } from "@/hooks/useSuiData";
import { CertificateService, IPFSService } from "@/services";
import { CERT_TYPES, TRUST_RANKS, CERT_TYPE_NAMES, RANK_NAMES } from "@/lib/constants";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Modal, ModalFooter, Button, Input, Textarea } from "@/components/ui";

interface IssueCertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  recipient: string;
  title: string;
  description: string;
  certType: number;
  image: File | null;
}

export function IssueCertificateForm({ isOpen, onClose }: IssueCertificateFormProps) {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data: adminCaps = [] } = useAdminCaps();
  
  const [formData, setFormData] = useState<FormData>({
    recipient: "",
    title: "",
    description: "",
    certType: CERT_TYPES.COURSE,
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // ===== Handlers =====

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const errors = IPFSService.validateFile(file);
      if (errors.length > 0) {
        toast.error(errors[0]);
        return;
      }
      
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate admin capability
    if (adminCaps.length === 0) {
      toast.error("You need an AdminCap to issue certificates");
      return;
    }

    // Validate form data
    const validationErrors = CertificateService.validateCertificateData({
      ...formData,
      pinataCid: formData.image ? 'temp' : '', // Temporary validation
    });

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    setIsSubmitting(true);

    try {
      const adminCap = adminCaps[0];

      // Step 1: Upload image to IPFS
      let imageCid = "";
      if (formData.image) {
        setUploadProgress("Uploading image to IPFS...");
        const imageResult = await IPFSService.uploadFile(formData.image);
        
        if (!imageResult) {
          throw new Error("Failed to upload image");
        }
        imageCid = imageResult.cid;
      }

      // Step 2: Upload metadata to IPFS
      setUploadProgress("Uploading metadata to IPFS...");
      const metadataResult = await IPFSService.uploadMetadata({
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

      // Step 3: Create and execute blockchain transaction
      setUploadProgress("Minting certificate on Sui blockchain...");
      
      const tx = CertificateService.createIssueCertificateTx({
        adminCapId: adminCap.id,
        recipient: formData.recipient,
        certType: formData.certType,
        title: formData.title,
        description: formData.description,
        pinataCid: metadataResult.cid,
        ipfsUrl: metadataResult.url,
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: () => {
            toast.success("Certificate issued successfully! 🎉");
            queryClient.invalidateQueries({ queryKey: ["certificates"] });
            queryClient.invalidateQueries({ queryKey: ["issued-certificates"] });
            queryClient.invalidateQueries({ queryKey: ["adminCaps"] });
            onClose();
            resetForm();
          },
          onError: (error) => {
            console.error("Transaction error:", error);
            toast.error("Failed to issue certificate");
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to issue certificate");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const resetForm = () => {
    setFormData({
      recipient: "",
      title: "",
      description: "",
      certType: CERT_TYPES.COURSE,
      image: null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue New Certificate"
      description="Create and mint a new soulbound certificate on Sui blockchain"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Address */}
        <Input
          label="Recipient Address"
          placeholder="0x..."
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          required
          disabled={isSubmitting}
        />

        {/* Certificate Title */}
        <Input
          label="Certificate Title"
          placeholder="e.g., Sui Move Developer Bootcamp"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={isSubmitting}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Describe the achievement or course completion..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          disabled={isSubmitting}
        />

        {/* Certificate Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">
            Certificate Type
          </label>
          <select
            value={formData.certType}
            onChange={(e) => setFormData({ ...formData, certType: Number(e.target.value) })}
            className="w-full h-10 rounded-xl px-4 bg-slate-900/50 border-2 border-indigo-500/30 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all disabled:opacity-50"
            required
            disabled={isSubmitting}
          >
            {Object.entries(CERT_TYPE_NAMES).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">
            Certificate Image (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              disabled={isSubmitting}
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-500 bg-slate-900/30 cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-slate-400">
                {formData.image ? formData.image.name : "Click to upload image"}
              </span>
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-xl">
            <p className="text-sm text-indigo-300">{uploadProgress}</p>
          </div>
        )}

        {/* Form Actions */}
        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Issue Certificate
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
