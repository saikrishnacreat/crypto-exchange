import express, { Response } from 'express';
import prisma from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

// This route is protected by two middlewares
router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { // Select only the data we want to show
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

router.patch('/users/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, isAdmin } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        isAdmin,
      },
      select: { // Return only the updated, non-sensitive data
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

export default router;