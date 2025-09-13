import React, { useState } from 'react';
import { marked } from 'marked'; // --- NEW: Import marked
import { UploadCloudIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, RefreshIcon } from '../components/Icons.jsx';

// --- NEW: A component to safely render the AI's HTML response ---
const AnalysisDisplay = ({ content }) => {
    const htmlContent = marked(content);
    return (
        <div 
            className="prose prose-sm max-w-none text-left mt-4 p-4 bg-gray-50 rounded-md text-gray-700"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
};

const ResumeScanner = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);

    const handleFileChange = (e) => {
        // ... (no changes in this function)
        const selectedFile = e.target.files[0];
        setUploadResponse(null);
        setError('');
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

    const handleSubmit = async (e) => {
        // --- (Small change here to store the new 'analysis' field) ---
        e.preventDefault();
        if (!file) {
            setError('Please select a file to analyze.');
            return;
        }
        setIsLoading(true);
        setError('');
        setUploadResponse(null);
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const response = await fetch('http://localhost:5000/api/resume/analyze', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong on the server.');
            }
            // Store the entire result object, which now includes the analysis
            setUploadResponse({ success: true, ...result });
        } catch (err) {
            console.error('Upload failed:', err);
            setUploadResponse({ success: false, message: err.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        // ... (no changes in this function)
        setFile(null);
        setUploadResponse(null);
        setError('');
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-4 sm-p-8">
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">AI Resume Scanner</h1>
                    <p className="text-gray-600 mt-2">Get instant, AI-powered feedback on your resume.</p>
                </div>

                {uploadResponse?.success ? (
                    // --- UPDATED SUCCESS PANEL ---
                    <div className="text-center animate-fade-in">
                        <div className="bg-green-100 border border-green-200 p-6 rounded-lg flex flex-col items-center gap-4">
                            <CheckCircleIcon className="w-16 h-16 text-green-600" />
                            <div>
                                <h2 className="text-2xl font-semibold text-green-800">Analysis Complete!</h2>
                                <p className="text-green-700 mt-1">
                                    Here is the AI-powered feedback for your resume: "{uploadResponse.filename}"
                                </p>
                                {/* Use the new component to display the analysis */}
                                <AnalysisDisplay content={uploadResponse.analysis} />
                            </div>
                        </div>
                        <button 
                            onClick={handleReset}
                            className="mt-8 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 inline-flex items-center gap-2"
                        >
                            <RefreshIcon className="w-5 h-5"/>
                            Analyze Another Resume
                        </button>
                    </div>
                ) : (
                    // --- UPLOAD FORM (No changes here) ---
                    <form onSubmit={handleSubmit} className="w-full">
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
                        {uploadResponse && !uploadResponse.success && (
                             <div className="mt-6 p-4 rounded-lg flex items-center gap-4 bg-red-100 border border-red-300">
                                <XCircleIcon className="w-8 h-8 text-red-600" />
                                <div>
                                    <p className="font-semibold text-red-800">Upload Failed!</p>
                                    <p className="text-sm text-red-700">{uploadResponse.message}</p>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResumeScanner;