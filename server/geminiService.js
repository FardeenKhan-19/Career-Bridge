// server/geminiService.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function analyzeResume(resumeText) {
    // This is our instruction to the AI. It's the most important part.
    const prompt = `
        Act as an expert career coach and resume reviewer.
        Analyze the following resume text and provide a concise, actionable critique in three sections.
        Use Markdown for formatting.

        **1. First Impressions:**
        Provide a one-sentence summary of the candidate's professional profile based on the resume.

        **2. Strengths:**
        In 2-3 bullet points, list the strongest aspects of this resume. For example, "Strong quantifiable results in the experience section," or "Clear and concise summary."

        **3. Areas for Improvement:**
        In 2-3 bullet points, list the most critical areas that need improvement. Be specific and provide examples. For example, "The skills section could be more specific. Instead of 'communication,' use 'Public Speaking' or 'Technical Writing.'" or "Action verbs are weak. Replace 'Responsible for' with stronger verbs like 'Managed,' 'Led,' or 'Implemented.'"

        ---
        RESUME TEXT:
        ${resumeText}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const analysis = response.text();
        return analysis;
    } catch (error) {
        console.error('Error analyzing resume with Gemini:', error);
        throw new Error('Failed to get analysis from AI service.');
    }
}

module.exports = { analyzeResume };