import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import {
    VideoCameraIcon, ChevronDownIcon, StopIcon, ArrowPathIcon, XCircleIcon,
    MicrophoneIcon, PlayIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon, CheckCircleIcon
} from '../components/Icons.jsx';


const API_BASE_URL = 'http://localhost:5000';
// --- Sub-component for displaying the mode selection ---
const ModeSelector = ({ selectedMode, setMode }) => {
    const modes = [
        { key: 'video', icon: <VideoCameraIcon className="w-8 h-8" />, label: 'Video & Audio', description: 'Practice on camera.' },
        { key: 'audio', icon: <MicrophoneIcon className="w-8 h-8" />, label: 'Audio Only', description: 'Practice speaking.' },
        { key: 'text', icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />, label: 'Text Only', description: 'Type your answer.' }
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modes.map(mode => (
                <button key={mode.key} type="button" onClick={() => setMode(mode.key)} className={`p-6 text-center border-2 rounded-lg transition-all duration-200 ${selectedMode === mode.key ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-gray-300 bg-white hover:border-teal-400'}`}>
                    <div className="flex justify-center text-gray-600 mb-3">{mode.icon}</div>
                    <p className="font-bold text-gray-800">{mode.label}</p>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                </button>
            ))}
        </div>
    );
};

// --- Sub-component for rendering AI feedback ---
const AnalysisDisplay = ({ content }) => {
    const htmlContent = marked(content);
    return <div className="prose prose-sm max-w-none text-left mt-4 p-4 bg-gray-100 rounded-md" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


const InterviewCoach = () => {
    // --- STATE MANAGEMENT ---
    const [interviewType, setInterviewType] = useState('behavioral');
    const [jobRole, setJobRole] = useState('software-engineer');
    const [practiceMode, setPracticeMode] = useState('video');
    const [sessionStarted, setSessionStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [error, setError] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [textAnswer, setTextAnswer] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [aiFeedback, setAiFeedback] = useState('');

    // --- REFS ---
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    // --- CORE LOGIC ---
    const fetchQuestion = async () => {
        setIsLoading(true);
        setError('');
        setCurrentQuestion('');
        setMediaUrl(null);
        setTextAnswer('');
        setSubmissionStatus(null);
        setAiFeedback('');
        try {
            const response = await fetch(`http://localhost:5000/api/interview/question?type=${interviewType}&role=${jobRole}`);
            if (!response.ok) throw new Error('Failed to fetch question from server.');
            const data = await response.json();
            setCurrentQuestion(data.question);
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    const handleStartSession = async () => {
        setSessionStarted(true);
        await fetchQuestion();
        if (practiceMode === 'video' || practiceMode === 'audio') {
            try {
                const constraints = { video: practiceMode === 'video', audio: true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(e => console.error("Video play failed:", e));
                }
            } catch (err) {
                setError("Could not access media devices. Please check browser permissions.");
                setSessionStarted(false);
            }
        }
    };

    const handleEndSession = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setSessionStarted(false);
        setError('');
        setCurrentQuestion('');
        setSubmissionStatus(null);
    };

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
            if (practiceMode === 'video' && streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                if (videoRef.current) videoRef.current.srcObject = null;
            }
        }
    };

    const handleSubmitRecording = async () => {
        setSubmissionStatus('submitting');
        // Placeholder for future speech-to-text integration
        setTimeout(() => {
            setAiFeedback("Feedback for audio and video answers is a feature coming soon! This requires a speech-to-text service to transcribe your response for analysis.");
            setSubmissionStatus('success');
        }, 1500);
    };

    // --- Is poore function ko copy karke purane waale se badal dein ---
    const handleSubmitTextAnswer = async () => {
        // Check karein ki answer khali na ho
        if (!textAnswer.trim()) {
            setError("Answer cannot be empty.");
            return;
        }
        // States ko reset karein
        setSubmissionStatus('submitting');
        setAiFeedback('');
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/interview/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion,
                    answer: textAnswer,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to get feedback from the server.');
            }

            const data = await response.json();

            // Console mein exact response dekhein taaki key ka naam pata chale
            console.log('✅ Interview Feedback Response:', data);

            // Smartly check karein ki key 'feedback' hai ya 'analysis'
            const feedbackText = data.feedback || data.analysis || 'Could not find feedback text in the response.';

            setAiFeedback(feedbackText);
            setSubmissionStatus('success');

        } catch (err) {
            setSubmissionStatus('error');
            setError(err.message);
        }
    };

    useEffect(() => {
        return () => { if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop()); };
    }, []);

    // --- JSX RENDER ---
    return (
        <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">AI Interview Coach</h1>
                    <p className="text-gray-600 mt-2">{sessionStarted ? "Focus and deliver your best answer." : "Practice and get AI-powered feedback."}</p>
                </div>

                {!sessionStarted ? (
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
                                    <div className="relative"><select id="interviewType" value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 pr-8 focus:ring-teal-500 focus:border-teal-500"><option value="behavioral">Behavioral</option><option value="technical">Technical</option></select><ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
                                </div>
                                <div>
                                    <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">Target Job Role</label>
                                    <div className="relative"><select id="jobRole" value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 pr-8 focus:ring-teal-500 focus:border-teal-500"><option value="software-engineer">Software Engineer</option><option value="product-manager">Product Manager</option><option value="data-analyst">Data Analyst</option></select><ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        <div className="mt-8 text-center">
                            <button onClick={handleStartSession} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 inline-flex items-center gap-3"><PlayIcon className="w-6 h-6" />Start Practice Session</button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {submissionStatus === 'success' || submissionStatus === 'error' ? (
                            <div className="text-center">
                                <div className={`${submissionStatus === 'success' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'} border p-6 rounded-lg`}>
                                    <div className="flex flex-col items-center gap-4">
                                        {submissionStatus === 'success' ? <CheckCircleIcon className="w-16 h-16 text-green-600" /> : <XCircleIcon className="w-16 h-16 text-red-600" />}
                                        <h2 className={`text-2xl font-semibold ${submissionStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                            {submissionStatus === 'success' ? 'Answer Submitted!' : 'An Error Occurred'}
                                        </h2>
                                        <p className="text-gray-600">
                                            {submissionStatus === 'success' ? 'Here is your AI-powered feedback:' : error}
                                        </p>
                                    </div>
                                    {submissionStatus === 'success' && <AnalysisDisplay content={aiFeedback} />}
                                </div>
                                <button onClick={handleEndSession} className="mt-8 bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700">Practice Again</button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 bg-gray-50 p-6 rounded-lg text-center border">
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Question:</h3>
                                    {isLoading ? <p className="text-xl text-gray-500 animate-pulse">Loading...</p> : <p className="text-2xl font-bold text-gray-800">{currentQuestion}</p>}
                                </div>

                                {practiceMode === 'video' && <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-300 relative"><video ref={videoRef} autoPlay={!mediaUrl} muted playsInline controls={!!mediaUrl} src={mediaUrl || ''} className="w-full h-auto"></video></div>}
                                {practiceMode === 'audio' && !mediaUrl && (<div className="bg-gray-100 rounded-lg p-8 text-center"><MicrophoneIcon className={`w-16 h-16 mx-auto ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} /><p className="mt-4 text-gray-600">{isRecording ? "Recording..." : "Prepare to record."}</p></div>)}
                                {practiceMode === 'audio' && mediaUrl && (<div className="p-8"><audio src={mediaUrl} controls className="w-full"></audio></div>)}
                                {practiceMode === 'text' && (<div><textarea value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} placeholder="Type your answer here..." className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"></textarea></div>)}

                                {mediaUrl && (<div className="mt-6 bg-teal-50 p-4 rounded-lg text-center border border-teal-200"><h3 className="text-xl font-bold text-teal-800">Review Your Answer</h3><p className="text-gray-600 mt-1">Submit your recording for feedback.</p></div>)}

                                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    {practiceMode !== 'text' && !isRecording && !mediaUrl && <button onClick={handleStartRecording} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700"><MicrophoneIcon className="w-6 h-6 inline-block mr-2" />Record</button>}
                                    {isRecording && <button onClick={handleStopRecording} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 animate-pulse"><StopIcon className="w-6 h-6 inline-block mr-2" />Stop</button>}
                                    {mediaUrl && <button onClick={handleSubmitRecording} disabled={submissionStatus === 'submitting'} className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-400"><PaperAirplaneIcon className="w-6 h-6 inline-block mr-2" />{submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Recording'}</button>}
                                    {practiceMode === 'text' && <button onClick={handleSubmitTextAnswer} disabled={!textAnswer || submissionStatus === 'submitting'} className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-400"><PaperAirplaneIcon className="w-6 h-6 inline-block mr-2" />{submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Answer'}</button>}
                                    <button onClick={fetchQuestion} disabled={isLoading || isRecording} className="w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400"><ArrowPathIcon className={`w-6 h-6 inline-block mr-2 ${isLoading ? 'animate-spin' : ''}`} />New Question</button>
                                    <button onClick={handleEndSession} className="w-full sm:w-auto bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-400"><XCircleIcon className="w-6 h-6 inline-block mr-2" />End Session</button>
                                </div>
                            </>
                        )}
                        {submissionStatus === 'error' && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewCoach;

/* */