const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// --- AI Service and Question Imports ---
const { analyzeResume } = require('./geminiService');
const questions = require('./questions'); // <-- Import the questions database

// --- Multer Configuration (no changes) ---
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

// --- Resume Analysis Route (no changes) ---
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

        const aiAnalysis = await analyzeResume(extractedText);

        res.status(200).json({
            message: 'File processed and analyzed successfully!',
            filename: req.file.originalname,
            analysis: aiAnalysis
        });
    } catch (error) {
        console.error('Error in analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    } finally {
        fs.unlinkSync(filePath);
    }
});


// ======================= ADD THIS NEW SECTION =======================
// --- CORRECTED INTERVIEW QUESTIONS ROUTE ---
app.get('/api/interview/question', (req, res) => {
    const { type, role } = req.query; // e.g., type='behavioral', role='software-engineer'

    if (!type || !role) {
        return res.status(400).json({ error: 'Interview type and role are required.' });
    }

    const questionSet = questions[type] && questions[type][role];

    if (!questionSet || questionSet.length === 0) {
        return res.status(404).json({ error: 'No questions found for the selected criteria.' });
    }

    // Select a random question from the set
    const randomIndex = Math.floor(Math.random() * questionSet.length);
    const question = questionSet[randomIndex];

    res.status(200).json({ question });
});
// ====================================================================


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

