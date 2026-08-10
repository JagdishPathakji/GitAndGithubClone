import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Bot } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-800">
      <Navbar
        username={username}
        setIsAuthenticated={setIsAuthenticated}
        navigate={navigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Main Content Area */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#3023ae]/30 rounded-none p-10 sm:p-16 shadow-2xl transition-all duration-300 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#3023ae] to-[#b428b4] bg-clip-text text-transparent">
              Welcome to Girgit Space
            </h1>
            <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mt-4">
              Hello {username}! You have successfully authenticated. This is a placeholder dashboard for the authentication module presentation. 
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
