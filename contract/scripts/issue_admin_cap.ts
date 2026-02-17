import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64 } from '@mysten/sui/utils';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const PACKAGE_ID = "0x3289b8cbc59ccd657166e0b71565941fa3456d93f4d318b1a0a1ff7cd5928542";
const REGISTRY_ID = "0xfc79e11d93b0dfc10de06d3350c9c57acf1d90e31ea925aeec81d8be3dd7dbd4";

async function issueAdminCap(institutionName: string) {
  // Initialize Sui client
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });
  
  // Load keypair from Sui config
  const configPath = path.join(os.homedir(), '.sui', 'sui_config', 'sui.keystore');
  const keystore = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Use the first key (or you can specify which one)
  const keypair = Ed25519Keypair.fromSecretKey(fromB64(keystore[0]).slice(1));
  const address = keypair.getPublicKey().toSuiAddress();
  
  console.log(`Issuing AdminCap to: ${institutionName}`);
  console.log(`Your Address: ${address}\n`);
  
  // Create transaction
  const tx = new Transaction();
  
  // Call issue_admin_cap and capture the result
  const [adminCap] = tx.moveCall({
    target: `${PACKAGE_ID}::certificate::issue_admin_cap`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure.string(institutionName),
      tx.pure.address(address),
      tx.pure.vector('u8', [1, 2, 3, 4, 5]), // All certificate types
    ],
  });
  
  // Transfer the AdminCap to your address
  tx.transferObjects([adminCap], address);
  
  // Execute transaction
  console.log('Executing transaction...');
  const  result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });
  
  console.log('\n✓ AdminCap successfully issued!');
  console.log(`Transaction Digest: ${result.digest}`);
  console.log('\nCheck your wallet for the new AdminCap object.');
  console.log('Refresh the frontend to start issuing certificates.');
}

// Get institution name from command line args
const institutionName = process.argv[2] || 'My Institution';
issueAdminCap(institutionName).catch(console.error);
