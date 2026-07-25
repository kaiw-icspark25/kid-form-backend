const express = require('express');
const cors = require('cors');
const Filter = require('bad-words');

const app = express();
const filter = new Filter();

// Middleware
app.use(express.json());
app.use(cors()); // Enables request permissions from Expo Snack / Frontend

app.post('/api/scan-form', (req, res) => {
    console.info(`[${new Date().toISOString()}] New Request Text: "${req.body.userText}"`);

    const { userText } = req.body;

    // 1. Validate incoming data
    if (!userText) {
        return res.status(400).json({ 
            safe: false, 
            message: "No text provided." 
        });
    }

    try {
        // 2. Check if the text contains inappropriate language locally
        const isProfane = filter.isProfane(userText);

        if (isProfane) {
            console.log("Content flagged as unsafe.");
            return res.status(400).json({
                safe: false,
                message: "Oops! Please keep your text safe and friendly for everyone."
            });
        }

        console.log("Content approved.");
        return res.status(200).json({ 
            safe: true, 
            message: "Submission accepted!" 
        });

    } catch (error) {
        console.error("Local scan error:", error.message || error);
        return res.status(500).json({ 
            safe: false, 
            error: "Server error during safety scan." 
        });
    }
});

// Render dynamically assigns the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));