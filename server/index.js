const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// --- NEW: Import our Gemini AI service ---
const { analyzeResume } = require('./geminiService');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: 'Hello from the backend!' }));

// --- FINALIZED UPLOAD AND ANALYZE ROUTE ---
app.post('/api/resume/analyze', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = path.join(__dirname, req.file.path);

    try {
        let extractedText = '';
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            extractedText = data.text;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else {
            throw new Error('Unsupported file type.');
        }

        // --- NEW: Call the Gemini AI service with the extracted text ---
        console.log('Sending text to Gemini for analysis...');
        const aiAnalysis = await analyzeResume(extractedText);
        console.log('Received analysis from Gemini.');

        // --- NEW: Send the AI analysis back to the frontend ---
        res.status(200).json({
            message: 'File processed and analyzed successfully!',
            filename: req.file.originalname,
            analysis: aiAnalysis // This now contains the AI's feedback
        });

    } catch (error) {
        console.error('Error in analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // --- Cleanup: Always delete the file afterwards ---
        fs.unlinkSync(filePath);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});