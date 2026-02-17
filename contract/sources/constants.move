/// Constants for SuiCert platform
/// Single Responsibility: Centralized configuration
module suicert::constants {
    // ===== Business Rules =====
    public fun min_bounty_amount(): u64 { 1_000_000 } // 0.001 SUI
    public fun max_certificate_types(): u64 { 100 }
    public fun master_rank_threshold(): u64 { 10 }
    public fun initial_institution_reputation(): u64 { 100 }
    
    // ===== Certificate Types =====
    public fun cert_type_course(): u8 { 1 }
    public fun cert_type_degree(): u8 { 2 }
    public fun cert_type_skill(): u8 { 3 }
    public fun cert_type_achievement(): u8 { 4 }
    public fun cert_type_bootcamp(): u8 { 5 }
    
    // ===== TrustRank Levels =====
    public fun rank_novice(): u8 { 0 }
    public fun rank_intermediate(): u8 { 1 }
    public fun rank_advanced(): u8 { 2 }
    public fun rank_expert(): u8 { 3 }
    public fun rank_master(): u8 { 4 }
    
    // ===== Version =====
    public fun current_version(): u64 { 1 }
}
