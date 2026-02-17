/**
 * Profile Service
 * Single Responsibility: Handle user profile operations
 */

import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '@/lib/constants';

export interface CreateProfileParams {
  displayName: string;
}

export class ProfileService {
  /**
   * Create transaction to create a user profile
   */
  static createProfileTx(params: CreateProfileParams): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::certificate::create_profile`,
      arguments: [
        tx.pure.string(params.displayName),
        tx.object('0x6'), // Clock object
      ],
    });

    return tx;
  }

  /**
   * Create transaction to update TrustRank
   */
  static createUpdateTrustRankTx(profileId: string, registryId: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::certificate::update_trust_rank`,
      arguments: [
        tx.object(profileId),
        tx.object(registryId),
      ],
    });

    return tx;
  }

  /**
   * Validate profile data
   */
  static validateProfileData(params: Partial<CreateProfileParams>): string[] {
    const errors: string[] = [];

    if (!params.displayName || params.displayName.trim().length === 0) {
      errors.push('Display name is required');
    }

    if (params.displayName && params.displayName.length > 50) {
      errors.push('Display name must be less than 50 characters');
    }

    return errors;
  }
}
