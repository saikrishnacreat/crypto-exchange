// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import prisma from './db'; // Import our prisma client
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());
app.use('/api/auth', authRouter); 

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