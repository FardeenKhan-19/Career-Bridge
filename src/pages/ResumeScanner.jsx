import React, { useState } from 'react';
import { marked } from 'marked';
import { UploadCloudIcon, FileTextIcon, ClipboardDocumentIcon, SparklesIcon } from '../components/Icons.jsx'; // Simplified imports

// --- CONSTANTS ---
const API_BASE_URL = 'http://localhost:5000'; // <-- IMPROVEMENT: API URL ko ek jagah rakha

// --- Sub-component for rendering the initial AI analysis ---
const AnalysisDisplay = ({ content }) => {
    const htmlContent = marked(content || 'No analysis content received.'); // Added fallback text
    return <div className="prose prose-sm max-w-none text-left mt-4 p-4 bg-gray-100 rounded-md" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

// --- Sub-component for the rewritten resume ---
const FormattedResumeDisplay = ({ markdownContent }) => {
    const htmlContent = marked(markdownContent || '');
    return (
        <div className="text-left bg-white p-8 rounded-lg border border-gray-200 shadow-sm mt-4">
            <div
                className="prose prose-sm max-w-none prose-h2:text-teal-700 prose-h2:border-b prose-h2:pb-2 prose-h2:mt-6 prose-strong:text-gray-800"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};

const ResumeScanner = () => {
    // --- STATE MANAGEMENT ---
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [rewrittenResume, setRewrittenResume] = useState('');

    // --- FILE HANDLING ---
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setUploadResponse(null);
        setError('');
        setRewrittenResume('');
        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                setFile(null);
                setError('Invalid file type. Please upload a PDF or DOCX file.');
            }
        }
    };

    // --- API CALLS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setIsLoading(true);
        setError('');
        setUploadResponse(null);
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const response = await fetch(`${API_BASE_URL}/api/resume/analyze`, { method: 'POST', body: formData });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ error: 'An unknown error occurred on the server.' }));
                throw new Error(errData.error || 'Something went wrong.');
            }
            const result = await response.json();

            // --- IMPORTANT FIX: CHECK YOUR CONSOLE ---
            // Niche waali line aapko browser console mein exact response dikhayegi.
            console.log('✅ Backend Analysis Response:', result); 
            
            setUploadResponse({ success: true, ...result });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoRewrite = async () => {
        if (!uploadResponse?.extractedText || !uploadResponse?.analysis) {
            // Agar data na ho toh user ko batayein
            setError("Cannot improve: Original analysis data is missing.");
            return;
        }
        setIsRewriting(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/resume/rewrite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText: uploadResponse.extractedText,
                    analysis: uploadResponse.analysis,
                }),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ error: 'Rewrite failed on the server.' }));
                throw new Error(errData.error || 'Rewrite failed.');
            }
            const result = await response.json();
            console.log('✅ Backend Rewrite Response:', result);
            // Assuming the key is 'rewrittenText'
            setRewrittenResume(result.rewrittenText);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRewriting(false);
        }
    };

    // --- UTILITY FUNCTIONS ---
    const handleReset = () => {
        setFile(null);
        setUploadResponse(null);
        setError('');
        setRewrittenResume('');
        if (document.getElementById('resume-upload')) {
            document.getElementById('resume-upload').value = null;
        }
    };

    const handleCopyToClipboard = async () => {
        if (!rewrittenResume) return;
        try {
             // <-- IMPROVEMENT: Modern Clipboard API
            await navigator.clipboard.writeText(rewrittenResume);
            alert('Formatted resume text copied to clipboard!');
        } catch (err) {
            console.error('Could not copy text: ', err);
            alert('Failed to copy text.');
        }
    };

    // --- RENDER LOGIC ---
    // (Aapka JSX code bilkul perfect tha, usmein koi change nahi kiya hai)
    return (
        <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">AI Resume Scanner</h1>
                    <p className="text-gray-600 mt-2">Get instant feedback and AI-powered improvements.</p>
                </div>

                {uploadResponse?.success ? (
                    <div className="text-center animate-fade-in">
                        <details className="bg-green-100 border border-green-200 p-4 rounded-lg text-left mb-8">
                            <summary className="font-bold text-green-800 cursor-pointer">View Original AI Analysis</summary>
                            <AnalysisDisplay content={uploadResponse.analysis} />
                        </details>
                        
                        {!rewrittenResume ? (
                            <div className="border-t pt-6">
                                <h3 className="text-xl font-bold text-gray-800">Ready for an Upgrade?</h3>
                                <p className="text-gray-600 mt-2 mb-6">Apply these changes yourself or let our AI create an improved version for you.</p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button onClick={handleReset} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700">Scan New Resume</button>
                                    <button onClick={handleAutoRewrite} disabled={isRewriting} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 inline-flex items-center justify-center gap-2 disabled:bg-gray-400">
                                        <SparklesIcon className={`w-5 h-5 ${isRewriting ? 'animate-spin' : ''}`}/>
                                        {isRewriting ? 'Improving...' : 'Improve it with AI'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t pt-6">
                                <h3 className="text-2xl font-bold text-gray-800">Your AI-Improved Resume</h3>
                                <FormattedResumeDisplay markdownContent={rewrittenResume} />
                                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                                    <button onClick={handleCopyToClipboard} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 inline-flex items-center justify-center gap-2">
                                        <ClipboardDocumentIcon className="w-5 h-5"/>
                                        Copy Formatted Text
                                    </button>
                                    <button onClick={handleReset} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700">Start Over</button>
                                </div>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full">
                        {/* Form JSX is unchanged */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-teal-500 transition-colors">
                            <input type="file" id="resume-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" disabled={isLoading} />
                            <label htmlFor="resume-upload" className={`cursor-pointer flex flex-col items-center ${isLoading ? 'opacity-50' : ''}`}>
                                <UploadCloudIcon className="w-16 h-16 text-gray-400 mb-4" />
                                <span className="text-teal-600 font-semibold">Click to upload</span>
                                <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                            </label>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        {file && (
                            <div className="mt-6 bg-teal-50 border border-teal-200 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3"><FileTextIcon className="text-teal-600" /><span>{file.name}</span></div>
                                <button type="button" onClick={handleReset} className="text-gray-500 hover:text-red-600 font-semibold py-1 px-2 rounded-md" title="Remove Resume">Remove</button>
                            </div>
                        )}
                        <div className="mt-8 text-center">
                            <button type="submit" disabled={!file || isLoading} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResumeScanner;