const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config(); // Ensure .env variables are loaded

const { analyzeResume, analyzeAnswer, rewriteResume } = require('./geminiService');
const questions = require('./questions');

// --- START: BULLETPROOF FILE HANDLING SETUP ---

// 1. Define an absolute path for the 'uploads' directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// 2. Ensure the 'uploads' directory exists when the server starts
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
    console.log(`Created directory: ${UPLOADS_DIR}`);
}

// 3. Configure multer to use the absolute path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Use the absolute path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// --- END: BULLETPROOF FILE HANDLING SETUP ---


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: 'Hello from the backend!' }));

// --- Resume Analysis Route (CORRECTED) ---
app.post('/api/resume/analyze', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Since multer was configured with an absolute path, req.file.path is now guaranteed to be correct.
    const filePath = req.file.path;
    
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
            // Clean up the unsupported file
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' });
        }

        const aiAnalysis = await analyzeResume(extractedText);
     
        res.status(200).json({
            message: 'File processed and analyzed successfully!',
            filename: req.file.originalname,
            analysis: aiAnalysis,
            extractedText: extractedText
        });

    } catch (error) {
        console.error('Error in analysis pipeline:', error);
        res.status(500).json({ error: error.message || 'An internal server error occurred during analysis.' });
    } finally {
        // Ensure the file is always deleted after processing
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

// --- Resume Rewrite Route ---
app.post('/api/resume/rewrite', async (req, res) => {
    const { resumeText, analysis } = req.body;
    if (!resumeText || !analysis) {
        return res.status(400).json({ error: 'Original resume text and analysis are required.' });
    }
    try {
        const rewrittenText = await rewriteResume(resumeText, analysis);
        res.status(200).json({ rewrittenText });
    } catch (error) {
        console.error('Error in resume rewrite pipeline:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Interview Question Route ---
app.get('/api/interview/question', (req, res) => {
    try {
        const { type = 'behavioral', role = 'software-engineer' } = req.query;
        if (!questions[role] || !questions[role][type]) {
            return res.status(404).json({ error: 'Questions not found for the specified role or type.' });
        }
        const questionList = questions[role][type];
        const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
        res.json({ question: randomQuestion });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch a question.' });
    }
});

// --- Interview Analysis Route ---
app.post('/api/interview/analyze', async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required.' });
    }
    try {
        const feedback = await analyzeAnswer(question, answer);
        res.json({ feedback: feedback });
    } catch (error) {
        console.error('Error in answer analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});