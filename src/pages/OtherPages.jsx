import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Recruiter Profile Form (No changes here, it is kept as it was)
const RecruiterProfileForm = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        displayName: '', title: '', companyName: '', companyWebsite: '', aboutCompany: '', industry: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                displayName: user.displayName || '',
                title: user.profile?.title || '',
                companyName: user.profile?.companyName || '',
                companyWebsite: user.profile?.companyWebsite || '',
                aboutCompany: user.profile?.aboutCompany || '',
                industry: user.profile?.industry || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Updating profile...');
        try {
            const userDocRef = doc(db, 'users', user.uid);

            if (auth.currentUser.displayName !== profileData.displayName) {
                await updateProfile(auth.currentUser, { displayName: profileData.displayName });
            }

            await updateDoc(userDocRef, {
                displayName: profileData.displayName,
                'profile.title': profileData.title,
                'profile.companyName': profileData.companyName,
                'profile.companyWebsite': profileData.companyWebsite,
                'profile.aboutCompany': profileData.aboutCompany,
                'profile.industry': profileData.industry,
                isProfileComplete: !!(profileData.displayName && profileData.companyName && profileData.aboutCompany),
            });

            toast.success('Profile updated successfully!', { id: toastId });
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast.error('Failed to update profile.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="displayName" className="block text-gray-700 font-bold mb-2">Your Full Name</label>
                    <input type="text" id="displayName" name="displayName" value={profileData.displayName} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Your Title/Role</label>
                    <input type="text" id="title" name="title" value={profileData.title} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., HR Manager" />
                </div>
                <div>
                    <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">Company Name</label>
                    <input type="text" id="companyName" name="companyName" value={profileData.companyName} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label htmlFor="industry" className="block text-gray-700 font-bold mb-2">Industry</label>
                    <input type="text" id="industry" name="industry" value={profileData.industry} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., Information Technology" />
                </div>
            </div>
            <div>
                <label htmlFor="companyWebsite" className="block text-gray-700 font-bold mb-2">Company Website</label>
                <input type="url" id="companyWebsite" name="companyWebsite" value={profileData.companyWebsite} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
                <label htmlFor="aboutCompany" className="block text-gray-700 font-bold mb-2">About the Company</label>
                <textarea id="aboutCompany" name="aboutCompany" rows="4" value={profileData.aboutCompany} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
            <div className="mt-2 text-center">
                <button type="submit" disabled={loading} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

// ===================================================================
// Student Profile Form (Updated with Location)
// ===================================================================
const StudentProfileForm = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        displayName: '', email: '', headline: '', location: '', bio: '', linkedinUrl: '', portfolioUrl: '', skills: [],
    });
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        if (user) {
            setProfileData({
                displayName: user.displayName || '',
                email: user.email || '',
                headline: user.profile?.headline || '',
                location: user.profile?.location || '', // Get location
                bio: user.profile?.bio || '',
                linkedinUrl: user.profile?.linkedinUrl || '',
                portfolioUrl: user.profile?.portfolioUrl || '',
                skills: user.profile?.skills || [],
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillInput && !profileData.skills.includes(skillInput)) {
            setProfileData(prev => ({ ...prev, skills: [...prev.skills, skillInput] }));
            setSkillInput('');
        } else if (profileData.skills.includes(skillInput)) {
            toast.error("Skill already added.");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfileData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Updating profile...');
        try {
            const userDocRef = doc(db, 'users', user.uid);
            if (auth.currentUser.displayName !== profileData.displayName) {
                await updateProfile(auth.currentUser, { displayName: profileData.displayName });
            }
            await updateDoc(userDocRef, {
                displayName: profileData.displayName,
                'profile.headline': profileData.headline,
                'profile.location': profileData.location, // Save location
                'profile.bio': profileData.bio,
                'profile.linkedinUrl': profileData.linkedinUrl,
                'profile.portfolioUrl': profileData.portfolioUrl,
                'profile.skills': profileData.skills,
                isProfileComplete: !!(profileData.displayName && profileData.headline && profileData.skills.length > 0)
            });
            toast.success('Profile updated successfully!', { id: toastId });
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast.error('Failed to update profile.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="displayName" className="block text-gray-700 font-bold mb-2">Full Name</label>
                    <input type="text" id="displayName" name="displayName" value={profileData.displayName} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label htmlFor="headline" className="block text-gray-700 font-bold mb-2">Headline</label>
                    <input type="text" id="headline" name="headline" value={profileData.headline} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., Aspiring Software Engineer" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <div>
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                    <input type="email" id="email" name="email" value={profileData.email} disabled className="shadow-sm border rounded w-full py-2 px-3 bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location</label>
                    <input type="text" id="location" name="location" value={profileData.location} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., Mumbai, India"/>
                </div>
            </div>

            <div className="mt-6">
                <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">About Me</label>
                <textarea id="bio" name="bio" rows="4" value={profileData.bio} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
            <div className="mt-6">
                <label htmlFor="skills" className="block text-gray-700 font-bold mb-2">My Skills</label>
                <div className="flex gap-2">
                    <input type="text" id="skills" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="flex-grow shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., JavaScript" />
                    <button type="button" onClick={handleAddSkill} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Add</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                        <div key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center gap-2">
                            <span>{skill}</span>
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-teal-600 hover:text-teal-800 font-bold">&times;</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                <label htmlFor="linkedinUrl" className="block text-gray-700 font-bold mb-2">LinkedIn Profile URL</label>
                <input type="url" id="linkedinUrl" name="linkedinUrl" value={profileData.linkedinUrl} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="mt-6">
                <label htmlFor="portfolioUrl" className="block text-gray-700 font-bold mb-2">Portfolio/Website URL</label>
                <input type="url" id="portfolioUrl" name="portfolioUrl" value={profileData.portfolioUrl} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="mt-8 text-center">
                <button type="submit" disabled={loading} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

// ===================================================================
// Main ProfilePage (Manager Component)
// ===================================================================
export function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Your Profile</h1>
            {user?.role === 'student' && <StudentProfileForm />}
            {user?.role === 'recruiter' && <RecruiterProfileForm />}
        </div>
    );
}

// ===================================================================
// NotFoundPage (No change)
// ===================================================================
export const NotFoundPage = () => (
    <div className="text-center">
        <h1 className="text-6xl font-extrabold text-teal-600">404</h1>
        <p className="mt-4 text-xl text-gray-600">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="mt-8 inline-block bg-teal-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-teal-700">
            Go to Homepage
        </Link>
    </div>
);