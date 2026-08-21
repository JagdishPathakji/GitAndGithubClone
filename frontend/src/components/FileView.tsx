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
            } catch (err: any) {
                setError(err.message || 'Failed to load file');
            } finally {
                setLoading(false);
            }
        };
        fetchFile();
    }, [username, repoName, oid]);

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
                    </div>

                    <div className="p-0 bg-white overflow-x-auto">
                            {filePath.toLowerCase().endsWith('.md') ? (
                                <div className="p-6 prose max-w-none text-gray-800">
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
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={
                                        (() => {
                                            const ext = filePath.split('.').pop()?.toLowerCase();
                                            switch (ext) {
                                                case 'js': case 'jsx': return 'javascript';
                                                case 'ts': case 'tsx': return 'typescript';
                                                case 'py': return 'python';
                                                case 'json': return 'json';
                                                case 'html': return 'html';
                                                case 'css': return 'css';
                                                case 'sh': return 'bash';
                                                case 'yml': case 'yaml': return 'yaml';
                                                default: return 'text';
                                            }
                                        })()
                                    }
                                    showLineNumbers={true}
                                    PreTag="div"
                                    customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}
                                >
                                    {content}
                                </SyntaxHighlighter>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default FileView;
