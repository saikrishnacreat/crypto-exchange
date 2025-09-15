import { ethers } from 'ethers';
import prisma from '../db';
import dotenv from 'dotenv';

dotenv.config();

// Use the reliable RPC URL from our .env file
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

async function listenForDeposits() {
  console.log('✅ Starting deposit listener...');

  provider.on('block', async (blockNumber) => {
    console.log(`🔎 Checking block number: ${blockNumber}`);

    try {
      // Get the full block details, including transactions
      const block = await provider.getBlock(blockNumber, true);

      if (block && block.prefetchedTransactions) {
        for (const tx of block.prefetchedTransactions) {
          // Check if the transaction has a recipient address and a value
          if (tx.to && tx.value > 0) {
            
            // Check if the recipient address belongs to one of our users
            const wallet = await prisma.wallet.findUnique({
              where: { depositAddress: tx.to },
            });

            if (wallet) {
              console.log(`💰 Deposit detected for user ${wallet.userId}!`);
              console.log(`  - Amount: ${ethers.formatEther(tx.value)} ETH`);
              console.log(`  - Tx Hash: ${tx.hash}`);

              // Convert the amount from Wei (string) to a Decimal
              const depositAmount = parseFloat(ethers.formatEther(tx.value));

              // Update the user's balance in our database
              await prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                  balance: {
                    increment: depositAmount,
                  },
                },
              });
              console.log(`✅ User ${wallet.userId}'s balance updated.`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`🔥 Error processing block ${blockNumber}:`, error);
    }
  });
}

listenForDeposits().catch((error) => {
  console.error('Listener failed to start:', error);
  process.exit(1);
});