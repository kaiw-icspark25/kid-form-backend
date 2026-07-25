const express = require('express');
const cors = require('cors');

// Safe import for both CommonJS and ES Module builds of bad-words
const BadWords = require('bad-words');
const Filter = BadWords.Filter || BadWords.default || BadWords;

const app = express();
const filter = new Filter();

app.use(express.json());
app.use(cors());

app.post('/api/scan-form', (req, res) => {
    console.info(`[${new Date().toISOString()}] New Request Text: "${req.body.userText}"`);

    const { userText } = req.body;

    if (!userText) {
        return res.status(400).json({ 
            safe: false, 
            message: "No text provided." 
        });
    }

    try {
        const isProfane = filter.isProfane(userText);

        if (isProfane) {
            return res.status(400).json({
                safe: false,
                message: "Oops! Please keep your text safe and friendly for everyone."
            });
        }

        return res.status(200).json({ 
            safe: true, 
            message: "Submission accepted!" 
        });

    } catch (error) {
        console.error("Scan error:", error);
        return res.status(500).json({ 
            safe: false, 
            error: "Server error during safety scan." 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));