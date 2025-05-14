import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    const { symbol, action, price, quantity, label, reason } = req.body;

    const side = action.toUpperCase() === "BUY" ? "BUY" : "SELL";

    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "API anahtarları tanımlı değil." });
    }

    const timestamp = Date.now();
    const recvWindow = 5000;

    const queryString = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(queryString)
      .digest("hex");

    const url = `https://fapi.binance.com/fapi/v1/order?${queryString}&signature=${signature}`;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "X-MBX-APIKEY": apiKey,
        },
      }
    );

    res.status(200).json({
      ok: true,
      binance: response.data,
      received: { symbol, action, price, quantity, label, reason },
    });
  } catch (err) {
    console.error("❌ Binance API Hatası:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor → Port: ${PORT}`));
