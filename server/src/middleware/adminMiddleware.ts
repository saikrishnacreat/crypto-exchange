import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import prisma from '../db';

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user && user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};