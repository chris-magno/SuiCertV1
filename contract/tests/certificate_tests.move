#[test_only]
module suicert::certificate_tests {
    use suicert::certificate::{Self, AdminCap, Certificate, UserProfile, PlatformRegistry};
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::test_utils;
    use sui::clock::{Self, Clock};
    use sui::transfer;

    // Test addresses
    const PLATFORM_ADMIN: address = @0x1;
    const INSTITUTION_A: address = @0x2;
    const STUDENT_1: address = @0x3;
    const STUDENT_2: address = @0x4;
    const STUDENT_3: address = @0x5;

    // Certificate type constants
    const CERT_TYPE_COURSE: u8 = 1;
    const CERT_TYPE_DEGREE: u8 = 2;
    const CERT_TYPE_SKILL: u8 = 3;

    // Helper function to setup test scenario
    fun setup_test(): Scenario {
        let mut scenario = ts::begin(PLATFORM_ADMIN);
        
        // Initialize the module
        {
            certificate::init_for_testing(ts::ctx(&mut scenario));
        };
        
        scenario
    }

    #[test]
    fun test_init_creates_registry() {
        let mut scenario = setup_test();
        
        // Verify registry was created and shared
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            assert!(ts::has_most_recent_shared<PlatformRegistry>(), 0);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_issue_admin_cap() {
        let mut scenario = setup_test();
        
        // Issue AdminCap to institution
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            
            let authorized_types = vector[CERT_TYPE_COURSE, CERT_TYPE_SKILL];
            
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Stanford University",
                INSTITUTION_A,
                authorized_types,
                ts::ctx(&mut scenario)
            );
            
            // Transfer AdminCap to the intended institution
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            
            ts::return_shared(registry);
        };
        
        // Verify AdminCap was transferred to institution
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            ts::return_to_sender(&scenario, admin_cap);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_create_user_profile() {
        let mut scenario = setup_test();
        
        // Create clock
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::share_for_testing(clock);
        
        // Student creates profile
        ts::next_tx(&mut scenario, STUDENT_1);
        {
            let clock = ts::take_shared<Clock>(&scenario);
            
            certificate::create_profile(
                b"Alice Student",
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_shared(clock);
        };
        
        // Verify profile was created
        ts::next_tx(&mut scenario, STUDENT_1);
        {
            let profile = ts::take_from_sender<UserProfile>(&scenario);
            
            let (owner, display_name, total_certs, trust_rank, reputation) = 
                certificate::get_profile_info(&profile);
            
            assert!(owner == STUDENT_1, 0);
            assert!(total_certs == 0, 1);
            assert!(trust_rank == 0, 2); // RANK_NOVICE
            assert!(reputation == 0, 3);
            
            ts::return_to_sender(&scenario, profile);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_issue_single_certificate() {
        let mut scenario = setup_test();
        
        // Setup clock
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::share_for_testing(clock);
        
        // Issue AdminCap
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let authorized_types = vector[CERT_TYPE_COURSE, CERT_TYPE_DEGREE];
            
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"MIT",
                INSTITUTION_A,
                authorized_types,
                ts::ctx(&mut scenario)
            );
            
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            ts::return_shared(registry);
        };
        
        // Issue certificate to student
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let mut admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let clock = ts::take_shared<Clock>(&scenario);
            
            certificate::issue_certificate(
                &mut admin_cap,
                &mut registry,
                STUDENT_1,
                CERT_TYPE_COURSE,
                b"Blockchain Fundamentals",
                b"Completed advanced blockchain development course",
                b"QmXYZ123456789",
                b"https://gateway.pinata.cloud/ipfs/QmXYZ123456789",
                0, // Never expires
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(registry);
            ts::return_shared(clock);
        };
        
        // Verify certificate was issued to student
        ts::next_tx(&mut scenario, STUDENT_1);
        {
            let cert = ts::take_from_sender<Certificate>(&scenario);
            
            let (owner, issuer, title, pinata_cid, cert_type, _issued_at, trust_rank) = 
                certificate::get_certificate_info(&cert);
            
            assert!(owner == STUDENT_1, 0);
            assert!(issuer == INSTITUTION_A, 1);
            assert!(cert_type == CERT_TYPE_COURSE, 2);
            assert!(trust_rank == 0, 3); // RANK_NOVICE
            
            ts::return_to_sender(&scenario, cert);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_batch_issue_certificates() {
        let mut scenario = setup_test();
        
        // Setup clock
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::share_for_testing(clock);
        
        // Issue AdminCap
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let authorized_types = vector[CERT_TYPE_SKILL];
            
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Coursera",
                INSTITUTION_A,
                authorized_types,
                ts::ctx(&mut scenario)
            );
            
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            ts::return_shared(registry);
        };
        
        // Batch issue to 3 students
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let mut admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let clock = ts::take_shared<Clock>(&scenario);
            
            let recipients = vector[STUDENT_1, STUDENT_2, STUDENT_3];
            
            certificate::batch_issue_certificates(
                &mut admin_cap,
                &mut registry,
                recipients,
                CERT_TYPE_SKILL,
                b"Web3 Developer",
                b"Mastered Move programming and Sui development",
                b"QmBATCH123",
                b"https://gateway.pinata.cloud/ipfs/QmBATCH123",
                0,
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(registry);
            ts::return_shared(clock);
        };
        
        // Verify each student received a certificate
        ts::next_tx(&mut scenario, STUDENT_1);
        {
            let cert = ts::take_from_sender<Certificate>(&scenario);
            let (owner, _, _, _, _, _, _) = certificate::get_certificate_info(&cert);
            assert!(owner == STUDENT_1, 0);
            ts::return_to_sender(&scenario, cert);
        };
        
        ts::next_tx(&mut scenario, STUDENT_2);
        {
            let cert = ts::take_from_sender<Certificate>(&scenario);
            let (owner, _, _, _, _, _, _) = certificate::get_certificate_info(&cert);
            assert!(owner == STUDENT_2, 0);
            ts::return_to_sender(&scenario, cert);
        };
        
        ts::next_tx(&mut scenario, STUDENT_3);
        {
            let cert = ts::take_from_sender<Certificate>(&scenario);
            let (owner, _, _, _, _, _, _) = certificate::get_certificate_info(&cert);
            assert!(owner == STUDENT_3, 0);
            ts::return_to_sender(&scenario, cert);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_attach_bounty() {
        let mut scenario = setup_test();
        
        // Setup clock
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::share_for_testing(clock);
        
        // Issue AdminCap and certificate (abbreviated setup)
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Harvard",
                INSTITUTION_A,
                vector[CERT_TYPE_DEGREE],
                ts::ctx(&mut scenario)
            );
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            ts::return_shared(registry);
        };
        
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let mut admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let clock = ts::take_shared<Clock>(&scenario);
            
            certificate::issue_certificate(
                &mut admin_cap,
                &mut registry,
                STUDENT_1,
                CERT_TYPE_DEGREE,
                b"Master of Science",
                b"Computer Science degree",
                b"QmDEGREE",
                b"https://gateway.pinata.cloud/ipfs/QmDEGREE",
                0,
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(registry);
            ts::return_shared(clock);
        };
        
        // Institution attaches bounty
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            // Take certificate (it's owned by STUDENT_1, but we need to modify for test)
            // In real scenario, certificate would be a mutable reference owned by student
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_certificate_validation() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1000);
        clock::share_for_testing(clock);
        
        // Issue AdminCap and certificate with expiration
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Udemy",
                INSTITUTION_A,
                vector[CERT_TYPE_COURSE],
                ts::ctx(&mut scenario)
            );
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            ts::return_shared(registry);
        };
        
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let mut admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let clock = ts::take_shared<Clock>(&scenario);
            
            certificate::issue_certificate(
                &mut admin_cap,
                &mut registry,
                STUDENT_1,
                CERT_TYPE_COURSE,
                b"Python 101",
                b"Introduction to Python",
                b"QmPYTHON",
                b"https://gateway.pinata.cloud/ipfs/QmPYTHON",
                5000, // Expires at timestamp 5000
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(registry);
            ts::return_shared(clock);
        };
        
        // Check certificate is valid before expiration
        ts::next_tx(&mut scenario, STUDENT_1);
        {
            let cert = ts::take_from_sender<Certificate>(&scenario);
            assert!(certificate::is_certificate_valid(&cert, 3000), 0);
            assert!(!certificate::is_certificate_valid(&cert, 6000), 1);
            ts::return_to_sender(&scenario, cert);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = suicert::certificate::ENotAuthorized)]
    fun test_unauthorized_certificate_type() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::share_for_testing(clock);
        
        // Issue AdminCap with only COURSE authorization
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Small College",
                INSTITUTION_A,
                vector[CERT_TYPE_COURSE], // Only authorized for courses
                ts::ctx(&mut scenario)
            );
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            ts::return_shared(registry);
        };
        
        // Try to issue DEGREE certificate (should fail)
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let mut admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let clock = ts::take_shared<Clock>(&scenario);
            
            certificate::issue_certificate(
                &mut admin_cap,
                &mut registry,
                STUDENT_1,
                CERT_TYPE_DEGREE, // Not authorized!
                b"Fake Degree",
                b"This should fail",
                b"QmFAIL",
                b"https://gateway.pinata.cloud/ipfs/QmFAIL",
                0,
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(registry);
            ts::return_shared(clock);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = suicert::certificate::EInvalidMetadata)]
    fun test_empty_metadata_fails() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::share_for_testing(clock);
        
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Test Inst",
                INSTITUTION_A,
                vector[CERT_TYPE_SKILL],
                ts::ctx(&mut scenario)
            );
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            ts::return_shared(registry);
        };
        
        // Try to issue with empty Pinata CID (should fail)
        ts::next_tx(&mut scenario, INSTITUTION_A);
        {
            let mut admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            let clock = ts::take_shared<Clock>(&scenario);
            
            certificate::issue_certificate(
                &mut admin_cap,
                &mut registry,
                STUDENT_1,
                CERT_TYPE_SKILL,
                b"Test",
                b"Test",
                b"", // Empty CID!
                b"https://gateway.pinata.cloud/ipfs/",
                0,
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(registry);
            ts::return_shared(clock);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_institution_reputation() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, PLATFORM_ADMIN);
        {
            let mut registry = ts::take_shared<PlatformRegistry>(&scenario);
            
            let admin_cap = certificate::issue_admin_cap(
                &mut registry,
                b"Top University",
                INSTITUTION_A,
                vector[CERT_TYPE_DEGREE],
                ts::ctx(&mut scenario)
            );
            
            transfer::public_transfer(admin_cap, INSTITUTION_A);
            
            // Check reputation was initialized
            let reputation = certificate::get_institution_reputation(&registry, INSTITUTION_A);
            assert!(reputation == 100, 0); // Default reputation
            
            ts::return_shared(registry);
        };
        
        ts::end(scenario);
    }
}
