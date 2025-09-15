import express from 'express';
import { ethers } from 'ethers';
import AggregatorV3InterfaceABI from '@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json';

const router = express.Router();

// Sepolia ETH/USD Price Feed Address
const ethUsdPriceFeedAddress = '0x694AA1769357215DE4FAC081bf1f309aDC325306';
// const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

const priceFeed = new ethers.Contract(
  ethUsdPriceFeedAddress,
  AggregatorV3InterfaceABI,
  provider
);

router.get('/eth-usd', async (req, res) => {
  try {
    const roundData = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();
    const price = Number(roundData.answer) / 10 ** Number(decimals);

    res.status(200).json({
      pair: 'ETH/USD',
      price: price.toFixed(2),
    });
  } catch (error) {
    console.error("🔥 PRICE FEED ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch price data.' });
  }
});

export default router;