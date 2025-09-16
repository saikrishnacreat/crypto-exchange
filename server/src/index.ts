// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import prisma from './db'; // Import our prisma client
import authRouter from './routes/auth';
import userRouter from './routes/user';
import cors from 'cors';
import priceRouter from './routes/prices';
import p2pRouter from './routes/p2p';
import transactionsRouter from './routes/transactions';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: [
    'https://crypto-exchange-2mxz8i1dt-saikrishnacreats-projects.vercel.app/', // Your live frontend
    'http://localhost:3000'                      // Your local development frontend
  ]
}));

// Middleware to parse JSON
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/prices', priceRouter);
app.use('/api/p2p', p2pRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Crypto Exchange Backend is running!');
});

// New test route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("🔥 DATABASE ERROR:", error); // Add this line
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});