/// Core data types for SuiCert platform
/// Single Responsibility: Type definitions and data structures
module suicert::types {
    use std::string::String;
    use sui::object::{UID, ID};
    use sui::table::Table;
    use sui::vec_map::VecMap;

    // ===== Administrative Capability =====
    
    /// Administrative capability for certificate issuance
    /// Only holders of this object can mint certificates
    public struct AdminCap has key, store {
        id: UID,
        institution_name: String,
        institution_address: address,
        total_issued: u64,
        authorized_types: vector<u8>,
    }

    // ===== Platform Registry =====
    
    /// Platform registry for managing all institutions and certificates
    public struct PlatformRegistry has key {
        id: UID,
        admin_caps_issued: u64,
        total_certificates: u64,
        institution_reputation: Table<address, u64>,
        certificate_types: VecMap<u8, String>,
    }

    // ===== Soulbound Certificate =====
    
    /// Soulbound Certificate - Non-transferable credential
    /// Uses only 'key' ability (no 'store') to prevent transfers
    public struct Certificate has key {
        id: UID,
        owner: address,
        issuer: address,
        issuer_name: String,
        cert_type: u8,
        title: String,
        description: String,
        pinata_cid: String,
        ipfs_url: String,
        issued_at: u64,
        expires_at: u64,
        trust_rank: u8,
        version: u64,
        bounty: u64,
    }

    // ===== User Profile =====
    
    /// User Profile - Tracks reputation and certificate collection
    public struct UserProfile has key {
        id: UID,
        owner: address,
        display_name: String,
        total_certificates: u64,
        trust_rank: u8,
        reputation_score: u64,
        certificate_ids: vector<ID>,
        suins_name: String,
        created_at: u64,
    }

    // ===== Accessors for AdminCap =====
    
    public fun admin_cap_id(cap: &AdminCap): &UID { &cap.id }
    public fun admin_cap_institution_name(cap: &AdminCap): &String { &cap.institution_name }
    public fun admin_cap_institution_address(cap: &AdminCap): address { cap.institution_address }
    public fun admin_cap_total_issued(cap: &AdminCap): u64 { cap.total_issued }
    public fun admin_cap_authorized_types(cap: &AdminCap): &vector<u8> { &cap.authorized_types }
    
    public(package) fun admin_cap_increment_issued(cap: &mut AdminCap) {
        cap.total_issued = cap.total_issued + 1;
    }

    // ===== Accessors for Certificate =====
    
    public fun certificate_owner(cert: &Certificate): address { cert.owner }
    public fun certificate_issuer(cert: &Certificate): address { cert.issuer }
    public fun certificate_issuer_name(cert: &Certificate): &String { &cert.issuer_name }
    public fun certificate_type(cert: &Certificate): u8 { cert.cert_type }
    public fun certificate_title(cert: &Certificate): &String { &cert.title }
    public fun certificate_description(cert: &Certificate): &String { &cert.description }
    public fun certificate_pinata_cid(cert: &Certificate): &String { &cert.pinata_cid }
    public fun certificate_ipfs_url(cert: &Certificate): &String { &cert.ipfs_url }
    public fun certificate_issued_at(cert: &Certificate): u64 { cert.issued_at }
    public fun certificate_expires_at(cert: &Certificate): u64 { cert.expires_at }
    public fun certificate_trust_rank(cert: &Certificate): u8 { cert.trust_rank }
    public fun certificate_bounty(cert: &Certificate): u64 { cert.bounty }

    // ===== Accessors for UserProfile =====
    
    public fun profile_owner(profile: &UserProfile): address { profile.owner }
    public fun profile_display_name(profile: &UserProfile): &String { &profile.display_name }
    public fun profile_total_certificates(profile: &UserProfile): u64 { profile.total_certificates }
    public fun profile_trust_rank(profile: &UserProfile): u8 { profile.trust_rank }
    public fun profile_reputation_score(profile: &UserProfile): u64 { profile.reputation_score }
    public fun profile_created_at(profile: &UserProfile): u64 { profile.created_at }

    // ===== Accessors for Registry =====
    
    public fun registry_total_certificates(registry: &PlatformRegistry): u64 {
        registry.total_certificates
    }
    
    public fun registry_admin_caps_issued(registry: &PlatformRegistry): u64 {
        registry.admin_caps_issued
    }

    // ===== Package-internal constructors =====
    
    public(package) fun new_admin_cap(
        id: UID,
        institution_name: String,
        institution_address: address,
        authorized_types: vector<u8>,
    ): AdminCap {
        AdminCap {
            id,
            institution_name,
            institution_address,
            total_issued: 0,
            authorized_types,
        }
    }

    public(package) fun new_certificate(
        id: UID,
        owner: address,
        issuer: address,
        issuer_name: String,
        cert_type: u8,
        title: String,
        description: String,
        pinata_cid: String,
        ipfs_url: String,
        issued_at: u64,
        expires_at: u64,
        trust_rank: u8,
        version: u64,
        bounty: u64,
    ): Certificate {
        Certificate {
            id,
            owner,
            issuer,
            issuer_name,
            cert_type,
            title,
            description,
            pinata_cid,
            ipfs_url,
            issued_at,
            expires_at,
            trust_rank,
            version,
            bounty,
        }
    }

    public(package) fun new_user_profile(
        id: UID,
        owner: address,
        display_name: String,
        created_at: u64,
    ): UserProfile {
        UserProfile {
            id,
            owner,
            display_name,
            total_certificates: 0,
            trust_rank: suicert::constants::rank_novice(),
            reputation_score: 0,
            certificate_ids: vector::empty(),
            suins_name: std::string::utf8(b""),
            created_at,
        }
    }

    public(package) fun new_platform_registry(
        id: UID,
        institution_reputation: Table<address, u64>,
        certificate_types: VecMap<u8, String>,
    ): PlatformRegistry {
        PlatformRegistry {
            id,
            admin_caps_issued: 0,
            total_certificates: 0,
            institution_reputation,
            certificate_types,
        }
    }

    // ===== Mutators (package-internal) =====
    
    public(package) fun registry_increment_admin_caps(registry: &mut PlatformRegistry) {
        registry.admin_caps_issued = registry.admin_caps_issued + 1;
    }

    public(package) fun registry_increment_certificates(registry: &mut PlatformRegistry) {
        registry.total_certificates = registry.total_certificates + 1;
    }

    public(package) fun registry_institution_reputation_mut(
        registry: &mut PlatformRegistry
    ): &mut Table<address, u64> {
        &mut registry.institution_reputation
    }

    public(package) fun registry_certificate_types(
        registry: &PlatformRegistry
    ): &VecMap<u8, String> {
        &registry.certificate_types
    }

    public(package) fun registry_certificate_types_mut(
        registry: &mut PlatformRegistry
    ): &mut VecMap<u8, String> {
        &mut registry.certificate_types
    }

    public(package) fun profile_add_certificate(profile: &mut UserProfile, cert_id: ID) {
        vector::push_back(&mut profile.certificate_ids, cert_id);
        profile.total_certificates = profile.total_certificates + 1;
    }

    public(package) fun profile_update_trust_rank(profile: &mut UserProfile, new_rank: u8) {
        profile.trust_rank = new_rank;
    }

    public(package) fun profile_update_reputation(profile: &mut UserProfile, score: u64) {
        profile.reputation_score = score;
    }

    public(package) fun certificate_add_bounty(cert: &mut Certificate, amount: u64) {
        cert.bounty = cert.bounty + amount;
    }
}
