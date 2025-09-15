import express, { Response } from 'express';
import prisma from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// This route is protected. The authMiddleware will run first.
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token.' });
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: userId },
    });
    
    // Also fetch the user's name and email for the dashboard
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    res.status(200).json({ user, wallets });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

export default router;