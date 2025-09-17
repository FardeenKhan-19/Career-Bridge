// server/geminiService.js

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Sahi model ka naam istemaal karein
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * AI se resume ka analysis karwata hai.
 */
async function analyzeResume(resumeText) {
    console.log("Sending resume text to Gemini for analysis...");
    const prompt = `You are an expert HR professional. Analyze the following resume text and provide a concise, actionable critique in Markdown format. Focus on clarity, impact, action verbs, and ATS optimization. Here is the resume text: --- ${resumeText} ---`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = await response.text();
        console.log("Successfully received analysis from Gemini.");
        return analysisText;
    } catch (error) {
        console.error("!!! ERROR in analyzeResume !!!", error);
        throw new Error('Failed to get analysis from AI service.');
    }
}

/**
 * AI se resume ko rewrite karwata hai.
 */
async function rewriteResume(resumeText, analysis) {
    console.log("Sending text to Gemini for rewriting...");
    const prompt = `You are a professional resume writer. Rewrite the following resume based on the provided analysis. Improve the language, use stronger action verbs, and format it clearly using Markdown. Original Resume: --- ${resumeText} --- Analysis: --- ${analysis} --- Rewrite the resume below.`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rewrittenText = await response.text();
        console.log("Successfully received rewritten resume from Gemini.");
        return rewrittenText;
    } catch (error) {
        console.error("!!! ERROR in rewriteResume !!!", error);
        throw new Error('Failed to rewrite resume with AI.');
    }
}

/**
 * AI se interview answer ka feedback leta hai. (Yeh NAYA function hai)
 */
async function analyzeAnswer(question, answer) {
    console.log("Sending answer to Gemini for feedback...");
    const prompt = `
        You are a professional interview coach.
        The user was asked the following interview question: "${question}"
        The user gave the following answer: "${answer}"

        Please provide constructive feedback on the user's answer in Markdown format.
        Analyze the answer based on the STAR (Situation, Task, Action, Result) method where applicable.
        Focus on clarity, confidence, and the relevance of the answer to the question.
        Provide specific suggestions for improvement.
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedbackText = await response.text();
        console.log("Successfully received feedback from Gemini.");
        return feedbackText;
    } catch (error) {
        console.error("!!! ERROR in analyzeAnswer !!!", error);
        throw new Error('Failed to get feedback from AI service.');
    }
}


// Aakhir mein, teeno functions ko export karein
module.exports = { 
    analyzeResume, 
    rewriteResume, 
    analyzeAnswer // <-- analyzeAnswer ko yahan add karna zaroori hai
};