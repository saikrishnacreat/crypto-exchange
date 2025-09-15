import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include our user payload
export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token not found.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload as { userId: number; email: string };
    next(); // Token is valid, proceed to the next handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};