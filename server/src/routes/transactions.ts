import express, { Response } from 'express';
import { ethers } from 'ethers';
import prisma from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { Decimal } from '@prisma/client/runtime/library';

const router = express.Router();

// Initialize provider and hot wallet from environment variables
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const hotWallet = new ethers.Wallet(process.env.HOT_WALLET_PRIVATE_KEY as string, provider);

// --- Withdraw Endpoint (Multi-Currency) ---
router.post('/withdraw', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { recipientAddress, amount, currency } = req.body;
  const userId = req.user?.userId;

  if (!userId || !currency || !amount || !recipientAddress) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const amountToSend = parseFloat(amount);

    // Find the specific wallet for the requested currency
    const userWallet = await prisma.wallet.findFirst({
      where: { userId, currency: currency.toUpperCase() },
    });

    if (!userWallet || new Decimal(userWallet.balance).toNumber() < amountToSend) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // Debit the user's balance in our database FIRST for safety
    await prisma.wallet.update({
      where: { id: userWallet.id },
      data: { balance: { decrement: amountToSend } },
    });

    let tx;
    // Handle native ETH transaction
    if (currency.toUpperCase() === 'ETH') {
      tx = await hotWallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount.toString()),
      });
    } else {
      // Handle ERC20 Token transaction
      // NOTE: For a real app, you'd have a config mapping currencies to contract addresses and decimals
      const tokenContractAddress = 'YOUR_USDC_CONTRACT_ADDRESS_ON_SEPOLIA';
      const tokenAbi = ["function transfer(address to, uint amount)"];
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, hotWallet);
      
      const tokenDecimals = 6; // e.g., 6 for USDC, 18 for others
      const tokenAmount = ethers.parseUnits(amount.toString(), tokenDecimals); 
      tx = await tokenContract.transfer(recipientAddress, tokenAmount);
    }

    console.log(`💸 ${currency} withdrawal for user ${userId}. Tx: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ ${currency} withdrawal confirmed for user ${userId}.`);

    res.status(200).json({ message: 'Withdrawal successful!', txHash: tx.hash });

  } catch (error: any) {
    console.error("🔥 WITHDRAWAL ERROR:", error);
    res.status(500).json({ error: 'Withdrawal failed.', details: error.message });
  }
});

export default router;