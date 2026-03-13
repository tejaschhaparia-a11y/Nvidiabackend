import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.NVIDIA_API_KEY;
const INVOKE_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell";

/* Root route (browser test ke liye) */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* Image generation route */
app.post("/generate-image", async (req, res) => {

  const { prompt, width = 512, height = 512, steps = 4, seed = 0 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {

    const response = await fetch(INVOKE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        prompt,
        width,
        height,
        steps,
        seed
      })
    });

    const data = await response.json();

    res.json(data);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Image generation failed" });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
