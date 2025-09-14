require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// --- Existing function for resume analysis ---
async function analyzeResume(resumeText) {
    const prompt = `
        Act as an expert career coach and resume reviewer.
        Analyze the following resume text and provide a concise, actionable critique in three sections.
        Use Markdown for formatting.

        **1. First Impressions:**
        Provide a one-sentence summary of the candidate's professional profile based on the resume.

        **2. Strengths:**
        In 2-3 bullet points, list the strongest aspects of this resume.

        **3. Areas for Improvement:**
        In 2-3 bullet points, list the most critical areas that need improvement. Be specific and provide examples.
        ---
        RESUME TEXT:
        ${resumeText}
    `;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error analyzing resume with Gemini:', error);
        throw new Error('Failed to get analysis from AI service.');
    }
}


// --- NEW FUNCTION for interview answer analysis ---
async function analyzeAnswer(question, answer) {
    const prompt = `
        As an expert interview coach, analyze an answer to an interview question.
        The user was asked the following question:
        **Question:** "${question}"

        They provided this answer:
        **Answer:** "${answer}"

        Please provide feedback in Markdown format with the following three sections:

        **1. Overall Feedback:**
        Start with a brief, one-paragraph summary of the answer's effectiveness.

        **2. Strengths:**
        In bullet points, identify what the candidate did well. For example, "Clearly stated the situation," or "Quantified the result effectively."

        **3. Areas for Improvement:**
        In bullet points, provide specific, actionable advice on how to make the answer stronger. For example, "The answer could be more structured. Consider using the STAR method (Situation, Task, Action, Result)," or "Try to be more concise in the 'Task' description."
    `;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error analyzing answer with Gemini:', error);
        throw new Error('Failed to get answer analysis from AI service.');
    }
}


module.exports = { analyzeResume, analyzeAnswer };
