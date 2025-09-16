import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Toaster ka import

// --- Layout & Route Components ---
import AppLayout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

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
import CandidateSearchPage from './pages/CandidateSearchPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminCoursesPage from './pages/AdminCoursesPage.jsx';
import CourseEditorPage from './pages/CourseEditorPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminJobsPage from './pages/AdminJobsPage.jsx';
import CreateJobFairPage from './pages/CreateJobFairPage.jsx';
import ViewJobFairsPage from './pages/ViewJobFairsPage.jsx';
import JobFairDetailPage from './pages/JobFairDetailPage.jsx';
import ManageBoothPage from './pages/ManageBoothPage.jsx';
import MyRecruiterAppointments from './pages/MyRecruiterAppointments.jsx';
import MyStudentAppointments from './pages/MyStudentAppointments.jsx';
import ChatListPage from './pages/ChatListPage.jsx';
import ChatRoomPage from './pages/ChatRoomPage.jsx';
import CreateQnaPage from './pages/CreateQnaPage.jsx';
import QnaSessionPage from './pages/QnaSessionPage.jsx';
import StudentProfileViewPage from './pages/StudentProfileViewPage.jsx';
import CompanyProfilePage from './pages/CompanyProfilePage.jsx';


export default function App() {
    return (
        <BrowserRouter>
            {/* === TOASTER KO YAHAN, ROUTES KE BAHAR RAKHA GAYA HAI === */}
            <Toaster position="top-right" reverseOrder={false} />

            <Routes>
                {/* Auth routes without the main layout */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

                {/* All other routes use the main AppLayout */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Job & Application Routes */}
                    <Route path="/post-job" element={<ProtectedRoute><PostJobPage /></ProtectedRoute>} />
                    <Route path="/edit-job/:jobId" element={<ProtectedRoute><EditJobPage /></ProtectedRoute>} />
                    <Route path="/jobs" element={<ProtectedRoute><ViewJobsPage /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
                    <Route path="/manage-jobs" element={<ProtectedRoute><ManageJobsPage /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId/applicants" element={<ProtectedRoute><ApplicantsPage /></ProtectedRoute>} />
                    <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
                    <Route path="/candidate-search" element={<ProtectedRoute><CandidateSearchPage /></ProtectedRoute>} />

                    {/* Course & Enrollment Routes */}
                    <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
                    <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
                    <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
                    
                    {/* Job Fair Routes */}
                    <Route path="/create-job-fair" element={<ProtectedRoute><CreateJobFairPage /></ProtectedRoute>} />
                    <Route path="/job-fairs" element={<ProtectedRoute><ViewJobFairsPage /></ProtectedRoute>} />
                    <Route path="/job-fair/:fairId" element={<ProtectedRoute><JobFairDetailPage /></ProtectedRoute>} />
                    <Route path="/manage-booth/:boothId" element={<ProtectedRoute><ManageBoothPage /></ProtectedRoute>} />
                    <Route path="/my-appointments" element={<ProtectedRoute><MyRecruiterAppointments /></ProtectedRoute>} />
                    <Route path="/my-scheduled-interviews" element={<ProtectedRoute><MyStudentAppointments /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                    <Route path="/admin/courses" element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
                    <Route path="/admin/courses/new" element={<AdminRoute><CourseEditorPage /></AdminRoute>} />
                    <Route path="/admin/courses/edit/:courseId" element={<AdminRoute><CourseEditorPage /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                    <Route path="/admin/jobs" element={<AdminRoute><AdminJobsPage /></AdminRoute>} />
                    
                    {/* --- CHANGE YAHAN KIYA HAI --- */}
                    <Route path="/chat" element={<ProtectedRoute><ChatListPage /></ProtectedRoute>} /> 
                    <Route path="/chat/:chatId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
                    <Route path="/create-qna" element={<ProtectedRoute><CreateQnaPage /></ProtectedRoute>} />
                    <Route path="/qna-session/:sessionId" element={<ProtectedRoute><QnaSessionPage /></ProtectedRoute>} />
                    <Route path="/student/:studentId" element={<ProtectedRoute><StudentProfileViewPage /></ProtectedRoute>} />
                    <Route path="/company/:companyId" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
                    
                    {/* Catch-all 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}