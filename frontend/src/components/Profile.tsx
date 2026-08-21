import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import StreakGrid from "./StreakGrid";
import {
  User,
  Mail,
  Users,
  GitBranch,
  Star,
  Lock,
  Globe,
  Pencil,
  Check,
  X,
  FileText,
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cachedFetch, clearCache } from "../utils/apiCache";

interface Repository {
  _id: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  starred: number;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  repositories: number;
  followedUser: number;
  followingUser: number;
  description: string;
  readme: string;
}

export default function Profile({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditingReadme, setIsEditingReadme] = useState(false);
  const [editedReadme, setEditedReadme] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await cachedFetch("https://version-control-system-mebn.onrender.com/getOwnProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        
        if (data.status) {
          setProfile(data.profile);
          setRepos(data.repos);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStreak = async () => {
      try {
        const data = await cachedFetch(`https://version-control-system-mebn.onrender.com/getStreak/${username}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          method: "GET",
        });

        
        if (data.status === true) {
          setStreak(data.dailyCommits);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log("Error in fetching streak", error);
      }
    };

    fetchProfileData();
    fetchStreak();
  }, [username]);

  const handleSaveDescription = async () => {
    try {
      const response = await fetch("https://version-control-system-mebn.onrender.com/updateProfile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editedDescription }),
        credentials: "include",
      });

      const data = await response.json();
      
      if (data.status) {
        if (profile) {
          setProfile({ ...profile, description: editedDescription });
        }
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      alert("An error occurred while updating the description");
    }
  };

  const handleSaveReadme = async () => {
    try {
      const response = await fetch("https://version-control-system-mebn.onrender.com/updateProfile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readme: editedReadme }),
        credentials: "include",
      });

      const data = await response.json();
      
      if (data.status) {
        if (profile) {
          setProfile({ ...profile, readme: editedReadme });
        }
        setIsEditingReadme(false);
      } else {
        alert(data.message || "Failed to update README");
      }
    } catch (error) {
      console.error("Error updating README:", error);
      alert("An error occurred while updating the README");
    }
  };

  const startEditingReadme = () => {
    setEditedReadme(profile?.readme || "");
    setIsEditingReadme(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDescription(profile?.description || "");
  };

  const startEditing = () => {
    setEditedDescription(profile?.description || "");
    setIsEditing(true);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 flex flex-col items-center justify-center text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#b428b4] mb-4"></div>
        <p>Loading profile...</p>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-600 flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-800 flex flex-col">
      <Navbar
        username={username}
        setIsAuthenticated={setIsAuthenticated}
        navigate={navigate}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* ---- PROFILE HEADER ---- */}
        <div className="grid grid-cols-12 gap-8 bg-white/90 backdrop-blur-xl border border-[#b428b4]/30 shadow-2xl transition-all duration-300">
          {/* Left Avatar */}
          <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center border-r border-[#b428b4]/20 px-6 py-8">
            <div className="bg-gradient-to-br from-[#b428b4] to-[#3023ae] p-8 shadow-lg shadow-[#b428b4]/40">
              <User className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Joined on {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Right Profile Info */}
          <div className="col-span-12 sm:col-span-8 px-6 py-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b428b4] to-[#3023ae] bg-clip-text text-transparent">
                {profile.username}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>

              <div className="relative group">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full bg-gray-100/50 border border-[#b428b4]/30 p-3 rounded text-sm text-gray-800 focus:outline-none focus:border-[#b428b4] transition-all"
                      rows={3}
                      placeholder="Tell the world who you are..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleSaveDescription}
                        className="flex items-center gap-1 px-3 py-1 bg-[#b428b4] text-white text-xs font-semibold rounded hover:bg-[#b428b4]/80 transition-all shadow-lg shadow-[#b428b4]/20"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white text-xs font-semibold rounded hover:bg-gray-600 transition-all"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="text-gray-500 italic text-sm leading-relaxed flex-1">
                      {profile.description ||
                        "No bio provided yet. You can add one to tell the world who you are."}
                    </p>
                    <button
                      onClick={startEditing}
                      className="p-1.5 text-gray-500 hover:text-[#b428b4] transition-colors"
                      title="Edit description"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center justify-center text-center border border-[#b428b4]/20 px-4 py-4">
                  <div className="flex items-center gap-2 text-[#b428b4] font-semibold">
                    <Users className="w-4 h-4" />
                    {profile.followedUser}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Followings</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center border border-[#3023ae]/20 px-4 py-4">
                  <div className="flex items-center gap-2 text-[#3023ae] font-semibold">
                    <Users className="w-4 h-4 rotate-180" />
                    {profile.followingUser}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Followers</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center border border-[#ffbe0b]/20 px-4 py-4">
                  <div className="flex items-center gap-2 text-[#ffbe0b] font-semibold">
                    <GitBranch className="w-4 h-4" />
                    {profile.repositories}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Repositories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- PROFILE README SECTION ---- */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#b428b4]/30 shadow-2xl overflow-hidden transition-all duration-300">
          <div className="px-6 py-4 border-b border-[#b428b4]/20 flex justify-between items-center bg-gray-100/40">
            <div className="flex items-center gap-2 text-sm font-mono text-gray-500">
              <FileText className="w-4 h-4 text-[#b428b4]" />
              <span>{profile.username} / README.md</span>
            </div>
            {!isEditingReadme && (
              <button
                onClick={startEditingReadme}
                className="text-xs text-[#3023ae] hover:underline flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> {profile.readme ? "Edit README" : "Add README"}
              </button>
            )}
          </div>

          <div className="p-6">
            {isEditingReadme ? (
              <div className="space-y-4">
                <textarea
                  value={editedReadme}
                  onChange={(e) => setEditedReadme(e.target.value)}
                  className="w-full bg-gray-100/50 border border-[#b428b4]/30 p-4 rounded text-sm text-gray-800 font-mono focus:outline-none focus:border-[#b428b4] transition-all"
                  rows={12}
                  placeholder="### Hi there 👋 Write your profile README using Markdown..."
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleSaveReadme}
                    className="flex items-center gap-1 px-4 py-2 bg-[#b428b4] text-white text-xs font-semibold rounded hover:bg-[#b428b4]/80 transition-all shadow-lg shadow-[#b428b4]/20"
                  >
                    <Check className="w-3 h-3" /> Save README
                  </button>
                  <button
                    onClick={() => setIsEditingReadme(false)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-700 text-white text-xs font-semibold rounded hover:bg-gray-600 transition-all"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group prose prose-invert max-w-none text-gray-600 prose-headings:text-[#3023ae] prose-a:text-[#b428b4] prose-strong:text-[#ffbe0b] prose-code:text-[#b428b4] prose-pre:bg-gray-100/80">
                {profile.readme ? (
                  <>
                    <button
                      onClick={startEditingReadme}
                      className="absolute -top-2 -right-2 p-2 bg-gray-100 border border-[#b428b4]/30 text-gray-500 hover:text-[#b428b4] opacity-0 group-hover:opacity-100 transition-all rounded shadow-xl"
                      title="Edit README"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
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
                      {profile.readme}
                    </ReactMarkdown>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#b428b4]/20 rounded-lg bg-gray-100/20">
                    <p className="text-gray-500 italic text-sm mb-4">You can add a README to your profile to tell the world about yourself!</p>
                    <button
                      onClick={startEditingReadme}
                      className="px-4 py-2 border border-[#b428b4] text-[#b428b4] text-xs font-semibold rounded hover:bg-[#b428b4] hover:text-white transition-all"
                    >
                      Initialize Profile README
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---- REPOSITORIES SECTION ---- */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#b428b4]/30 shadow-2xl p-8 transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-[#b428b4]/20 pb-4 mb-6">
            <Globe className="w-6 h-6 text-[#3023ae]" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#b428b4] to-[#3023ae] bg-clip-text text-transparent">
              Repositories <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 ml-2">{repos.length}</span>
            </h2>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/50 border border-dashed border-[#b428b4]/30">
              <GitBranch className="w-12 h-12 text-[#b428b4]/30 mx-auto mb-3" />
              <p className="text-gray-500">No repositories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.map((repo) => (
                <div
                  key={repo._id}
                  onClick={() => navigate(`/repo/${profile.username}/${repo.name}`)}
                  className="group flex flex-col p-5 border border-[#b428b4]/20 bg-gray-50 hover:bg-[#b428b4]/5 transition-all cursor-pointer hover:shadow-lg hover:border-[#b428b4]/40"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-[#3023ae] group-hover:text-[#b428b4] transition-colors break-words max-w-[80%]">
                      {repo.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 border border-[#b428b4]/20 rounded-full shadow-sm">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      {repo.starred}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-3 border-t border-[#b428b4]/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b428b4]"></div>
                      <span>Updated {repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 border border-gray-300 rounded-full">{repo.visibility === 'private' ? 'Private' : 'Public'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </main>
    </div>
  );
}
