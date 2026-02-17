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
                id: obj.data?.objectId || fields.id?.id || "",
                owner: fields.owner || account.address,
                issuer: fields.issuer || "",
                issuerName: fields.issuer_name || "Unknown Institution",
                certType: parseInt(fields.cert_type) || 1,
                title: fields.title || "Untitled Certificate",
                description: fields.description || "",
                pinataCid: fields.pinata_cid || "",
                ipfsUrl: fields.ipfs_url || "",
                issuedAt: parseInt(fields.issued_at) || 0,
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
                id: obj.data?.objectId || fields.id?.id || "",
                owner: fields.owner || account.address,
                displayName: fields.display_name || "Anonymous",
                totalCerts: parseInt(fields.total_certificates) || 0,
                trustRank: parseInt(fields.trust_rank) || 0,
                reputation: parseInt(fields.reputation_score) || 0,
                joinedAt: parseInt(fields.created_at) || 0,
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
                id: obj.data?.objectId || content.fields.id?.id || "",
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
    refetchInterval: 5000, // Refetch every 5 seconds for quick updates
  });
}

export function useIssuedCertificates() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { data: adminCaps = [] } = useAdminCaps();

  return useQuery({
    queryKey: ["issuedCertificates", account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      try {
        console.log("=== Fetching issued certificates ===");
        console.log("Your wallet address:", account.address);
        console.log("AdminCap institution address:", adminCaps[0]?.institutionAddress);
        console.log("Package ID:", PACKAGE_ID);
        
        const issuedCertificates: Certificate[] = [];
        const seenIds = new Set<string>();
        
        if (!PACKAGE_ID || PACKAGE_ID === "0x0" || PACKAGE_ID === "") {
          console.error("PACKAGE_ID not configured!");
          return [];
        }

        // Get the institution address from AdminCap (this is what's used as issuer)
        const institutionAddress = adminCaps[0]?.institutionAddress || account.address;
        console.log("Searching for certificates issued by:", institutionAddress);

        // Strategy 1: Try event-based approach
        try {
          const response = await client.queryEvents({
            query: {
              MoveEventType: `${PACKAGE_ID}::certificate::CertificateIssued`,
            },
            limit: 50,
            order: 'descending',
          });

          console.log(`Found ${response.data.length} total CertificateIssued events`);

          // Process each event
          for (const event of response.data) {
            const parsedJson = event.parsedJson as any;
            
            console.log("Event:", {
              certId: parsedJson.certificate_id,
              eventIssuer: parsedJson.issuer,
              title: parsedJson.title,
              owner: parsedJson.owner,
            });
            
            // Match against both wallet address AND institution address
            const isMatch = parsedJson.issuer === account.address || 
                           parsedJson.issuer === institutionAddress;
            
            console.log(`Match? ${isMatch} (event issuer: ${parsedJson.issuer})`);
            
            if (isMatch && !seenIds.has(parsedJson.certificate_id)) {
              try {
                const certId = parsedJson.certificate_id;
                seenIds.add(certId);
                
                // Fetch the full certificate object
                const certObject = await client.getObject({
                  id: certId,
                  options: {
                    showContent: true,
                    showType: true,
                  },
                });

                if (certObject?.data?.content) {
                  const content = certObject.data.content as any;
                  const fields = content.fields;
                  
                  console.log("✓ Added certificate:", fields.title || parsedJson.title);
                  
                  issuedCertificates.push({
                    id: certId,
                    owner: fields.owner || parsedJson.owner || "",
                    issuer: fields.issuer || parsedJson.issuer || account.address,
                    issuerName: fields.issuer_name || parsedJson.issuer_name || "Unknown Institution",
                    certType: parseInt(fields.cert_type || parsedJson.cert_type) || 1,
                    title: fields.title || parsedJson.title || "Untitled Certificate",
                    description: fields.description || "",
                    pinataCid: fields.pinata_cid || parsedJson.pinata_cid || "",
                    ipfsUrl: fields.ipfs_url || "",
                    issuedAt: parseInt(fields.issued_at || parsedJson.timestamp) || 0,
                    expiresAt: parseInt(fields.expires_at) || 0,
                    trustRank: parseInt(fields.trust_rank || parsedJson.trust_rank) || 0,
                    bountyAmount: fields.bounty ? parseInt(fields.bounty) : (parsedJson.bounty ? parseInt(parsedJson.bounty) : undefined),
                  });
                } else {
                  console.warn("Certificate object not found or invalid:", certId);
                }
              } catch (err) {
                console.error("Error fetching certificate:", parsedJson.certificate_id, err);
              }
            }
          }
        } catch (eventError) {
          console.error("Event query failed:", eventError);
        }

        // Strategy 2: Fallback - Query transaction history if no events found
        if (issuedCertificates.length === 0) {
          console.log("No events found, trying transaction history...");
          
          try {
            // Get recent transactions from this account
            const txs = await client.queryTransactionBlocks({
              filter: {
                FromAddress: account.address,
              },
              limit: 20,
              order: 'descending',
              options: {
                showEffects: true,
                showEvents: true,
                showInput: true,
              },
            });

            console.log(`Found ${txs.data.length} recent transactions`);

            for (const tx of txs.data) {
              // Look for CertificateIssued events in the transaction
              if (tx.events) {
                for (const event of tx.events) {
                  if (event.type.includes('certificate::CertificateIssued')) {
                    const parsedJson = event.parsedJson as any;
                    const certId = parsedJson.certificate_id;
                    
                    console.log("Found certificate in transaction:", certId);
                    
                    if (!seenIds.has(certId)) {
                      seenIds.add(certId);
                      
                      try {
                        const certObject = await client.getObject({
                          id: certId,
                          options: {
                            showContent: true,
                            showType: true,
                          },
                        });

                        if (certObject?.data?.content) {
                          const content = certObject.data.content as any;
                          const fields = content.fields;
                          
                          console.log("✓ Added certificate from transaction:", fields.title);
                          
                          issuedCertificates.push({
                            id: certId,
                            owner: fields.owner || parsedJson.owner || "",
                            issuer: fields.issuer || parsedJson.issuer || account.address,
                            issuerName: fields.issuer_name || parsedJson.issuer_name || "Unknown Institution",
                            certType: parseInt(fields.cert_type || parsedJson.cert_type) || 1,
                            title: fields.title || parsedJson.title || "Untitled Certificate",
                            description: fields.description || "",
                            pinataCid: fields.pinata_cid || parsedJson.pinata_cid || "",
                            ipfsUrl: fields.ipfs_url || "",
                            issuedAt: parseInt(fields.issued_at || parsedJson.timestamp) || 0,
                            expiresAt: parseInt(fields.expires_at) || 0,
                            trustRank: parseInt(fields.trust_rank || parsedJson.trust_rank) || 0,
                            bountyAmount: fields.bounty ? parseInt(fields.bounty) : undefined,
                          });
                        }
                      } catch (err) {
                        console.error("Error fetching certificate from tx:", err);
                      }
                    }
                  }
                }
              }
            }
          } catch (txError) {
            console.error("Transaction history query failed:", txError);
          }
        }

        console.log(`=== Total issued certificates: ${issuedCertificates.length} ===`);
        return issuedCertificates;
      } catch (error) {
        console.error("Error fetching issued certificates:", error);
        return [];
      }
    },
    enabled: !!account?.address,
    refetchInterval: 5000,
    retry: 2,
  });
}

export function useVerifyCertificate(certificateId: string | null) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["verifyCertificate", certificateId],
    queryFn: async () => {
      if (!certificateId || certificateId.trim() === "") {
        return null;
      }

      try {
        // Validate Sui Object ID format
        const trimmedId = certificateId.trim();
        
        // Basic validation: should start with 0x and be a valid hex string
        // Sui object IDs are typically 66 characters (0x + 64 hex chars) but can vary
        if (!trimmedId.startsWith("0x")) {
          return { isValid: false, error: "Invalid certificate ID format. Must start with '0x'" };
        }
        
        if (trimmedId.length < 10) {
          return { isValid: false, error: "Invalid certificate ID format. ID too short" };
        }

        // Check if it's a valid hex string after 0x
        const hexPart = trimmedId.slice(2);
        if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
          return { isValid: false, error: "Invalid certificate ID format. Must contain only hexadecimal characters" };
        }

        // Fetch the object from the blockchain
        const objectData = await client.getObject({
          id: trimmedId,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
          },
        });

        // Check if object exists
        if (!objectData || !objectData.data) {
          return { isValid: false, error: "Certificate not found on blockchain" };
        }

        const data = objectData.data;

        // Check if it's a Certificate object
        if (!data.type || !data.type.includes("certificate::Certificate")) {
          return { isValid: false, error: "Object is not a valid SuiCert certificate" };
        }

        // Parse certificate data
        const content = data.content as any;
        if (!content?.fields) {
          return { isValid: false, error: "Invalid certificate data structure" };
        }

        const fields = content.fields;
        const certificate: Certificate = {
          id: trimmedId, // Use the object ID that was used for verification
          owner: fields.owner || "",
          issuer: fields.issuer || "",
          issuerName: fields.issuer_name || "Unknown Institution",
          certType: parseInt(fields.cert_type) || 1,
          title: fields.title || "Untitled Certificate",
          description: fields.description || "",
          pinataCid: fields.pinata_cid || "",
          ipfsUrl: fields.ipfs_url || "",
          issuedAt: parseInt(fields.issued_at) || 0,
          expiresAt: parseInt(fields.expires_at) || 0,
          trustRank: parseInt(fields.trust_rank) || 0,
          bountyAmount: fields.bounty_amount ? parseInt(fields.bounty_amount) : undefined,
        };

        // Check if certificate is expired
        const now = Date.now();
        const isExpired = certificate.expiresAt > 0 && certificate.expiresAt < now;

        return {
          isValid: true,
          certificate,
          isExpired,
          error: null,
        };
      } catch (error: any) {
        console.error("Error verifying certificate:", error);
        
        // Handle specific error types
        if (error.message?.includes("Invalid Sui Object id") || error.message?.includes("invalid object id")) {
          return {
            isValid: false,
            error: "Invalid certificate ID format. Please check the ID and try again.",
          };
        }
        
        return {
          isValid: false,
          error: error.message || "Failed to verify certificate",
        };
      }
    },
    enabled: !!certificateId && certificateId.trim() !== "",
    retry: false, // Don't retry on failure
  });
}
