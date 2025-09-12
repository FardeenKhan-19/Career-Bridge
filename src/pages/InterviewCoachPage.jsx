import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserCircleIcon } from '../components/Icons.jsx';

// --- Gemini API Call Helper ---
async function runGemini(history, message, systemPrompt) {
    const apiKey = "AIzaSyC2ETklkpW0ci9Mtrg_xAufEFBt-Sc6VXw";

    if (apiKey === "PASTE_YOUR_GOOGLE_API_KEY_HERE") {
        return "API Key not configured. Please add your key in InterviewCoachPage.jsx";
    }

    const model = 'gemini-2.5-flash-preview-05-20';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const conversation = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const payload = {
        contents: [...conversation, { role: 'user', parts: [{ text: message }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        const candidate = result.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
        }
        console.error("Gemini API Response Error:", result);
        return "Sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "There was an error connecting to the AI. Please check the console.";
    }
}


export default function InterviewCoachPage() {
    const { user } = useAuth();
    const [jobRole, setJobRole] = useState('Software Engineer');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const chatEndRef = useRef(null);

    const systemPrompt = `You are an expert interview coach for a platform called CareerBridge. Your name is "BridgeBot". Your user is preparing for a job interview for a "${jobRole}" position. 
    1. Start the conversation by introducing yourself and asking the user if they're ready to begin their mock interview.
    2. Ask one behavioral or technical question at a time that is relevant to the specified job role.
    3. After the user answers, provide brief, constructive, and encouraging feedback on their response.
    4. Conclude your feedback by asking the next logical interview question.
    5. Maintain a professional, friendly, and supportive tone throughout the conversation.`;

    const startSession = async () => {
        setSessionStarted(true);
        setIsLoading(true);
        const initialResponse = await runGemini([], "Let's start the interview.", systemPrompt);
        setMessages([{ sender: 'ai', text: initialResponse }]);
        setIsLoading(false);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await runGemini(messages, input, systemPrompt);
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
        setIsLoading(false);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">AI Interview Coach</h1>

            {!sessionStarted ? (
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Prepare for your next interview!</h2>
                    <p className="text-gray-600 mt-2">Select a job role you'd like to practice for.</p>
                    <select
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        className="mt-4 block w-full md:w-1/2 mx-auto p-2 border border-gray-300 rounded-md"
                    >
                        <option>Software Engineer</option>
                        <option>Product Manager</option>
                        <option>Data Analyst</option>
                        <option>UX/UI Designer</option>
                    </select>
                    <button onClick={startSession} className="mt-6 bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-700">
                        Start Practice Session
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg flex flex-col h-[70vh]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 my-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-10 w-10 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-gray-300' : 'bg-teal-500'} flex items-center justify-center text-white font-bold`}>
                                    {msg.sender === 'user' ? <UserCircleIcon /> : 'B'}
                                </div>
                                <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-teal-50'}`}>
                                    <p className="text-gray-800 whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="text-center text-gray-500">BridgeBot is typing...</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="p-4 border-t flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your answer..."
                            className="flex-1 p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400" disabled={isLoading}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

