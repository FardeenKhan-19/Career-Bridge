import React, { useState } from 'react';
import { VideoCameraIcon, ChevronDownIcon } from '../components/Icons.jsx'; // Make sure to add these icons

const InterviewCoach = () => {
    // We will use state later to manage the user's selections
    const [interviewType, setInterviewType] = useState('behavioral');
    const [jobRole, setJobRole] = useState('software-engineer');

    return (
        <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">AI Interview Coach</h1>
                    <p className="text-gray-600 mt-2">
                        Practice common interview questions and get instant feedback on your answers.
                    </p>
                </div>

                {/* --- SETUP SECTION --- */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Prepare Your Practice Session</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Interview Type Selection */}
                        <div>
                            <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Type
                            </label>
                            <div className="relative">
                                <select 
                                    id="interviewType"
                                    value={interviewType}
                                    onChange={(e) => setInterviewType(e.target.value)}
                                    className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 pr-8 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="behavioral">Behavioral Questions</option>
                                    <option value="technical">Technical Questions</option>
                                    <option value="situational">Situational Questions</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Job Role Selection */}
                        <div>
                            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">
                                Target Job Role
                            </label>
                            <div className="relative">
                                <select 
                                    id="jobRole"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 pr-8 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="software-engineer">Software Engineer</option>
                                    <option value="product-manager">Product Manager</option>
                                    <option value="data-analyst">Data Analyst</option>
                                    <option value="marketing-specialist">Marketing Specialist</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <button className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 inline-flex items-center gap-3">
                            <VideoCameraIcon className="w-6 h-6"/>
                            Start Practice Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewCoach;
