const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const { analyzeResume, analyzeAnswer, rewriteResume } = require('./geminiService');
const questions = require('./questions');

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

// --- UPDATED Resume Analysis Route ---
app.post('/api/resume/analyze', upload.single('resume'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
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
            analysis: aiAnalysis,
            extractedText: extractedText // <-- CRUCIAL: Send the extracted text to the frontend
        });
    } catch (error) {
        console.error('Error in analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    } finally {
        fs.unlinkSync(filePath);
    }
});

app.post('/api/resume/rewrite', async (req, res) => {
    const { resumeText, analysis } = req.body;
    if (!resumeText || !analysis) return res.status(400).json({ error: 'Original resume text and analysis are required.' });
    try {
        const rewrittenText = await rewriteResume(resumeText, analysis);
        res.status(200).json({ rewrittenText });
    } catch (error) {
        console.error('Error in resume rewrite pipeline:', error);
        res.status(500).json({ error: error.message });
    }
});


// (Other routes for interview coach remain the same)
app.get('/api/interview/question', (req, res) => { /* ... existing code ... */ });
app.post('/api/interview/analyze', async (req, res) => { /* ... existing code ... */ });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

