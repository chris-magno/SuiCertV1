/// Events for SuiCert platform
/// Single Responsibility: Event emission and tracking
module suicert::events {
    use std::string::String;
    use sui::object::ID;
    use sui::event;

    // ===== Event Structs =====

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

    // ===== Event Emitters =====

    public(package) fun emit_platform_initialized(registry_id: ID, timestamp: u64) {
        event::emit(PlatformInitialized { registry_id, timestamp });
    }

    public(package) fun emit_admin_cap_issued(
        admin_cap_id: ID,
        institution_name: String,
        institution_address: address,
        timestamp: u64,
    ) {
        event::emit(AdminCapIssued {
            admin_cap_id,
            institution_name,
            institution_address,
            timestamp,
        });
    }

    public(package) fun emit_certificate_issued(
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
    ) {
        event::emit(CertificateIssued {
            certificate_id,
            owner,
            issuer,
            issuer_name,
            cert_type,
            title,
            pinata_cid,
            bounty,
            trust_rank,
            timestamp,
        });
    }

    public(package) fun emit_bounty_attached(
        certificate_id: ID,
        amount: u64,
        timestamp: u64,
    ) {
        event::emit(BountyAttached {
            certificate_id,
            amount,
            timestamp,
        });
    }

    public(package) fun emit_trust_rank_updated(
        profile_id: ID,
        owner: address,
        old_rank: u8,
        new_rank: u8,
        timestamp: u64,
    ) {
        event::emit(TrustRankUpdated {
            profile_id,
            owner,
            old_rank,
            new_rank,
            timestamp,
        });
    }

    public(package) fun emit_profile_created(
        profile_id: ID,
        owner: address,
        display_name: String,
        timestamp: u64,
    ) {
        event::emit(ProfileCreated {
            profile_id,
            owner,
            display_name,
            timestamp,
        });
    }
}
