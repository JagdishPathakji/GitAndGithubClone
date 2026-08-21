import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { cachedFetch } from '../utils/apiCache';

const RepositoryView = () => {
    const { username, repoName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const targetOid = queryParams.get('oid');
    
    const [repoInfo, setRepoInfo] = useState<any>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [files, setFiles] = useState<any[]>([]);
    const [commits, setCommits] = useState<any[]>([]);
    const [branches, setBranches] = useState<string[]>([]);
    // If browsing history (targetOid), display that OID instead of branch name
    const [selectedBranch, setSelectedBranch] = useState<string>(targetOid ? targetOid.substring(0, 7) : 'master');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRepoData = async () => {
            try {
                const data = await cachedFetch(`https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}`, { credentials: 'include' });
                if (!data.status) throw new Error(data.message);
                
                setRepoInfo(data.repo);
                setIsEmpty(data.isEmpty);

                if (!data.isEmpty) {
                    const branchesData = await cachedFetch(`https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}/branches`, { credentials: 'include' });
                    if (branchesData.status && branchesData.branches.length > 0) {
                        setBranches(branchesData.branches);
                        if (!branchesData.branches.includes(selectedBranch)) {
                            setSelectedBranch(branchesData.branches[0]);
                        }
                    }

                    // In a future update, we will pass ?branch=selectedBranch to the backend files/commits endpoints
                    const filesUrl = targetOid 
                        ? `https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}/files?oid=${targetOid}`
                        : `https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}/files`;
                        
                    const [filesData, commitsData] = await Promise.all([
                        cachedFetch(filesUrl, { credentials: 'include' }),
                        cachedFetch(`https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}/commits`, { credentials: 'include' })
                    ]);
                    
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
    }, [username, repoName, selectedBranch, targetOid]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="inline-block w-12 h-12 border-4 border-[#b428b4] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-semibold text-lg">Loading Repository...</p>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl border-l-4 border-red-500 max-w-md w-full">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-700">{error}</p>
            </div>
        </div>
    );

    const s3Url = `s3://girgit-project/${username}/${repoName}`;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Navbar username={localStorage.getItem("username")} setIsAuthenticated={()=>{}} navigate={navigate} />

            {/* Header / Navigation Bar */}
            <div className="bg-white border-b border-gray-200 pt-6 pb-4 px-8 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 text-xl font-semibold mb-3">
                        <Link to={`/publicProfile/${username}`} className="text-[#3023ae] hover:underline hover:text-[#b428b4] transition-colors">{username}</Link>
                        <span className="text-gray-400 font-light">/</span>
                        <span className="text-gray-800 font-bold">{repoName}</span>
                        <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold border border-gray-300 rounded-full text-gray-500 bg-gray-100">
                            {repoInfo?.isPrivate ? 'Private' : 'Public'}
                        </span>
                    </div>
                    {repoInfo?.description && <p className="text-gray-600 text-sm">{repoInfo.description}</p>}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto py-8 px-4">
                {isEmpty ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick setup — if you've done this kind of thing before</h2>
                        <div className="bg-gray-100 p-4 rounded-md border border-gray-200 text-gray-800 overflow-x-auto mb-8 shadow-inner font-mono text-sm">
                            <p>girgit remote add aws {s3Url}</p>
                            <p>girgit push aws master</p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-4">...or create a new repository on the command line</h3>
                        <div className="bg-gray-100 p-4 rounded-md border border-gray-200 text-gray-800 overflow-x-auto space-y-1 shadow-inner font-mono text-sm">
                            <p>mkdir {repoName}</p>
                            <p>cd {repoName}</p>
                            <p>girgit init</p>
                            <p>echo "# {repoName}" &gt; README.md</p>
                            <p>girgit commit -m "first commit"</p>
                            <p>girgit remote add aws {s3Url}</p>
                            <p>girgit push aws master</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main File Explorer */}
                        <div className="lg:col-span-3 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <select 
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded focus:ring-[#3023ae] focus:border-[#3023ae] block px-3 py-1.5 font-semibold"
                                    >
                                        {branches.length > 0 ? branches.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        )) : <option value="master">master</option>}
                                    </select>
                                </div>
                                <button 
                                    onClick={() => navigate(`/repo/${username}/${repoName}/commits/${selectedBranch}`)}
                                    className="text-gray-600 hover:text-blue-600 font-semibold text-sm flex items-center gap-1 transition-colors"
                                >
                                    🕒 {commits.length} Commits &gt;
                                </button>
                            </div>

                            {/* Latest Commit Header */}
                            {commits.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-t-lg p-3 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold text-gray-800">{commits[0].author || username}</div>
                                        <div className="text-gray-600 hover:text-blue-600 cursor-pointer">{commits[0].message}</div>
                                    </div>
                                    <div className="text-gray-500 flex items-center gap-3 text-sm">
                                        <span className="font-mono text-xs">{commits[0].oid.substring(0, 7)}</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="bg-white border border-gray-300 rounded-b-lg overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {files.map((file, idx) => (
                                            <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 w-10 text-center">
                                                    {file.type === 'tree' ? (
                                                        <span className="text-blue-400 text-lg">📁</span>
                                                    ) : (
                                                        <span className="text-gray-400 text-lg">📄</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-2 font-medium">
                                                    <Link 
                                                        to={`/repo/${username}/${repoName}/blob/${selectedBranch}/${file.name}`}
                                                        state={{ oid: file.oid }}
                                                        className={file.type === 'tree' ? 'text-[#3023ae] cursor-pointer hover:underline' : 'text-gray-800 hover:text-blue-600 hover:underline'}
                                                    >
                                                        {file.name}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-4 text-right text-gray-500 font-mono text-xs hidden sm:table-cell">
                                                    {file.oid.substring(0, 7)}
                                                </td>
                                            </tr>
                                        ))}
                                        {files.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-gray-500">
                                                    No files found in the current directory.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">About</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {repoInfo?.description || "No description, website, or topics provided."}
                                </p>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <span>🌐 S3 Backend Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepositoryView;
