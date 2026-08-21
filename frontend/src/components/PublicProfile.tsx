import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  User,
  Users,
  GitBranch,
  Star,
  Globe,
  FileText,
  Settings,
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cachedFetch } from "../utils/apiCache";

interface Repository {
  _id: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  starred: number;
  createdAt: string;
  updatedAt: string;
}

interface PublicUserProfile {
  _id: string;
  username: string;
  createdAt: string;
  followedUser: number;
  followingUser: number;
  description: string;
  readme: string;
}

export default function PublicProfile({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) {
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { username } = useParams();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [follower, setFollower] = useState(null);
  const [followstatus, setFollowstatus] = useState(null);

  const addAFollower = async (username: any) => {
    try {
      const res = await fetch(
        `https://version-control-system-mebn.onrender.com/follower/${username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.status === false) {
        alert(data.message);
      } else {
        setFollower(data.count);
        setFollowstatus(data.followstatus);
      }
    } catch (error) {
      console.log("Error occcured during following", error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await cachedFetch(
          `https://version-control-system-mebn.onrender.com/getPublicProfile/${username}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!data.status) throw new Error(data.message);

        setProfile(data.profile);
        setFollowstatus(data.followstatus);
        setFollower(data.profile.followingUser);

        // Fetch public repositories specifically
        const reposData = await cachedFetch(
          `https://version-control-system-mebn.onrender.com/public/repos/${username}`
        );
        if (reposData.status) {
          setRepos(reposData.repos);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

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
        username={localStorage.getItem("username") || ""}
        setIsAuthenticated={setIsAuthenticated}
        navigate={navigate}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* ---- PROFILE HEADER ---- */}
        <div className="grid grid-cols-12 gap-8 bg-white/90 backdrop-blur-xl border border-[#b428b4]/30 shadow-2xl transition-all duration-300">
          {/* Avatar */}
          <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center border-r border-[#b428b4]/20 px-6 py-8">
            <div className="bg-gradient-to-br from-[#b428b4] to-[#3023ae] p-8 shadow-lg shadow-[#b428b4]/40">
              <User className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Joined on {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Profile Info */}
          <div className="col-span-12 sm:col-span-8 px-6 py-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b428b4] to-[#3023ae] bg-clip-text text-transparent">
                {profile.username}
              </h1>

              <p className="text-gray-500 italic text-sm leading-relaxed">
                {profile.description || "No bio available."}
              </p>

              <div className="flex gap-3 mt-5">
                {username !== localStorage.getItem("username") ? (
                  <button
                    className="px-5 py-2 bg-gradient-to-r from-[#b428b4] to-[#3023ae] hover:from-[#ff1a7e] hover:to-[#1ae5ff] text-white font-semibold transition-all shadow-lg shadow-[#b428b4]/40 active:scale-95 flex-1"
                    onClick={() => addAFollower(profile.username)}
                  >
                    {followstatus ? "Following" : "Follow"}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-5 py-2 bg-white border border-[#b428b4]/30 text-gray-600 hover:text-white hover:border-[#b428b4] transition-all flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Manage Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
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
                    {follower}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- PROFILE README SECTION ---- */}
        {profile.readme && (
          <div className="bg-white/90 backdrop-blur-xl border border-[#b428b4]/30 shadow-2xl overflow-hidden transition-all duration-300">
            <div className="px-6 py-4 border-b border-[#b428b4]/20 flex items-center gap-2 text-sm font-mono text-gray-500 bg-gray-100/40">
              <FileText className="w-4 h-4 text-[#b428b4]" />
              <span>{profile.username} / README.md</span>
            </div>
            <div className="p-6">
              <div className="prose prose-invert max-w-none text-gray-600 prose-headings:text-[#3023ae] prose-a:text-[#b428b4] prose-strong:text-[#ffbe0b] prose-code:text-[#b428b4] prose-pre:bg-gray-100/80">
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
              </div>
            </div>
          </div>
        )}


        {/* ---- PUBLIC REPOSITORIES SECTION ---- */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#b428b4]/30 shadow-2xl p-8 transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-[#b428b4]/20 pb-4 mb-6">
            <Globe className="w-6 h-6 text-[#3023ae]" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#b428b4] to-[#3023ae] bg-clip-text text-transparent">
              Public Repositories <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 ml-2">{repos.length}</span>
            </h2>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/50 border border-dashed border-[#b428b4]/30">
              <GitBranch className="w-12 h-12 text-[#b428b4]/30 mx-auto mb-3" />
              <p className="text-gray-500">No public repositories found.</p>
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
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#b428b4]"></div>
                      <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
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
