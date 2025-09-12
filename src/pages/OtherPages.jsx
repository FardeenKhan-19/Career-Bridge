import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function ProfilePage() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        displayName: '',
        headline: '',
        bio: '',
        linkedinUrl: '',
        portfolioUrl: '',
        skills: [], // Add skills to state
    });
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState(''); // State for the new skill input

    useEffect(() => {
        if (user) {
            setProfileData({
                displayName: user.displayName || '',
                headline: user.profile?.headline || '',
                bio: user.profile?.bio || '',
                linkedinUrl: user.profile?.linkedinUrl || '',
                portfolioUrl: user.profile?.portfolioUrl || '',
                skills: user.profile?.skills || [], // Load existing skills
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
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
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
                'profile.bio': profileData.bio,
                'profile.linkedinUrl': profileData.linkedinUrl,
                'profile.portfolioUrl': profileData.portfolioUrl,
                'profile.skills': profileData.skills, // Save the skills array
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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Your Profile</h1>
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

                <div className="mt-6">
                    <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">About Me</label>
                    <textarea id="bio" name="bio" rows="4" value={profileData.bio} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                </div>

                {/* --- New Skills Section --- */}
                <div className="mt-6">
                    <label htmlFor="skills" className="block text-gray-700 font-bold mb-2">My Skills</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="skills"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            className="flex-grow shadow-sm border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g., JavaScript"
                        />
                        <button onClick={handleAddSkill} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Add</button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                            <div key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center gap-2">
                                <span>{skill}</span>
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-teal-600 hover:text-teal-800 font-bold">
                                    &times;
                                </button>
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
        </div>
    );
}

export const NotFoundPage = () => (
    <div className="text-center">
        <h1 className="text-6xl font-extrabold text-teal-600">404</h1>
        <p className="mt-4 text-xl text-gray-600">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="mt-8 inline-block bg-teal-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-teal-700">
            Go to Homepage
        </Link>
    </div>
);

