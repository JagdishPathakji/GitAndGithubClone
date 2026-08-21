import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearCache } from '../utils/apiCache';

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
            const res = await fetch('https://version-control-system-mebn.onrender.com/repo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, isPrivate }),
                credentials: 'include'
            });
            const data = await res.json();
            
            if (res.ok && data.status) {
                clearCache('user/repos');
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-lg shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3023ae] to-[#b428b4] bg-clip-text text-transparent">
                        Create a new repository
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        A repository contains all project files, including the revision history.
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-5">
                        <div className="group">
                            <label htmlFor="repo-name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Repository name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="repo-name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value.replace(/\s+/g, '-'))}
                                className="w-full border-b border-gray-300 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b428b4] transition-colors bg-transparent"
                                placeholder="my-awesome-project"
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                                Description <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border-b border-gray-300 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b428b4] transition-colors bg-transparent"
                                placeholder="Short description of your project"
                            />
                        </div>
                        <div className="flex items-center mt-4">
                            <input
                                id="private"
                                name="private"
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="h-4 w-4 text-[#b428b4] focus:ring-[#b428b4] border-gray-300 rounded"
                            />
                            <label htmlFor="private" className="ml-2 block text-sm text-gray-700 font-medium">
                                Make repository private
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#3023ae] to-[#b428b4] text-white font-semibold py-3 flex justify-center px-6 items-center rounded-sm hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
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
