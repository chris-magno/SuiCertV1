/// Validation logic for SuiCert platform
/// Single Responsibility: Input validation and business rules
module suicert::validator {
    use std::string::String;
    use sui::vec_map::{Self, VecMap};
    use suicert::errors;
    use suicert::constants;

    // ===== Certificate Type Validation =====

    public fun validate_certificate_type(
        cert_type: u8,
        certificate_types: &VecMap<u8, String>,
    ) {
        assert!(
            vec_map::contains(certificate_types, &cert_type),
            errors::invalid_certificate_type()
        );
    }

    public fun validate_authorized_types(
        cert_type: u8,
        authorized_types: &vector<u8>,
    ) {
        assert!(
            vector::contains(authorized_types, &cert_type),
            errors::unauthorized_certificate_type()
        );
    }

    public fun validate_all_certificate_types(
        authorized_types: &vector<u8>,
        certificate_types: &VecMap<u8, String>,
    ) {
        let mut i = 0;
        let len = vector::length(authorized_types);
        while (i < len) {
            let cert_type = *vector::borrow(authorized_types, i);
            validate_certificate_type(cert_type, certificate_types);
            i = i + 1;
        };
    }

    // ===== TrustRank Validation =====

    public fun validate_trust_rank(rank: u8) {
        assert!(
            rank <= constants::rank_master(),
            errors::invalid_trust_rank()
        );
    }

    // ===== Bounty Validation =====

    public fun validate_bounty_amount(amount: u64) {
        assert!(
            amount >= constants::min_bounty_amount(),
            errors::insufficient_bounty()
        );
    }

    // ===== Metadata Validation =====

    public fun validate_metadata(
        title: &String,
        description: &String,
        pinata_cid: &String,
    ) {
        use std::string;
        
        assert!(
            !string::is_empty(title),
            errors::invalid_metadata()
        );
        assert!(
            !string::is_empty(description),
            errors::invalid_metadata()
        );
        assert!(
            !string::is_empty(pinata_cid),
            errors::invalid_metadata()
        );
    }

    // ===== Expiration Validation =====

    public fun validate_not_expired(expires_at: u64, current_time: u64) {
        if (expires_at > 0) {
            assert!(
                current_time < expires_at,
                errors::certificate_expired()
            );
        }
    }
}
