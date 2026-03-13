// backend.js
import express from "express";
import fetch from "node-fetch"; // Node 18+ me optional, purane version ke liye zaruri
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // ✅ Browser se direct fetch allow karega

// --- Nvidia API key ---
const NVIDIA_API_KEY = "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"; 

// --- Image generation route ---
app.post("/generate-image", async (req, res) => {
    const { prompt, width = 1024, height = 1024, steps = 4, seed = 0 } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

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

        if (!response.ok) {
            const text = await response.text(); // agar JSON parse nahi hota to raw text
            throw new Error(`Nvidia API error: ${response.status} - ${text}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Image generation error:", err);
        res.status(500).json({ error: "Image generation failed", details: err.message });
    }
});

app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});
