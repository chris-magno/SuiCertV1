"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { Certificate, UserProfile } from "@/lib/types";
import { PACKAGE_ID } from "@/lib/constants";

export function useCertificates() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  return useQuery({
    queryKey: ["certificates", account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      try {
        // Fetch all objects owned by the user
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          options: {
            showContent: true,
            showType: true,
          },
        });

        // Filter and parse Certificate objects
        const certificates: Certificate[] = [];
        
        for (const obj of ownedObjects.data) {
          const data = obj.data;
          // Check if this is a Certificate object from our package
          if (data?.type && data.type.includes("certificate::Certificate")) {
            const content = data.content as any;
            if (content?.fields) {
              const fields = content.fields;
              certificates.push({
                id: fields.id?.id || obj.data?.objectId || "",
                owner: fields.owner || account.address,
                issuer: fields.issuer || "",
                issuerName: fields.issuer_name || "Unknown Institution",
                certType: parseInt(fields.cert_type) || 1,
                title: fields.title || "Untitled Certificate",
                description: fields.description || "",
                pinataCid: fields.pinata_cid || "",
                ipfsUrl: fields.ipfs_url || "",
                issuedAt: parseInt(fields.issued_at) || Date.now(),
                expiresAt: parseInt(fields.expires_at) || 0,
                trustRank: parseInt(fields.trust_rank) || 0,
                bountyAmount: fields.bounty_amount ? parseInt(fields.bounty_amount) : undefined,
              });
            }
          }
        }

        console.log(`Found ${certificates.length} certificates for ${account.address}`);
        return certificates;
      } catch (error) {
        console.error("Error fetching certificates:", error);
        return [];
      }
    },
    enabled: !!account?.address,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useUserProfile() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  return useQuery({
    queryKey: ["userProfile", account?.address],
    queryFn: async () => {
      if (!account?.address) return null;

      try {
        // Fetch all objects owned by the user
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          options: {
            showContent: true,
            showType: true,
          },
        });

        // Find UserProfile object
        for (const obj of ownedObjects.data) {
          const data = obj.data;
          if (data?.type && data.type.includes("certificate::UserProfile")) {
            const content = data.content as any;
            if (content?.fields) {
              const fields = content.fields;
              return {
                id: fields.id?.id || obj.data?.objectId || "",
                owner: fields.owner || account.address,
                displayName: fields.display_name || "Anonymous",
                totalCerts: parseInt(fields.total_certs) || 0,
                trustRank: parseInt(fields.trust_rank) || 0,
                reputation: parseInt(fields.reputation) || 0,
                joinedAt: parseInt(fields.joined_at) || Date.now(),
              } as UserProfile;
            }
          }
        }

        return null;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    enabled: !!account?.address,
    refetchInterval: 10000,
  });
}

export function useAdminCaps() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  return useQuery({
    queryKey: ["adminCaps", account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      try {
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          options: {
            showContent: true,
            showType: true,
          },
        });

        const adminCaps: any[] = [];

        for (const obj of ownedObjects.data) {
          const data = obj.data;
          if (data?.type && data.type.includes("certificate::AdminCap")) {
            const content = data.content as any;
            if (content?.fields) {
              adminCaps.push({
                id: content.fields.id?.id || obj.data?.objectId || "",
                institutionName: content.fields.institution_name || "",
                institutionAddress: content.fields.institution_address || "",
                totalIssued: parseInt(content.fields.total_issued) || 0,
                authorizedTypes: content.fields.authorized_types || [],
              });
            }
          }
        }

        return adminCaps;
      } catch (error) {
        console.error("Error fetching admin caps:", error);
        return [];
      }
    },
    enabled: !!account?.address,
    refetchInterval: 10000,
  });
}
