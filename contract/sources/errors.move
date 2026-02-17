/// Error codes for SuiCert platform
/// Single Responsibility: Centralized error management
module suicert::errors {
    // ===== Authorization Errors =====
    public fun not_authorized(): u64 { 0 }
    public fun soulbound_transfer_attempt(): u64 { 6 }
    
    // ===== Validation Errors =====
    public fun invalid_certificate_type(): u64 { 1 }
    public fun invalid_metadata(): u64 { 3 }
    public fun certificate_not_found(): u64 { 4 }
    public fun invalid_trust_rank(): u64 { 5 }
    
    // ===== Business Logic Errors =====
    public fun insufficient_bounty(): u64 { 2 }
    public fun certificate_expired(): u64 { 7 }
    public fun institution_not_found(): u64 { 8 }
    public fun unauthorized_certificate_type(): u64 { 9 }
}
