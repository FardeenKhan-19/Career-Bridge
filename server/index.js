const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const admin = require('firebase-admin');

// --- Firebase Admin Setup ---
// Ensure you have your 'serviceAccountKey.json' in the 'server' folder
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// --- AI Service and Question Imports ---
const { analyzeResume, analyzeAnswer } = require('./geminiService');
const questions = require('./questions');

// --- Multer Configuration ---
// Use memoryStorage for audio files so we can handle them as buffers
const audioStorage = multer.memoryStorage();
const audioUpload = multer({ storage: audioStorage });

// Use diskStorage for resume files as before
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const resumeUpload = multer({ storage: resumeStorage });

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- API Routes ---

app.get('/', (req, res) => res.json({ message: 'Hello from the Career-Bridge backend!' }));

// --- Resume Analysis Route ---
app.post('/api/resume/analyze', resumeUpload.single('resume'), async (req, res) => {
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
            analysis: aiAnalysis
        });
    } catch (error) {
        console.error('Error in analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    } finally {
        fs.unlinkSync(filePath);
    }
});

// --- Interview Question Route ---
app.get('/api/interview/question', (req, res) => {
    const { type, role } = req.query;
    if (!type || !role) return res.status(400).json({ error: 'Interview type and role are required.' });
    const questionSet = questions[type] && questions[type][role];
    if (!questionSet || questionSet.length === 0) return res.status(404).json({ error: 'No questions found.' });
    const randomIndex = Math.floor(Math.random() * questionSet.length);
    res.status(200).json({ question: questionSet[randomIndex] });
});

// --- Text-Based Answer Analysis Route ---
app.post('/api/interview/analyze', async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required.' });
    try {
        const aiFeedback = await analyzeAnswer(question, answer);
        res.status(200).json({ feedback: aiFeedback });
    } catch (error) {
        console.error('Error in text analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- (SIMULATED) Audio/Video Answer Analysis Route ---
app.post('/api/interview/analyze-audio', audioUpload.single('audio'), async (req, res) => {
    const { question } = req.body;
    if (!req.file || !question) return res.status(400).json({ error: 'Audio file and question are required.' });
    try {
        const transcription = "This is a simulated transcription of your recorded answer, demonstrating the complete feature pipeline.";
        const aiFeedback = await analyzeAnswer(question, transcription);
        res.status(200).json({
            feedback: aiFeedback,
            transcription: transcription,
        });
    } catch (error) {
        console.error('Error in audio analysis pipeline:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Save Interview Session Route ---
app.post('/api/interview/session', async (req, res) => {
    const { userId, question, answer, feedback, type, role, mode } = req.body;
    if (!userId || !question || !answer || !feedback) return res.status(400).json({ error: 'Missing required session data.' });
    try {
        const sessionData = { userId, question, answer, feedback, type, role, mode, practicedAt: admin.firestore.FieldValue.serverTimestamp() };
        const docRef = await db.collection('sessions').add(sessionData);
        res.status(201).json({ message: 'Session saved successfully!', id: docRef.id });
    } catch (error) {
        console.error('Error saving session to Firestore:', error);
        res.status(500).json({ error: 'Failed to save session.' });
    }
});

// --- Get Past Sessions Route ---
app.get('/api/interview/sessions/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    try {
        const snapshot = await db.collection('sessions').where('userId', '==', userId).orderBy('practicedAt', 'desc').get();
        if (snapshot.empty) return res.status(200).json([]);
        const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching sessions from Firestore:', error);
        res.status(500).json({ error: 'Failed to fetch sessions.' });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

