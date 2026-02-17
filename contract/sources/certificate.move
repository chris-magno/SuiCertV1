/// SuiCert: The Internet of Verified Skills
/// 
/// A soulbound credential system that creates non-transferable certificates
/// as Sui Objects with IPFS metadata for 3D visual assets.
/// 
/// Key Features:
/// - Soulbound certificates (key ability only - cannot be transferred)
/// - AdminCap pattern for institutional issuance control
/// - Pinata CID integration for rich 3D metadata
/// - SUI bounty rewards attached to certificates
/// - TrustRank reputation system
#[allow(duplicate_alias, unused_const)]
module suicert::certificate {
    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use sui::clock::{Self, Clock};

    // ===== Error Codes =====
    const ENotAuthorized: u64 = 0;
    const EInvalidCertificateType: u64 = 1;
    const EInsufficientBounty: u64 = 2;
    const EInvalidMetadata: u64 = 3;
    const ECertificateNotFound: u64 = 4;
    const EInvalidTrustRank: u64 = 5;
    const ESoulboundTransferAttempt: u64 = 6;

    // ===== Constants =====
    const MIN_BOUNTY_AMOUNT: u64 = 1_000_000; // 0.001 SUI
    const MAX_CERTIFICATE_TYPES: u64 = 100;
    const MASTER_RANK_THRESHOLD: u64 = 10;

    // ===== Certificate Types =====
    const CERT_TYPE_COURSE: u8 = 1;
    const CERT_TYPE_DEGREE: u8 = 2;
    const CERT_TYPE_SKILL: u8 = 3;
    const CERT_TYPE_ACHIEVEMENT: u8 = 4;
    const CERT_TYPE_BOOTCAMP: u8 = 5;

    // ===== TrustRank Levels =====
    const RANK_NOVICE: u8 = 0;
    const RANK_INTERMEDIATE: u8 = 1;
    const RANK_ADVANCED: u8 = 2;
    const RANK_EXPERT: u8 = 3;
    const RANK_MASTER: u8 = 4;

    // ===== Structs =====

    /// One-time witness for module initialization
    public struct CERTIFICATE has drop {}

    /// Administrative capability for certificate issuance
    /// Only holders of this object can mint certificates
    public struct AdminCap has key, store {
        id: UID,
        institution_name: String,
        institution_address: address,
        total_issued: u64,
        authorized_types: vector<u8>, // Certificate types this admin can issue
    }

    /// Platform registry for managing all institutions and certificates
    public struct PlatformRegistry has key {
        id: UID,
        admin_caps_issued: u64,
        total_certificates: u64,
        institution_reputation: Table<address, u64>, // Institution address -> reputation score
        certificate_types: VecMap<u8, String>, // Type ID -> Type name
    }

    /// Soulbound Certificate - Non-transferable credential
    /// Uses only 'key' ability (no 'store') to prevent transfers
    public struct Certificate has key {
        id: UID,
        /// Recipient of the certificate
        owner: address,
        /// Issuing institution
        issuer: address,
        /// Institution name for display
        issuer_name: String,
        /// Certificate type (course, degree, skill, etc.)
        cert_type: u8,
        /// Certificate title/name
        title: String,
        /// Description of achievement
        description: String,
        /// Pinata CID for 3D asset and rich metadata
        pinata_cid: String,
        /// IPFS gateway URL (e.g., https://dedicated-gateway.pinata.cloud/ipfs/CID)
        ipfs_url: String,
        /// Issue timestamp
        issued_at: u64,
        /// Optional expiration timestamp (0 = never expires)
        expires_at: u64,
        /// TrustRank level of holder at issuance
        trust_rank: u8,
        /// Version for future upgrades
        version: u64,
        /// SUI bounty attached (if any)
        bounty: u64,
    }

    /// User Profile - Tracks reputation and certificate collection
    public struct UserProfile has key {
        id: UID,
        owner: address,
        display_name: String,
        /// Total certificates earned
        total_certificates: u64,
        /// Current TrustRank
        trust_rank: u8,
        /// Reputation score (calculated from institution reputation)
        reputation_score: u64,
        /// Certificate IDs owned by this user
        certificate_ids: vector<ID>,
        /// SuiNS name (optional)
        suins_name: String,
        /// Profile creation timestamp
        created_at: u64,
    }

    // ===== Events =====

    public struct PlatformInitialized has copy, drop {
        registry_id: ID,
        timestamp: u64,
    }

    public struct AdminCapIssued has copy, drop {
        admin_cap_id: ID,
        institution_name: String,
        institution_address: address,
        timestamp: u64,
    }

    public struct CertificateIssued has copy, drop {
        certificate_id: ID,
        owner: address,
        issuer: address,
        issuer_name: String,
        cert_type: u8,
        title: String,
        pinata_cid: String,
        bounty: u64,
        trust_rank: u8,
        timestamp: u64,
    }

    public struct BountyAttached has copy, drop {
        certificate_id: ID,
        amount: u64,
        timestamp: u64,
    }

    public struct TrustRankUpdated has copy, drop {
        profile_id: ID,
        owner: address,
        old_rank: u8,
        new_rank: u8,
        timestamp: u64,
    }

    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        display_name: String,
        timestamp: u64,
    }

    // ===== Initialization =====

    /// Initialize the platform - called once on module publish
    fun init(_witness: CERTIFICATE, ctx: &mut TxContext) {
        let mut registry = PlatformRegistry {
            id: object::new(ctx),
            admin_caps_issued: 0,
            total_certificates: 0,
            institution_reputation: table::new(ctx),
            certificate_types: vec_map::empty(),
        };

        let registry_id = object::uid_to_inner(&registry.id);

        // Initialize default certificate types
        vec_map::insert(&mut registry.certificate_types, CERT_TYPE_COURSE, string::utf8(b"Course Completion"));
        vec_map::insert(&mut registry.certificate_types, CERT_TYPE_DEGREE, string::utf8(b"Degree"));
        vec_map::insert(&mut registry.certificate_types, CERT_TYPE_SKILL, string::utf8(b"Skill Badge"));
        vec_map::insert(&mut registry.certificate_types, CERT_TYPE_ACHIEVEMENT, string::utf8(b"Achievement"));
        vec_map::insert(&mut registry.certificate_types, CERT_TYPE_BOOTCAMP, string::utf8(b"Bootcamp"));

        event::emit(PlatformInitialized {
            registry_id,
            timestamp: tx_context::epoch(ctx),
        });

        // Share the registry so anyone can read it
        transfer::share_object(registry);
    }

    // ===== Admin Functions =====

    /// Issue an AdminCap to an institution
    /// This should be called by the platform deployer initially
    /// In production, this would have additional governance controls
    public fun issue_admin_cap(
        registry: &mut PlatformRegistry,
        institution_name: vector<u8>,
        institution_address: address,
        authorized_types: vector<u8>,
        ctx: &mut TxContext
    ): AdminCap {
        // Validate certificate types
        let mut i = 0;
        let len = vector::length(&authorized_types);
        while (i < len) {
            let cert_type = *vector::borrow(&authorized_types, i);
            assert!(vec_map::contains(&registry.certificate_types, &cert_type), EInvalidCertificateType);
            i = i + 1;
        };

        let admin_cap = AdminCap {
            id: object::new(ctx),
            institution_name: string::utf8(institution_name),
            institution_address,
            total_issued: 0,
            authorized_types,
        };

        let admin_cap_id = object::uid_to_inner(&admin_cap.id);
        
        // Initialize reputation for new institution
        table::add(&mut registry.institution_reputation, institution_address, 100); // Start at 100
        registry.admin_caps_issued = registry.admin_caps_issued + 1;

        event::emit(AdminCapIssued {
            admin_cap_id,
            institution_name: admin_cap.institution_name,
            institution_address,
            timestamp: tx_context::epoch(ctx),
        });

        admin_cap
    }

    // ===== User Profile Functions =====

    /// Create a user profile
    public fun create_profile(
        display_name: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let profile = UserProfile {
            id: object::new(ctx),
            owner: sender,
            display_name: string::utf8(display_name),
            total_certificates: 0,
            trust_rank: RANK_NOVICE,
            reputation_score: 0,
            certificate_ids: vector::empty(),
            suins_name: string::utf8(b""),
            created_at: clock::timestamp_ms(clock),
        };

        let profile_id = object::uid_to_inner(&profile.id);

        event::emit(ProfileCreated {
            profile_id,
            owner: sender,
            display_name: profile.display_name,
            timestamp: clock::timestamp_ms(clock),
        });

        transfer::transfer(profile, sender);
    }

    /// Update SuiNS name in profile
    public fun update_suins_name(
        profile: &mut UserProfile,
        suins_name: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotAuthorized);
        profile.suins_name = string::utf8(suins_name);
    }

    // ===== Certificate Issuance Functions =====

    /// Issue a soulbound certificate (single)
    public fun issue_certificate(
        admin_cap: &mut AdminCap,
        registry: &mut PlatformRegistry,
        recipient: address,
        cert_type: u8,
        title: vector<u8>,
        description: vector<u8>,
        pinata_cid: vector<u8>,
        ipfs_url: vector<u8>,
        expires_at: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate admin is authorized for this certificate type
        assert!(vector::contains(&admin_cap.authorized_types, &cert_type), ENotAuthorized);
        
        // Validate metadata
        assert!(vector::length(&pinata_cid) > 0, EInvalidMetadata);
        assert!(vector::length(&ipfs_url) > 0, EInvalidMetadata);

        let certificate = Certificate {
            id: object::new(ctx),
            owner: recipient,
            issuer: admin_cap.institution_address,
            issuer_name: admin_cap.institution_name,
            cert_type,
            title: string::utf8(title),
            description: string::utf8(description),
            pinata_cid: string::utf8(pinata_cid),
            ipfs_url: string::utf8(ipfs_url),
            issued_at: clock::timestamp_ms(clock),
            expires_at,
            trust_rank: RANK_NOVICE, // Default rank
            version: 1,
            bounty: 0,
        };

        let certificate_id = object::uid_to_inner(&certificate.id);

        // Update metrics
        admin_cap.total_issued = admin_cap.total_issued + 1;
        registry.total_certificates = registry.total_certificates + 1;

        event::emit(CertificateIssued {
            certificate_id,
            owner: recipient,
            issuer: admin_cap.institution_address,
            issuer_name: admin_cap.institution_name,
            cert_type,
            title: certificate.title,
            pinata_cid: certificate.pinata_cid,
            bounty: 0,
            trust_rank: certificate.trust_rank,
            timestamp: clock::timestamp_ms(clock),
        });

        // Transfer certificate to recipient (soulbound - cannot be re-transferred)
        transfer::transfer(certificate, recipient);
    }

    /// Batch issue certificates (up to 1000 as per PTB limit)
    /// This is gas-efficient for institutional bulk issuance
    public fun batch_issue_certificates(
        admin_cap: &mut AdminCap,
        registry: &mut PlatformRegistry,
        recipients: vector<address>,
        cert_type: u8,
        title: vector<u8>,
        description: vector<u8>,
        pinata_cid: vector<u8>,
        ipfs_url: vector<u8>,
        expires_at: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate admin is authorized
        assert!(vector::contains(&admin_cap.authorized_types, &cert_type), ENotAuthorized);
        assert!(vector::length(&pinata_cid) > 0, EInvalidMetadata);

        let mut i = 0;
        let len = vector::length(&recipients);
        
        while (i < len) {
            let recipient = *vector::borrow(&recipients, i);
            
            let certificate = Certificate {
                id: object::new(ctx),
                owner: recipient,
                issuer: admin_cap.institution_address,
                issuer_name: admin_cap.institution_name,
                cert_type,
                title: string::utf8(title),
                description: string::utf8(description),
                pinata_cid: string::utf8(pinata_cid),
                ipfs_url: string::utf8(ipfs_url),
                issued_at: clock::timestamp_ms(clock),
                expires_at,
                trust_rank: RANK_NOVICE,
                version: 1,
                bounty: 0,
            };

            let certificate_id = object::uid_to_inner(&certificate.id);

            event::emit(CertificateIssued {
                certificate_id,
                owner: recipient,
                issuer: admin_cap.institution_address,
                issuer_name: admin_cap.institution_name,
                cert_type,
                title: certificate.title,
                pinata_cid: certificate.pinata_cid,
                bounty: 0,
                trust_rank: certificate.trust_rank,
                timestamp: clock::timestamp_ms(clock),
            });

            transfer::transfer(certificate, recipient);
            
            i = i + 1;
        };

        // Update metrics
        admin_cap.total_issued = admin_cap.total_issued + len;
        registry.total_certificates = registry.total_certificates + len;
    }

    /// Attach SUI bounty to a certificate as a reward
    public fun attach_bounty(
        certificate: &mut Certificate,
        bounty_coin: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Only issuer can attach bounty
        assert!(certificate.issuer == tx_context::sender(ctx), ENotAuthorized);
        
        let bounty_amount = coin::value(&bounty_coin);
        assert!(bounty_amount >= MIN_BOUNTY_AMOUNT, EInsufficientBounty);

        // In a real implementation, we'd store the coin object
        // For simplicity, we're tracking the amount
        certificate.bounty = certificate.bounty + bounty_amount;

        event::emit(BountyAttached {
            certificate_id: object::uid_to_inner(&certificate.id),
            amount: bounty_amount,
            timestamp: clock::timestamp_ms(clock),
        });

        // Transfer coin to certificate owner
        transfer::public_transfer(bounty_coin, certificate.owner);
    }

    /// Update user's TrustRank based on certificate collection
    public fun update_trust_rank(
        profile: &mut UserProfile,
        _registry: &PlatformRegistry,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotAuthorized);

        let old_rank = profile.trust_rank;
        let cert_count = profile.total_certificates;

        // Calculate new rank based on certificate count
        let new_rank = if (cert_count >= 50) {
            RANK_MASTER
        } else if (cert_count >= 25) {
            RANK_EXPERT
        } else if (cert_count >= 10) {
            RANK_ADVANCED
        } else if (cert_count >= 3) {
            RANK_INTERMEDIATE
        } else {
            RANK_NOVICE
        };

        if (new_rank != old_rank) {
            profile.trust_rank = new_rank;

            event::emit(TrustRankUpdated {
                profile_id: object::uid_to_inner(&profile.id),
                owner: profile.owner,
                old_rank,
                new_rank,
                timestamp: tx_context::epoch(ctx),
            });
        };
    }

    // ===== View Functions =====

    /// Get certificate details
    public fun get_certificate_info(cert: &Certificate): (
        address, // owner
        address, // issuer
        String,  // title
        String,  // pinata_cid
        u8,      // cert_type
        u64,     // issued_at
        u8       // trust_rank
    ) {
        (
            cert.owner,
            cert.issuer,
            cert.title,
            cert.pinata_cid,
            cert.cert_type,
            cert.issued_at,
            cert.trust_rank
        )
    }

    /// Get user profile details
    public fun get_profile_info(profile: &UserProfile): (
        address, // owner
        String,  // display_name
        u64,     // total_certificates
        u8,      // trust_rank
        u64      // reputation_score
    ) {
        (
            profile.owner,
            profile.display_name,
            profile.total_certificates,
            profile.trust_rank,
            profile.reputation_score
        )
    }

    /// Check if certificate is valid (not expired)
    public fun is_certificate_valid(cert: &Certificate, current_time: u64): bool {
        cert.expires_at == 0 || current_time < cert.expires_at
    }

    /// Get institution reputation
    public fun get_institution_reputation(
        registry: &PlatformRegistry,
        institution: address
    ): u64 {
        if (table::contains(&registry.institution_reputation, institution)) {
            *table::borrow(&registry.institution_reputation, institution)
        } else {
            0
        }
    }

    // ===== Test-Only Functions =====

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(CERTIFICATE {}, ctx);
    }

    #[test_only]
    public fun get_certificate_owner(cert: &Certificate): address {
        cert.owner
    }

    #[test_only]
    public fun get_certificate_bounty(cert: &Certificate): u64 {
        cert.bounty
    }
}
