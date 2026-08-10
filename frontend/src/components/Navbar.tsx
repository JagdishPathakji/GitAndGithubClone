import { Code2, LogOut, User, BookOpen } from "lucide-react";
import handleLogout from "../functionalities/handleLogout";
import { useState, useEffect } from "react";

interface NavbarProps {
  username?: string;
  setIsAuthenticated?: (value: boolean) => void;
  navigate?: any;
}

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

export default function Navbar({
  username = "User",
  setIsAuthenticated,
  navigate,
}: NavbarProps) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const logout = async () => {
    const res = await handleLogout();

    if (res.status === true) {
      setToast({ message: res.message, type: "success" });
      setIsAuthenticated(false);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } else {
      setToast({ message: `Logout Failed: ${res.message}`, type: "error" });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <nav className="bg-gradient-to-r from-gray-100 via-white to-gray-100 border-b border-[#b428b4]/30 sticky top-0 z-50 shadow-lg shadow-[#b428b4]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#b428b4] to-[#3023ae] rounded-lg shadow-lg shadow-[#b428b4]/40 hover:scale-110 transition-transform">
                <Code2
                  className="w-6 h-6 text-white"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <span
                className="text-xl font-mono font-bold bg-gradient-to-r from-[#b428b4] to-[#3023ae] bg-clip-text text-transparent"
                onClick={() => {
                  navigate("/dashboard");
                }}
                style={{ cursor: "pointer" }}
              >
                Girgit Hub
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* <button
                onClick={() => navigate("/documentation")}
                className="text-sm text-gray-600 hover:text-[#3023ae] transition-colors duration-200 p-2 hover:bg-[#3023ae]/10 rounded-lg flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Docs</span>
              </button> */}

              <span
                className="text-sm text-gray-600 hidden sm:block hover:text-[#b428b4] transition-colors cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                {username}
              </span>

              {/* Square Profile Icon */}
              <div
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#b428b4]/20 to-[#3023ae]/20 rounded-lg border border-[#b428b4]/30 hover:border-[#b428b4]/60 transition-all"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                <User className="w-5 h-5 text-[#b428b4]" />
              </div>

              <button
                onClick={logout}
                className="ml-3 text-gray-500 hover:text-[#b428b4] transition-colors duration-200 p-2 hover:bg-[#b428b4]/10 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}