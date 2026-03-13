// backend.js
import express from "express";
import fetch from "node-fetch"; // ya aapke Node version ke hisaab se

const app = express();
app.use(express.json());

// --- Yahan apni Nvidia API key daal do ---
const NVIDIA_API_KEY = "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"; 

// --- Image generate route ---
app.post("/generate-image", async (req, res) => {
    const { prompt, width = 1024, height = 1024, steps = 4, seed = 0 } = req.body;

    try {
        const response = await fetch(
            "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ prompt, width, height, steps, seed })
            }
        );

        const data = await response.json();

        // Frontend ko image data ya URL send kar do
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Image generation failed", details: err.message });
    }
});

app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});
