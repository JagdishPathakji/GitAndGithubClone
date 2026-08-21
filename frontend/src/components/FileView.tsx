import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cachedFetch, clearCache } from '../utils/apiCache';

const FileView = () => {
    const { username, repoName, branch } = useParams();
    const location = useLocation();
    
    // We parse the filename from the splat route path (the `/*` part in App.tsx)
    const filePath = location.pathname.split(`/blob/${branch}/`)[1];
    
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [commitMessage, setCommitMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    // Since our backend doesn't support fetching by path easily yet, 
    // we use a trick: the previous page passes the `oid` in state!
    const oid = location.state?.oid;

    useEffect(() => {
        if (!oid) {
            setError('File OID missing. Please navigate from the repository page.');
            setLoading(false);
            return;
        }

        const fetchFile = async () => {
            try {
                const data = await cachedFetch(`https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}/blob/${oid}`, { credentials: 'include' });
                if (!data.status) throw new Error(data.message);
                setContent(data.content);
                setEditContent(data.content);
            } catch (err: any) {
                setError(err.message || 'Failed to load file');
            } finally {
                setLoading(false);
            }
        };
        fetchFile();
    }, [username, repoName, oid]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`https://version-control-system-mebn.onrender.com/repo/${username}/${repoName}/edit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    filename: filePath,
                    content: editContent,
                    commitMessage,
                    branch
                })
            });
            const data = await res.json();
            
            if (data.status) {
                // Invalidate all repo cache so the UI updates
                clearCache(`repo/${username}/${repoName}`);
                navigate(`/repo/${username}/${repoName}`);
            } else {
                throw new Error(data.message);
            }
        } catch (err: any) {
            alert(err.message || 'Failed to save file');
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="inline-block w-12 h-12 border-4 border-[#b428b4] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl border-l-4 border-red-500 max-w-md w-full">
                <p className="text-gray-700">{error}</p>
                <Link to={`/repo/${username}/${repoName}`} className="text-blue-500 hover:underline mt-4 inline-block">Go back</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Navbar username={localStorage.getItem("username")} setIsAuthenticated={()=>{}} navigate={navigate} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 pt-6 pb-4 px-8 shadow-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        <Link to={`/publicProfile/${username}`} className="text-[#3023ae] hover:underline hover:text-[#b428b4] transition-colors">{username}</Link>
                        <span className="text-gray-400 font-light">/</span>
                        <Link to={`/repo/${username}/${repoName}`} className="text-[#3023ae] hover:underline hover:text-[#b428b4] transition-colors font-bold">{repoName}</Link>
                        <span className="text-gray-400 font-light">/</span>
                        <span className="text-gray-600 font-mono text-lg">{filePath}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                        <span className="font-mono text-sm text-gray-600">{content.split('\n').length} lines</span>
                        
                        {localStorage.getItem("username") === username && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm font-semibold transition-colors"
                                >
                                    {isEditing ? 'Cancel Edit' : '✏️ Edit'}
                                </button>
                                {!isEditing && (
                                    <button 
                                        onClick={() => alert("Delete not implemented in this UI version yet, but you can push a deletion from CLI!")}
                                        className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded text-sm font-semibold transition-colors"
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSave} className="p-4 bg-gray-50">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#b428b4] bg-white text-gray-800"
                            />
                            <div className="mt-4 bg-white p-4 border border-gray-300 rounded">
                                <h3 className="font-semibold text-gray-800 mb-2">Commit changes</h3>
                                <input
                                    type="text"
                                    value={commitMessage}
                                    onChange={(e) => setCommitMessage(e.target.value)}
                                    placeholder={`Update ${filePath}`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-[#3023ae]"
                                />
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    {isSaving ? 'Committing...' : 'Commit changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-6 bg-white overflow-x-auto">
                            {filePath.toLowerCase().endsWith('.md') ? (
                                <div className="prose max-w-none text-gray-800">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                          const match = /language-(\w+)/.exec(className || "");
                                          return !inline && match ? (
                                            <SyntaxHighlighter
                                              style={oneDark}
                                              language={match[1]}
                                              PreTag="div"
                                              {...props}
                                            >
                                              {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                          ) : (
                                            <code className={className} {...props}>
                                              {children}
                                            </code>
                                          );
                                        },
                                      }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <pre className="font-mono text-sm text-gray-800 leading-relaxed">
                                    {content}
                                </pre>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileView;
