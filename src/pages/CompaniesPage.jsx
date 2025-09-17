// src/pages/CompaniesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            const q = query(collection(db, 'companies'), orderBy('companyName'));
            const querySnapshot = await getDocs(q);
            setCompanies(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchCompanies();
    }, []);

    if (loading) return <div className="text-center p-10">Loading Companies...</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Featured Companies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {companies.map(company => (
                    <Link to={`/companies/${company.id}`} key={company.id} className="block bg-white p-6 text-center rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <img src={company.logoUrl} alt={`${company.companyName} logo`} className="h-20 w-full object-contain mx-auto mb-4"/>
                        <h3 className="text-lg font-bold text-gray-800">{company.companyName}</h3>
                        <p className="text-sm text-gray-500">{company.industry}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}