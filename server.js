// server.js
import express from "express";
import crypto from "crypto";
import axios from "axios";

const app = express();
app.use(express.json()); // JSON gövdeyi alabilmek için şart!

app.post("/", async (req, res) => {
  try {
    const { action, symbol, price, quantity, label, reason } = req.body;

    if (!action || !symbol || !price || !quantity) {
      return res.status(400).json({ error: "Eksik parametre. 'action', 'symbol', 'price', 'quantity' zorunludur." });
    }

    const side = action.toUpperCase(); // BUY veya SELL
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const timestamp = Date.now();

    const query = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", apiSecret).update(query).digest("hex");
    const url = `https://fapi.binance.com/fapi/v1/order?${query}&signature=${signature}`;

    const response = await axios.post(url, {}, {
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    console.log(`[${label}] ${side} ${quantity} ${symbol} @ ${price} → ${reason}`);
    res.status(200).json({ success: true, order: response.data });

  } catch (err) {
    console.error("HATA:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hydra bot API running on port ${PORT}`));
