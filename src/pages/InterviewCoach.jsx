import React, { useState, useRef, useEffect } from 'react';
import { 
    VideoCameraIcon, ChevronDownIcon, StopIcon, ArrowPathIcon, XCircleIcon, 
    MicrophoneIcon, PlayIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon 
} from '../components/Icons.jsx'; // Add new icons

// --- Helper Component for Mode Selection ---
const ModeSelector = ({ selectedMode, setMode }) => {
    const modes = [
        { key: 'video', icon: <VideoCameraIcon className="w-8 h-8" />, label: 'Video & Audio', description: 'Practice on camera.' },
        { key: 'audio', icon: <MicrophoneIcon className="w-8 h-8" />, label: 'Audio Only', description: 'Practice speaking.' },
        { key: 'text', icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />, label: 'Text Only', description: 'Type your answer.' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modes.map(mode => (
                <button
                    key={mode.key}
                    type="button"
                    onClick={() => setMode(mode.key)}
                    className={`p-6 text-center border-2 rounded-lg transition-all duration-200 ${selectedMode === mode.key ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-gray-300 bg-white hover:border-teal-400'}`}
                >
                    <div className="flex justify-center text-gray-600 mb-3">{mode.icon}</div>
                    <p className="font-bold text-gray-800">{mode.label}</p>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                </button>
            ))}
        </div>
    );
};


const InterviewCoach = () => {
    // --- Setup State ---
    const [interviewType, setInterviewType] = useState('behavioral');
    const [jobRole, setJobRole] = useState('software-engineer');
    const [practiceMode, setPracticeMode] = useState('video'); // 'video', 'audio', or 'text'
    
    // --- Session State ---
    const [sessionStarted, setSessionStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [error, setError] = useState('');

    // --- Recording & Text State ---
    const [isRecording, setIsRecording] = useState(false);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [textAnswer, setTextAnswer] = useState('');

    // --- Refs ---
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    // --- Core Functions ---
    const fetchQuestion = async () => {
        setIsLoading(true);
        setError('');
        setCurrentQuestion('');
        setMediaUrl(null);
        setTextAnswer('');
        try {
            const response = await fetch(`http://localhost:5000/api/interview/question?type=${interviewType}&role=${jobRole}`);
            if (!response.ok) throw new Error('Failed to fetch question.');
            const data = await response.json();
            setCurrentQuestion(data.question);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStartSession = async () => {
        await fetchQuestion();
        
        // Only request media for audio/video modes
        if (practiceMode === 'video' || practiceMode === 'audio') {
            try {
                const constraints = {
                    video: practiceMode === 'video',
                    audio: true
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                streamRef.current = stream;
            } catch (err) {
                setError("Could not access media devices. Please check permissions.");
                return; // Stop if permission is denied
            }
        }
        setSessionStarted(true);
    };

    const handleEndSession = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setSessionStarted(false);
    };

    // --- Recording & Submission Logic ---
    const handleStartRecording = () => {
        if (streamRef.current) {
            recordedChunksRef.current = [];
            const mimeType = practiceMode === 'video' ? 'video/webm' : 'audio/webm';
            mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
            mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: mimeType });
                setMediaUrl(URL.createObjectURL(blob));
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSubmitTextAnswer = () => {
        console.log("Submitting text answer:", textAnswer);
        // This is where you would send the textAnswer to an AI for feedback
        alert("Your text answer has been submitted for feedback!");
    };

    // Cleanup effect
    useEffect(() => {
        return () => { if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop()); };
    }, []);

    // --- Main Render Logic ---
    return (
        <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">AI Interview Coach</h1>
                    <p className="text-gray-600 mt-2">{sessionStarted ? "Focus and deliver your best answer." : "Practice and get AI-powered feedback."}</p>
                </div>

                {!sessionStarted ? (
                    // --- SETUP VIEW ---
                    <div className="space-y-8">
                        <div>
                             <label className="block text-lg font-bold text-gray-800 mb-4 text-center">1. Choose Your Practice Mode</label>
                             <ModeSelector selectedMode={practiceMode} setMode={setPracticeMode} />
                        </div>
                        <div className="border-t pt-8">
                            <label className="block text-lg font-bold text-gray-800 mb-4 text-center">2. Select Your Interview Focus</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                                    <div className="relative"><select id="interviewType" value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 pr-8 focus:ring-teal-500 focus:border-teal-500"><option value="behavioral">Behavioral</option><option value="technical">Technical</option><option value="situational">Situational</option></select><ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
                                </div>
                                <div>
                                    <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">Target Job Role</label>
                                    <div className="relative"><select id="jobRole" value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 pr-8 focus:ring-teal-500 focus:border-teal-500"><option value="software-engineer">Software Engineer</option><option value="product-manager">Product Manager</option><option value="data-analyst">Data Analyst</option><option value="marketing-specialist">Marketing Specialist</option></select><ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        <div className="mt-8 text-center">
                            <button onClick={handleStartSession} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 inline-flex items-center gap-3"><PlayIcon className="w-6 h-6"/>Start Practice Session</button>
                        </div>
                    </div>
                ) : (
                    // --- PRACTICE VIEW ---
                    <div className="animate-fade-in">
                        {/* --- Question Display --- */}
                        <div className="mb-6 bg-gray-50 p-6 rounded-lg text-center border">
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Question:</h3>
                            {isLoading ? <p className="text-xl text-gray-500 animate-pulse">Loading...</p> : <p className="text-2xl font-bold text-gray-800">{currentQuestion}</p>}
                        </div>

                        {/* --- DYNAMIC INPUT AREA --- */}
                        {practiceMode === 'video' && (
                            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-300 relative"><video ref={videoRef} autoPlay={!mediaUrl} muted playsInline controls={!!mediaUrl} src={mediaUrl || ''} className="w-full h-auto"></video></div>
                        )}
                        {practiceMode === 'audio' && !mediaUrl && (
                             <div className="bg-gray-100 rounded-lg p-8 text-center"><MicrophoneIcon className={`w-16 h-16 mx-auto ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} /><p className="mt-4 text-gray-600">{isRecording ? "Recording your audio..." : "Prepare to record your answer."}</p></div>
                        )}
                         {practiceMode === 'audio' && mediaUrl && (
                             <div className="p-8"><audio src={mediaUrl} controls className="w-full"></audio></div>
                        )}
                        {practiceMode === 'text' && (
                            <div><textarea value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} placeholder="Type your answer here..." className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"></textarea></div>
                        )}
                        
                        {/* --- Review & Submit Panels --- */}
                        {mediaUrl && (
                             <div className="mt-6 bg-teal-50 p-4 rounded-lg text-center border border-teal-200"><h3 className="text-xl font-bold text-teal-800">Review Your Answer</h3><p className="text-gray-600 mt-1">Submit your recording for AI feedback.</p></div>
                        )}

                        {/* --- Action Buttons --- */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {practiceMode !== 'text' && !isRecording && !mediaUrl && <button onClick={handleStartRecording} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 inline-flex items-center justify-center gap-2"><MicrophoneIcon className="w-6 h-6"/>Record Answer</button>}
                            {isRecording && <button onClick={handleStopRecording} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 inline-flex items-center justify-center gap-2 animate-pulse"><StopIcon className="w-6 h-6"/>Stop Recording</button>}
                            {practiceMode === 'text' && <button onClick={handleSubmitTextAnswer} disabled={!textAnswer} className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:bg-gray-400"><PaperAirplaneIcon className="w-6 h-6"/>Submit Answer</button>}
                            {mediaUrl && <button className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 inline-flex items-center justify-center gap-2"><PaperAirplaneIcon className="w-6 h-6"/>Submit for Feedback</button>}
                            
                            <button onClick={fetchQuestion} disabled={isLoading || isRecording} className="w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:bg-gray-400"><ArrowPathIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`}/>New Question</button>
                            <button onClick={handleEndSession} className="w-full sm:w-auto bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300 inline-flex items-center justify-center gap-2"><XCircleIcon className="w-6 h-6"/>End Session</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewCoach;

