CareerBridge 🚀
Welcome to CareerBridge, a modern, full-stack web application designed to connect students with recruiters. It provides a seamless platform for job searching, skill development through courses, and talent acquisition.

✨ Key Features
CareerBridge is a multi-faceted platform with distinct features tailored for three user roles: Students, Recruiters, and Admins.

🎓 For Students
Dynamic Dashboard: A personalized dashboard featuring profile strength, recent activities, and quick navigation.

Profile Management: Students can build and update their professional profiles, with a circular progress bar to track completeness.

Job Discovery: Browse and search for job listings posted by recruiters.

Easy Applications: Apply for jobs directly through the platform.

Course Enrollment: Access and enroll in courses to upskill and enhance qualifications.

Track Progress: View "My Applications" and "My Courses" to keep track of career development.

hiring For Recruiters
Personalized Dashboard: Get an overview of jobs posted, total applicants, and recent applications.

Job Posting & Management: Easily create, edit, and manage job listings.

Applicant Tracking: View and manage the list of applicants for each job posting.

⚙️ For Admins
Centralized Dashboard: An admin-specific dashboard with key platform statistics (Total Users, Jobs, Courses).

User Management: View a list of all users (students and recruiters), change their roles, and manage their accounts.

Job Oversight: Manage all job postings on the platform to ensure quality and handle user support.

Content Management: Create, edit, and manage the courses available on the platform.

💻 Technologies Used
Frontend: React.js, React Router

Backend & Database: Firebase (Firestore, Authentication)

Styling: Tailwind CSS

Animations: Framer Motion

Notifications: React Hot Toast

🚀 Getting Started
Follow these instructions to get a local copy of CareerBridge up and running for development and testing purposes.

Prerequisites
Node.js (v18 or later)

npm or yarn

Installation & Setup
Clone the repository:

git clone [https://github.com/FardeenKhan-19/Career-Bridge.git](https://github.com/FardeenKhan-19/Career-Bridge.git)
cd Career-Bridge

Install dependencies:

npm install

Set up Firebase & Environment File: Follow the setup instructions in the official repository to configure your Firebase project and .env file with the necessary API keys.

Run the development server:

npm run dev

📂 Project Structure
/src
├── /components   # Reusable UI components (Layouts, Icons, Cards)
├── /contexts     # React Context for global state (e.g., AuthContext)
├── /pages        # Top-level page components for each route
├── App.jsx       # Main application component with routing
├── firebase.js   # Firebase configuration and initialization
└── index.css     # Global styles and Tailwind CSS imports

👨‍💻 Team Workflow & Task Division
Here is a strategic breakdown of the project into four core modules. Each team member will lead one module, focusing on a specific set of related features.

Khan Fardeen Firoz: Lead – Core Platform & User Experience (UX)

  This role is responsible for building the foundational structure of the site, focusing on user management, overall design, and accessibility. This is the backbone upon which all other features will be built.
  
  Key Features: User-Friendly Navigation, Security & Accessibility, Admin Fuctionality, GitHub flow management.
  
  Specific Tasks:
  
  System Architecture & Design: Create wireframes and mockups for the entire platform.
  
  User Management: Implement secure registration and login with roles (Student, Recruiter, Admin). Develop user profile pages.
  
  Security & Infrastructure: Set up the core database schema and ensure web accessibility standards (WCAG).
  
  Frontend Framework: Develop the main application shell (header, footer, responsive design).
  
  Primary Deliverable: A secure, accessible, and navigable platform with functional user registration, login, and profile management.

  Administrator Access: A secure route for admins only to make changes in the webpage along with CRUD operations of all the content published.

  GitHub Flow management: Succesfully managed the entire flow of our repository merging all the branches onto the main avoiding conflicts.

Sayyed Danish Rafiq: Lead – Student Training & Resource Hub

  This role focuses on the "Training" aspect of the platform, creating an engaging learning environment to prepare students for the job market.
  
  Key Features: Training Programs, Placement Resources.
  
  Specific Tasks:
  
  Training Program Module: Build the interface for browsing, enrolling, and viewing courses.
  
  Resource Library: Create a dedicated section for resume guides, interview tips, etc.
  
  CMS Backend: Create an admin dashboard for uploading and managing training content.
  
  Company Profiles: Develop static company profile pages for students to browse.
  
  Primary Deliverable: A fully functional e-learning hub with career-prep resources.

Shaikh Afrah Rafiq : Lead – AI-Powered Preparation Tools

  This role is focused on developing the advanced, AI-driven features that give the platform a competitive edge.
  
  Key Features: AI Resume Scanner, Interview Practice Tools.
  
  Specific Tasks:
  
  AI Resume Scanner: Integrate an NLP API to parse resumes and provide improvement suggestions.
  
  Mock Interview System: Build an interactive interview practice tool with a database of questions.
  
  Adaptive Learning: Develop logic for adaptive sessions where question difficulty changes based on performance.
  
  Backend & API Integration: Manage all backend logic for the AI tools.
  
  Primary Deliverable: A working AI resume analyzer and an interactive mock interview tool.

Shah Sufiyan Javed : Lead – Recruiter-Student Interaction & Placement

  This role is responsible for the "Placement" side of the platform, building the bridge between students and employers.
  
  Key Features: Student-Employer Interaction, Job Boards & Application Tracking.
  
  Specific Tasks:
  
  Job Board Management: Create a dashboard for recruiters to post jobs and a searchable job board for students.
  
  Application System: Build the functionality for students to apply and an Applicant Tracking System (ATS) for recruiters.
  
  Real-time Interaction Tools: Implement real-time chat and a system for live Q&A sessions.
  
  Virtual Job Fairs: Develop the framework for virtual job fair events.
  
  Primary Deliverable: A dynamic job board, an application management system, and real-time communication tools.

Collaboration Plan
Weekly Sync-ups: All four members meet weekly to discuss progress, roadblocks, and integration points.

Version Control: Use Git and a platform like GitHub or GitLab from day one.

Project Management Tool: Use a tool like Trello or Jira to track tasks for each module.

Lead Coordinator: Shaikh Afrah Rafiq is Leading the Overall Project.
