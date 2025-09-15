import express from 'express';
import bcrypt from 'bcrypt';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import prisma from '../db';

// This line creates the router instance
const router = express.Router();

// --- User Registration Endpoint ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newWallet = ethers.Wallet.createRandom();
    const depositAddress = newWallet.address;

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      await tx.wallet.create({
        data: {
          userId: createdUser.id,
          currency: 'ETH',
          depositAddress: depositAddress,
        },
      });

      return createdUser;
    });

    res.status(201).json({ message: 'User created successfully!', userId: user.id });

  } catch (error) {
    console.error("🔥 REGISTRATION ERROR:", error);
    res.status(500).json({ error: 'Something went wrong during registration.' });
  }
});

// --- User Login Endpoint ---
// --- User Login Endpoint ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 4. Generate a JWT if the password is valid
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    res.status(200).json({
      message: 'Login successful!',
      token: token,
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({ error: 'Something went wrong during login.' });
  }
});

export default router;