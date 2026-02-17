/**
 * Certificate Service
 * Single Responsibility: Handle all certificate-related blockchain operations
 * Dependency Inversion: Depends on abstractions (Transaction) not implementations
 */

import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, PLATFORM_REGISTRY_ID } from '@/lib/constants';

export interface IssueCertificateParams {
  adminCapId: string;
  recipient: string;
  certType: number;
  title: string;
  description: string;
  pinataCid: string;
  ipfsUrl: string;
  expiresAt?: number;
}

export interface BatchIssueCertificateParams {
  adminCapId: string;
  recipients: string[];
  certType: number;
  title: string;
  description: string;
  pinataCid: string;
  ipfsUrl: string;
  expiresAt?: number;
}

export class CertificateService {
  /**
   * Create transaction to issue a single certificate
   */
  static createIssueCertificateTx(params: IssueCertificateParams): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::certificate::issue_certificate`,
      arguments: [
        tx.object(params.adminCapId),
        tx.object(PLATFORM_REGISTRY_ID),
        tx.pure.address(params.recipient),
        tx.pure.u8(params.certType),
        tx.pure.string(params.title),
        tx.pure.string(params.description),
        tx.pure.string(params.pinataCid),
        tx.pure.string(params.ipfsUrl),
        tx.pure.u64(params.expiresAt || 0),
        tx.object('0x6'), // Clock object
      ],
    });

    return tx;
  }

  /**
   * Create transaction to batch issue certificates
   */
  static createBatchIssueCertificateTx(params: BatchIssueCertificateParams): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::certificate::batch_issue_certificates`,
      arguments: [
        tx.object(params.adminCapId),
        tx.object(PLATFORM_REGISTRY_ID),
        tx.pure.vector('address', params.recipients),
        tx.pure.u8(params.certType),
        tx.pure.string(params.title),
        tx.pure.string(params.description),
        tx.pure.string(params.pinataCid),
        tx.pure.string(params.ipfsUrl),
        tx.pure.u64(params.expiresAt || 0),
        tx.object('0x6'), // Clock object
      ],
    });

    return tx;
  }

  /**
   * Validate certificate data before submission
   */
  static validateCertificateData(params: Partial<IssueCertificateParams>): string[] {
    const errors: string[] = [];

    if (!params.recipient) {
      errors.push('Recipient address is required');
    }

    if (!params.title || params.title.trim().length === 0) {
      errors.push('Certificate title is required');
    }

    if (!params.description || params.description.trim().length === 0) {
      errors.push('Certificate description is required');
    }

    if (!params.pinataCid || params.pinataCid.trim().length === 0) {
      errors.push('Pinata CID is required');
    }

    if (params.certType === undefined) {
      errors.push('Certificate type is required');
    }

    return errors;
  }
}
