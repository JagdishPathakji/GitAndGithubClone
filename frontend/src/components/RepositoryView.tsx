import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const RepositoryView = () => {
    const { username, repoName } = useParams();
    const [repoInfo, setRepoInfo] = useState<any>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [files, setFiles] = useState<any[]>([]);
    const [commits, setCommits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRepoData = async () => {
            try {
                // Fetch Details
                const res = await fetch(`http://localhost:4000/repo/${username}/${repoName}`, { credentials: 'include' });
                const data = await res.json();
                if (!data.status) throw new Error(data.message);
                
                setRepoInfo(data.repo);
                setIsEmpty(data.isEmpty);

                // If not empty, fetch files and commits
                if (!data.isEmpty) {
                    const [filesRes, commitsRes] = await Promise.all([
                        fetch(`http://localhost:4000/repo/${username}/${repoName}/files`, { credentials: 'include' }),
                        fetch(`http://localhost:4000/repo/${username}/${repoName}/commits`, { credentials: 'include' })
                    ]);
                    
                    const filesData = await filesRes.json();
                    const commitsData = await commitsRes.json();
                    
                    if (filesData.status) setFiles(filesData.files);
                    if (commitsData.status) setCommits(commitsData.commits);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load repository');
            } finally {
                setLoading(false);
            }
        };

        fetchRepoData();
    }, [username, repoName]);

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen bg-gray-900 text-red-500 p-10">{error}</div>;

    const s3Url = `s3://girgit-project/${username}/${repoName}`;

    return (
        <div className="min-h-screen bg-[#0d0221] text-gray-200 font-mono">
            {/* Header */}
            <div className="bg-[#1a1629] border-b border-gray-700 py-6 px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        <Link to={`/publicProfile/${username}`} className="text-[#00d9ff] hover:underline">{username}</Link>
                        <span className="text-gray-500 mx-2">/</span>
                        <span className="text-white">{repoName}</span>
                        <span className="ml-4 px-2 py-1 text-xs border border-gray-600 rounded-full text-gray-400">
                            {repoInfo?.isPrivate ? 'Private' : 'Public'}
                        </span>
                    </h1>
                    {repoInfo?.description && <p className="mt-2 text-gray-400 text-sm">{repoInfo.description}</p>}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto py-8 px-4">
                {isEmpty ? (
                    <div className="bg-[#1e1b30] border border-gray-700 rounded-lg p-8 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-[#ff006e]">Quick setup — if you've done this kind of thing before</h2>
                        <div className="bg-black p-4 rounded text-[#00d9ff] overflow-x-auto mb-8">
                            <code>girgit remote add aws {s3Url}</code><br/>
                            <code>girgit push aws master</code>
                        </div>

                        <h3 className="text-lg font-bold mb-2">...or create a new repository on the command line</h3>
                        <div className="bg-black p-4 rounded text-gray-300 overflow-x-auto space-y-2">
                            <code>mkdir {repoName}</code><br/>
                            <code>cd {repoName}</code><br/>
                            <code>girgit init</code><br/>
                            <code>echo "# {repoName}" &gt; README.md</code><br/>
                            <code>girgit commit -m "first commit"</code><br/>
                            <code>girgit remote add aws {s3Url}</code><br/>
                            <code>girgit push aws master</code>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Files Explorer */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-[#1e1b30] border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                                <div className="bg-[#2a2640] px-4 py-3 border-b border-gray-700 font-bold flex justify-between">
                                    <span>Code</span>
                                    <span className="text-sm font-normal text-gray-400">{commits.length} commits</span>
                                </div>
                                <ul>
                                    {files.map((file, idx) => (
                                        <li key={idx} className="px-4 py-3 border-b border-gray-700/50 hover:bg-[#252136] flex items-center transition-colors">
                                            {file.type === 'tree' ? (
                                                <span className="text-[#00d9ff] mr-3">📁</span>
                                            ) : (
                                                <span className="text-gray-400 mr-3">📄</span>
                                            )}
                                            <span className={file.type === 'tree' ? 'text-[#00d9ff] cursor-pointer hover:underline' : 'text-gray-200'}>
                                                {file.name}
                                            </span>
                                        </li>
                                    ))}
                                    {files.length === 0 && <li className="p-4 text-center text-gray-500">No files found.</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar / Commits */}
                        <div className="space-y-6">
                            <div className="bg-[#1e1b30] border border-gray-700 rounded-lg p-4 shadow-lg">
                                <h3 className="font-bold text-gray-300 mb-2 border-b border-gray-700 pb-2">Recent Commits</h3>
                                <ul className="space-y-3 mt-4">
                                    {commits.slice(0, 5).map((c, idx) => (
                                        <li key={idx} className="text-sm">
                                            <p className="text-gray-200 font-medium truncate">{c.message}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-gray-500 text-xs">{c.author}</span>
                                                <span className="text-[#ff006e] font-mono text-xs">{c.oid.substring(0, 7)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepositoryView;
