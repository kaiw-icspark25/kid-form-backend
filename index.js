const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enables request permissions from Expo Snack

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/scan-form', async (req, res) => {
    console.info(`[${new Date().toISOString()}] New Request Text: "${req.body.userText}"`);

    const { userText } = req.body;

    if (!userText) {
        return res.status(400).json({ safe: false, message: "No text provided." });
    }

    try {
        const moderationResponse = await openai.moderations.create({ input: userText });
        const results = moderationResponse.results[0];

        if (results.flagged) {
            return res.status(400).json({
                safe: false,
                message: "Oops! Please keep your text safe and friendly for everyone."
            });
        }

        return res.status(200).json({ safe: true, message: "Submission accepted!" });

    } catch (error) {
        // Log the exact error details to Render console
        console.error("Moderation scan failed:", error.message || error);

        // Check if OpenAI threw a 429 Too Many Requests / Rate Limit error
        if (error.status === 429) {
            return res.status(429).json({ 
                safe: false, 
                error: "Moderation system busy. Please try again in a few seconds." 
            });
        }

        // Generic fallback for all other server or network errors
        return res.status(500).json({ 
            safe: false, 
            error: "Server error during safety scan." 
        });
    }
});

// Render dynamically assigns the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));