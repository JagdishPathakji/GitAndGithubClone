import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Bot, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import getAllProfile from "../functionalities/getAllProfile";

/* Toast */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const base =
    "fixed top-6 right-6 z-50 px-6 py-4 border text-sm font-semibold shadow-xl backdrop-blur-md animate-slide-in";
  const styles = {
    success:
      "bg-gray-100/90 border-[#3023ae]/40 text-[#3023ae] shadow-[0_0_30px_rgba(0,217,255,0.4)]",
    error:
      "bg-gray-100/90 border-red-500/40 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    info:
      "bg-gray-100/90 border-[#b428b4]/40 text-[#b428b4] shadow-[0_0_30px_rgba(255,0,110,0.4)]",
  };

  return (
    <div className={`${base} ${styles[type]}`}>
      {message}
    </div>
  );
}

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Developer";

  const { data: profilesRes, isLoading } = useQuery({
    queryKey: ["publicProfiles"],
    queryFn: getAllProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const profiles = Array.isArray(profilesRes?.data) ? profilesRes.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-800">
      <Navbar
        username={username}
        setIsAuthenticated={setIsAuthenticated}
        navigate={navigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="bg-white/90 backdrop-blur-xl border border-[#3023ae]/30 rounded-none p-8 sm:p-12 shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3023ae] to-[#b428b4] bg-clip-text text-transparent">
              Welcome to Girgit Space
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Hello {username}! You have successfully authenticated.
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 justify-center">
              <User className="w-6 h-6 text-[#b428b4]" />
              Registered Users
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-[#b428b4] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-2">Loading users...</p>
              </div>
            ) : profiles.length === 0 ? (
              <p className="text-center text-gray-500 py-8 bg-gray-50 border border-gray-200">
                No users found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {profiles.map((profile, index) => (
                  <div 
                    key={index} 
                    onClick={() => navigate(`/publicProfile/${profile.username}`)}
                    className="flex items-center gap-4 p-4 border border-[#b428b4]/20 bg-gray-50 hover:bg-[#b428b4]/5 transition-colors cursor-pointer hover:shadow-md hover:border-[#b428b4]/40"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#b428b4]/20 to-[#3023ae]/20 border border-[#b428b4]/30 rounded-full flex-shrink-0">
                      <User className="w-6 h-6 text-[#b428b4]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {profile.username || "Unknown"}
                      </h4>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}