import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRepo = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:4000/repo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, isPrivate }),
                credentials: 'include'
            });
            const data = await res.json();
            
            if (res.ok && data.status) {
                navigate('/dashboard');
            } else {
                setError(data.message || 'Failed to create repository');
            }
        } catch (err) {
            setError('Server error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d0221] via-[#1a1629] to-[#0d0221] text-gray-200 font-mono py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto space-y-8 bg-[#1e1b30] p-8 rounded-xl border border-gray-700 shadow-2xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] to-[#00d9ff]">
                        Create a new repository
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        A repository contains all project files, including the revision history.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm rounded-lg p-4">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="repo-name" className="block text-sm font-medium text-gray-300">Repository name *</label>
                            <input
                                id="repo-name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value.replace(/\s+/g, '-'))}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-[#00d9ff] focus:border-[#00d9ff] focus:z-10 sm:text-sm"
                                placeholder="my-awesome-project"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description (optional)</label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-[#00d9ff] focus:border-[#00d9ff] focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="private"
                                name="private"
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="h-4 w-4 text-[#ff006e] focus:ring-[#ff006e] border-gray-600 rounded bg-gray-800"
                            />
                            <label htmlFor="private" className="ml-2 block text-sm text-gray-300">
                                Make repository private
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#ff006e] to-[#00d9ff] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00d9ff] focus:ring-offset-gray-900 disabled:opacity-50 transition-all duration-300"
                        >
                            {loading ? 'Creating...' : 'Create repository'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRepo;
