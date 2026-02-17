"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { Certificate, UserProfile } from "@/lib/types";

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
          if (data?.type && data.type.includes("::certificate::Certificate")) {
            const content = data.content as any;
            if (content?.fields) {
              certificates.push({
                id: content.fields.id?.id || obj.data?.objectId || "",
                owner: content.fields.owner || "",
                issuer: content.fields.issuer || "",
                issuerName: content.fields.issuer_name || "",
                certType: parseInt(content.fields.cert_type) || 1,
                title: content.fields.title || "",
                description: content.fields.description || "",
                pinataCid: content.fields.pinata_cid || "",
                ipfsUrl: content.fields.ipfs_url || "",
                issuedAt: parseInt(content.fields.issued_at) || Date.now(),
                expiresAt: parseInt(content.fields.expires_at) || 0,
                trustRank: parseInt(content.fields.trust_rank) || 0,
                bountyAmount: content.fields.bounty_amount ? parseInt(content.fields.bounty_amount) : undefined,
              });
            }
          }
        }

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
          if (data?.type && data.type.includes("::certificate::UserProfile")) {
            const content = data.content as any;
            if (content?.fields) {
              return {
                id: content.fields.id?.id || obj.data?.objectId || "",
                owner: content.fields.owner || "",
                displayName: content.fields.display_name || "",
                totalCerts: parseInt(content.fields.total_certs) || 0,
                trustRank: parseInt(content.fields.trust_rank) || 0,
                reputation: parseInt(content.fields.reputation) || 0,
                joinedAt: parseInt(content.fields.joined_at) || Date.now(),
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
