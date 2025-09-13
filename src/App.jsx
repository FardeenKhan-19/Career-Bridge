import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Layout & Route Components ---
import AppLayout from './components/Layout.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';


// --- Page Components ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { ProfilePage, NotFoundPage } from './pages/OtherPages.jsx';
import { AboutUsPage, ContactPage, PrivacyPolicyPage } from './pages/StaticPages.jsx';
import PostJobPage from './pages/PostJobPage.jsx';
import ViewJobsPage from './pages/ViewJobsPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import EditJobPage from './pages/EditJobPage.jsx';
import ManageJobsPage from './pages/ManageJobsPage.jsx';
import ApplicantsPage from './pages/ApplicantsPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import MyCoursesPage from './pages/MyCoursesPage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import InterviewCoachPage from './pages/InterviewCoachPage.jsx';
import CandidateSearchPage from './pages/CandidateSearchPage.jsx';
import ResumeScanner from './pages/ResumeScanner';
import InterviewCoach from './pages/InterviewCoach';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Routes with the animated auth layout */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

                {/* Routes with the main application layout (header/footer) */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Job Routes */}
                    <Route path="/post-job" element={<ProtectedRoute><PostJobPage /></ProtectedRoute>} />
                    <Route path="/edit-job/:jobId" element={<ProtectedRoute><EditJobPage /></ProtectedRoute>} />
                    <Route path="/jobs" element={<ProtectedRoute><ViewJobsPage /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
                    <Route path="/manage-jobs" element={<ProtectedRoute><ManageJobsPage /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId/applicants" element={<ProtectedRoute><ApplicantsPage /></ProtectedRoute>} />
                    <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
                    <Route path="/candidate-search" element={<ProtectedRoute><CandidateSearchPage /></ProtectedRoute>} />
                    <Route path="/resume-scanner" element={<ProtectedRoute><ResumeScanner /></ProtectedRoute>} />
                    {/* Course Routes */}
                    <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
                    <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
                    <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />

                    {/* AI Feature */}
                    <Route path="/interview-coach" element={<ProtectedRoute><InterviewCoachPage /></ProtectedRoute>} />
                    <Route path="/interview-coach" element={<ProtectedRoute><InterviewCoach /></ProtectedRoute>} />
                    {/* Catch-all 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

