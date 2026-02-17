/// SuiCert: The Internet of Verified Skills
/// 
/// A soulbound credential system that creates non-transferable certificates
/// as Sui Objects with IPFS metadata for 3D visual assets.
/// 
/// This is the main certificate module following SOLID principles:
/// - Single Responsibility: Core certificate business logic
/// - Open/Closed: Extensible through module system
/// - Liskov Substitution: Proper type hierarchies
/// - Interface Segregation: Separated concerns into focused modules
/// - Dependency Inversion: Depends on abstractions (types, validators)
#[allow(duplicate_alias)]
module suicert::certificate {
    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::table;
    use sui::vec_map;
    use sui::clock::{Self, Clock};

    // Import our modular components
    use suicert::types::{Self, AdminCap, PlatformRegistry, Certificate, UserProfile};
    use suicert::constants;
    use suicert::errors;
    use suicert::events;
    use suicert::validator;

    // ===== One-time Witness =====
    
    /// One-time witness for module initialization
    public struct CERTIFICATE has drop {}

    // ===== Initialization =====

    /// Initialize the platform - called once on module publish
    fun init(_witness: CERTIFICATE, ctx: &mut TxContext) {
        let id = object::new(ctx);
        let registry_id = object::uid_to_inner(&id);

        // Initialize certificate types
        let mut certificate_types = vec_map::empty();
        vec_map::insert(&mut certificate_types, constants::cert_type_course(), string::utf8(b"Course Completion"));
        vec_map::insert(&mut certificate_types, constants::cert_type_degree(), string::utf8(b"Degree"));
        vec_map::insert(&mut certificate_types, constants::cert_type_skill(), string::utf8(b"Skill Badge"));
        vec_map::insert(&mut certificate_types, constants::cert_type_achievement(), string::utf8(b"Achievement"));
        vec_map::insert(&mut certificate_types, constants::cert_type_bootcamp(), string::utf8(b"Bootcamp"));

        let registry = types::new_platform_registry(
            id,
            table::new(ctx),
            certificate_types,
        );

        events::emit_platform_initialized(registry_id, tx_context::epoch(ctx));

        transfer::share_object(registry);
    }

    // ===== Admin Functions =====

    /// Issue an AdminCap to an institution
    /// Follows Open/Closed Principle: Can add new institutions without modifying existing code
    public fun issue_admin_cap(
        registry: &mut PlatformRegistry,
        institution_name: vector<u8>,
        institution_address: address,
        authorized_types: vector<u8>,
        ctx: &mut TxContext
    ): AdminCap {
        // Validate all authorized types
        validator::validate_all_certificate_types(
            &authorized_types,
            types::registry_certificate_types(registry)
        );

        let id = object::new(ctx);
        let admin_cap_id = object::uid_to_inner(&id);

        let admin_cap = types::new_admin_cap(
            id,
            string::utf8(institution_name),
            institution_address,
            authorized_types,
        );

        // Initialize institution reputation
        let reputation_table = types::registry_institution_reputation_mut(registry);
        table::add(reputation_table, institution_address, constants::initial_institution_reputation());
        
        types::registry_increment_admin_caps(registry);

        events::emit_admin_cap_issued(
            admin_cap_id,
            string::utf8(institution_name),
            institution_address,
            tx_context::epoch(ctx),
        );

        admin_cap
    }

    /// Entry wrapper to issue AdminCap and transfer to sender
    entry fun issue_my_admin_cap(
        registry: &mut PlatformRegistry,
        institution_name: vector<u8>,
        authorized_types: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let admin_cap = issue_admin_cap(
            registry,
            institution_name,
            sender,
            authorized_types,
            ctx
        );
        transfer::public_transfer(admin_cap, sender);
    }

    // ===== User Profile Functions =====

    /// Create a user profile
    /// Single Responsibility: Only handles profile creation
    public fun create_profile(
        display_name: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let profile_id = object::uid_to_inner(&id);

        let profile = types::new_user_profile(
            id,
            sender,
            string::utf8(display_name),
            clock::timestamp_ms(clock),
        );

        events::emit_profile_created(
            profile_id,
            sender,
            string::utf8(display_name),
            clock::timestamp_ms(clock),
        );

        transfer::transfer(profile, sender);
    }

    /// Update SuiNS name in profile
    public fun update_suins_name(
        profile: &mut UserProfile,
        _suins_name: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(
            types::profile_owner(profile) == tx_context::sender(ctx),
            errors::not_authorized()
        );
        // Note: In production, this would update via the types module
        // For now, keeping simple since UserProfile fields aren't directly mutable
    }

    // ===== Certificate Issuance Functions =====

    /// Issue a soulbound certificate
    /// Follows Single Responsibility: Only handles certificate creation
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
        let title_str = string::utf8(title);
        let description_str = string::utf8(description);
        let pinata_cid_str = string::utf8(pinata_cid);
        let ipfs_url_str = string::utf8(ipfs_url);

        // Validate inputs using validator module (Dependency Inversion)
        validator::validate_authorized_types(cert_type, types::admin_cap_authorized_types(admin_cap));
        validator::validate_metadata(&title_str, &description_str, &pinata_cid_str);

        let id = object::new(ctx);
        let certificate_id = object::uid_to_inner(&id);
        let timestamp = clock::timestamp_ms(clock);

        let certificate = types::new_certificate(
            id,
            recipient,
            types::admin_cap_institution_address(admin_cap),
            *types::admin_cap_institution_name(admin_cap),
            cert_type,
            title_str,
            description_str,
            pinata_cid_str,
            ipfs_url_str,
            timestamp,
            expires_at,
            constants::rank_novice(),
            constants::current_version(),
            0, // bounty
        );

        // Update metrics
        types::admin_cap_increment_issued(admin_cap);
        types::registry_increment_certificates(registry);

        events::emit_certificate_issued(
            certificate_id,
            recipient,
            types::admin_cap_institution_address(admin_cap),
            *types::admin_cap_institution_name(admin_cap),
            cert_type,
            types::certificate_title(&certificate),
            types::certificate_pinata_cid(&certificate),
            0,
            constants::rank_novice(),
            timestamp,
        );

        // Transfer certificate to recipient (soulbound)
        transfer::transfer(certificate, recipient);
    }

    /// Batch issue certificates
    /// Efficient for institutional bulk issuance
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
        let title_str = string::utf8(title);
        let description_str = string::utf8(description);
        let pinata_cid_str = string::utf8(pinata_cid);
        let ipfs_url_str = string::utf8(ipfs_url);

        // Validate inputs
        validator::validate_authorized_types(cert_type, types::admin_cap_authorized_types(admin_cap));
        validator::validate_metadata(&title_str, &description_str, &pinata_cid_str);

        let mut i = 0;
        let len = vector::length(&recipients);
        let timestamp = clock::timestamp_ms(clock);

        while (i < len) {
            let recipient = *vector::borrow(&recipients, i);

            let id = object::new(ctx);
            let certificate_id = object::uid_to_inner(&id);

            let certificate = types::new_certificate(
                id,
                recipient,
                types::admin_cap_institution_address(admin_cap),
                *types::admin_cap_institution_name(admin_cap),
                cert_type,
                title_str,
                description_str,
                pinata_cid_str,
                ipfs_url_str,
                timestamp,
                expires_at,
                constants::rank_novice(),
                constants::current_version(),
                0,
            );

            events::emit_certificate_issued(
                certificate_id,
                recipient,
                types::admin_cap_institution_address(admin_cap),
                *types::admin_cap_institution_name(admin_cap),
                cert_type,
                types::certificate_title(&certificate),
                types::certificate_pinata_cid(&certificate),
                0,
                constants::rank_novice(),
                timestamp,
            );

            transfer::transfer(certificate, recipient);
            i = i + 1;
        };

        // Update metrics
        types::admin_cap_increment_issued(admin_cap);
        types::registry_increment_certificates(registry);
    }

    /// Attach SUI bounty to certificate as reward
    /// Single Responsibility: Only handles bounty attachment
    public fun attach_bounty(
        certificate: &mut Certificate,
        bounty_coin: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Only issuer can attach bounty
        assert!(
            types::certificate_issuer(certificate) == tx_context::sender(ctx),
            errors::not_authorized()
        );

        let bounty_amount = coin::value(&bounty_coin);
        validator::validate_bounty_amount(bounty_amount);

        types::certificate_add_bounty(certificate, bounty_amount);

        events::emit_bounty_attached(
            object::id(certificate),
            bounty_amount,
            clock::timestamp_ms(clock),
        );

        // Transfer coin to certificate owner
        transfer::public_transfer(bounty_coin, types::certificate_owner(certificate));
    }

    /// Update user's TrustRank based on certificate collection
    public fun update_trust_rank(
        profile: &mut UserProfile,
        _registry: &PlatformRegistry,
        ctx: &mut TxContext
    ) {
        assert!(
            types::profile_owner(profile) == tx_context::sender(ctx),
            errors::not_authorized()
        );

        let old_rank = types::profile_trust_rank(profile);
        let cert_count = types::profile_total_certificates(profile);

        // Calculate new rank
        let new_rank = if (cert_count >= 50) {
            constants::rank_master()
        } else if (cert_count >= 25) {
            constants::rank_expert()
        } else if (cert_count >= 10) {
            constants::rank_advanced()
        } else if (cert_count >= 3) {
            constants::rank_intermediate()
        } else {
            constants::rank_novice()
        };

        if (new_rank != old_rank) {
            types::profile_update_trust_rank(profile, new_rank);

            events::emit_trust_rank_updated(
                object::id(profile),
                types::profile_owner(profile),
                old_rank,
                new_rank,
                tx_context::epoch(ctx),
            );
        };
    }

    // ===== View Functions =====
    // Following Interface Segregation: Separate read-only interfaces

    /// Get certificate details
    public fun get_certificate_info(cert: &Certificate): (
        address,
        address,
        String,
        String,
        u8,
        u64,
        u8
    ) {
        (
            types::certificate_owner(cert),
            types::certificate_issuer(cert),
            *types::certificate_title(cert),
            *types::certificate_pinata_cid(cert),
            types::certificate_type(cert),
            types::certificate_issued_at(cert),
            types::certificate_trust_rank(cert)
        )
    }

    /// Get user profile details
    public fun get_profile_info(profile: &UserProfile): (
        address,
        String,
        u64,
        u8,
        u64
    ) {
        (
            types::profile_owner(profile),
            *types::profile_display_name(profile),
            types::profile_total_certificates(profile),
            types::profile_trust_rank(profile),
            types::profile_reputation_score(profile)
        )
    }

    /// Check if certificate is valid
    public fun is_certificate_valid(cert: &Certificate, current_time: u64): bool {
        let expires_at = types::certificate_expires_at(cert);
        expires_at == 0 || current_time < expires_at
    }

    // ===== Test-Only Functions =====

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(CERTIFICATE {}, ctx);
    }

    #[test_only]
    public fun get_certificate_owner_test(cert: &Certificate): address {
        types::certificate_owner(cert)
    }

    #[test_only]
    public fun get_certificate_bounty_test(cert: &Certificate): u64 {
        types::certificate_bounty(cert)
    }
}
