import express, { Response } from 'express';
import prisma from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// --- Create a new P2P Offer ---
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { offerType, asset, amount, price } = req.body;
  const sellerId = req.user?.userId;

  if (!sellerId) {
    return res.status(400).json({ error: 'User ID not found in token.' });
  }

  // TODO: Add logic here to check if the user has enough balance to create the offer

  const offer = await prisma.p2POffer.create({
    data: {
      sellerId,
      offerType,
      asset,
      amount,
      price,
    },
  });

  res.status(201).json(offer);
});

// --- Get all open P2P Offers ---
router.get('/offers', async (req, res) => {
  const offers = await prisma.p2POffer.findMany({
    where: { status: 'OPEN' },
    include: {
      seller: { // Include seller's name
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json(offers);
});

export default router;