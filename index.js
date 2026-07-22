const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enables request permissions from Expo Snack

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.post('/api/scan-form', async (req, res) => {
    console.log("RECEIVED INPUT:", req.body); // 👈 ADD THIS LINE

    const { userText } = req.body;

    try {
        // Call OpenAI's free Moderation endpoint
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
        return res.status(500).json({ error: "Server error during safety scan." });
    }
});

// Render dynamically assigns the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
