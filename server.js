// server.js
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    const { symbol, action, price, size } = req.body;
    const side = action.toUpperCase() === "BUY" ? "BUY" : "SELL";

    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const timestamp = Date.now();
    const recvWindow = 5000;

  const queryString = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
  const signature = crypto
  .createHmac('sha256', process.env.BINANCE_API_SECRET)
  .update(queryString)
  .digest('hex');
    const url = `https://fapi.binance.com/fapi/v1/order?${query}&signature=${signature}`;

    const response = await axios.post(url, {}, {
      headers: { "X-MBX-APIKEY": apiKey }
    });

    res.status(200).json({ ok: true, binance: response.data });
  } catch (err) {
    console.error("HATA:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
