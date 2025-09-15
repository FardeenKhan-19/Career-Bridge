require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// --- (analyzeResume and analyzeAnswer functions remain unchanged) ---
async function analyzeResume(resumeText) { /* ... existing code ... */ }
async function analyzeAnswer(question, answer) { /* ... existing code ... */ }


// --- NEW, ADVANCED RESUME REWRITE FUNCTION ---
async function rewriteResume(resumeText, analysis) {
    const prompt = `
        Act as an elite professional resume designer and writer. Your task is to transform a student's resume into a beautiful, modern, and highly effective document based on the provided text and an AI analysis.

        Here is the original resume text:
        ---
        ${resumeText}
        ---

        Here is the AI's analysis and suggestions for improvement:
        ---
        ${analysis}
        ---

        **CRITICAL INSTRUCTIONS:**
        1.  **Structure and Format:** Rewrite the entire resume using clean Markdown. The final output must be ready to be rendered as a beautiful document.
        2.  **Use Professional Sections:** Structure the resume with clear headings like **"Summary"**, **"Skills"**, **"Experience"**, **"Education"**, and **"Projects"**.
        3.  **Enhance with Formatting:**
            * Use **bolding** for all section titles and job titles.
            * Use bullet points (e.g., \`* \` or \`- \`) for job responsibilities and achievements.
            * Ensure clean spacing and professional typography.
        4.  **Content Improvement:**
            * Aggressively implement the suggestions from the provided analysis.
            * Rewrite sentences using strong action verbs (e.g., "Managed", "Engineered", "Launched", "Quantified").
            * Quantify achievements wherever possible (e.g., "Increased user engagement by 20%").
        5.  **Output:** Return **only** the final, rewritten resume in Markdown format. Do not include any extra commentary, introductions, or explanations. The output should be ready to be copied and pasted directly.
    `;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error rewriting resume with Gemini:', error);
        throw new Error('Failed to get rewritten resume from AI service.');
    }
}


module.exports = { analyzeResume, analyzeAnswer, rewriteResume };

