import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Code, GitBranch, Users, Lock, Zap, Copy, Check,
  Terminal, History, Search, RefreshCw, Layers, ShieldCheck,
  ChevronRight, Database, Globe
} from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function LandingPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const girgitCommands = [
    { cmd: "girgit begin", icon: <ShieldCheck className="w-5 h-5" />, desc: "Secure authentication. Start your developer session.", color: "text-[#3023ae]" },
    { cmd: "girgit init", icon: <Database className="w-5 h-5" />, desc: "Initialize a fresh Girgit Hub repository in your folder.", color: "text-[#b428b4]" },
    { cmd: "girgit add", icon: <Layers className="w-5 h-5" />, desc: "Stage your local changes for the next commit.", color: "text-[#ffbe0b]" },
    { cmd: "girgit commit", icon: <Zap className="w-5 h-5" />, desc: "Capture a snapshot of your staged files permanently.", color: "text-[#3023ae]" },
    { cmd: "girgit push", icon: <Globe className="w-5 h-5" />, desc: "Synchronize local commits with your remote Space.", color: "text-[#b428b4]" },
    { cmd: "girgit save-version", icon: <RefreshCw className="w-5 h-5" />, desc: "Streamlined backup: init, add, commit, & push at once.", color: "text-[#ffbe0b]" },
    { cmd: "girgit diff", icon: <Search className="w-5 h-5" />, desc: "Compare versions with stage-vs-cwd or commit-vs-stage.", color: "text-[#3023ae]" },
    { cmd: "girgit clone", icon: <RefreshCw className="w-5 h-5" />, desc: "Download any public or private repository from the cloud.", color: "text-[#b428b4]" },
    { cmd: "girgit status", icon: <Terminal className="w-5 h-5" />, desc: "Real-time overview of modified and tracked files.", color: "text-[#ffbe0b]" },
    { cmd: "girgit log", icon: <History className="w-5 h-5" />, desc: "Browse through your entire versioning history.", color: "text-[#3023ae]" },
    { cmd: "girgit unstage", icon: <Layers className="w-5 h-5" />, desc: "Safely remove files from the staging area.", color: "text-[#b428b4]" },
    { cmd: "girgit revert", icon: <History className="w-5 h-5" />, desc: "Roll back your repository to any specific commit.", color: "text-[#ffbe0b]" }
  ];

  return (
    <div className="w-screen min-h-screen bg-gray-100 text-gray-800 overflow-x-hidden selection:bg-[#b428b4]/30 selection:text-[#3023ae]">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#b428b4] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3023ae] blur-[150px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b border-[#b428b4]/20 bg-gray-100/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="p-1.5 bg-gradient-to-br from-[#b428b4] to-[#3023ae] rounded-lg">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-[#b428b4] to-[#3023ae] bg-clip-text text-transparent tracking-tighter">
              GIRGIT HUB
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-sm font-bold text-[#3023ae] hover:text-[#b428b4] transition-all"
            >
              SIGN IN
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 bg-gradient-to-r from-[#b428b4] to-[#3023ae] text-white text-sm font-black rounded-full hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] transition-all"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b428b4]/10 border border-[#b428b4]/30 mb-8 animate-bounce-slow">
            <span className="w-2 h-2 rounded-full bg-[#b428b4]"></span>
            <span className="text-xs font-bold text-[#b428b4] tracking-widest uppercase">The Future of Local Versioning</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1]">
          <span className="text-gray-900">CONTROL YOUR</span>
          <br />
          <span className="bg-gradient-to-r from-[#b428b4] via-[#ffbe0b] to-[#3023ae] bg-clip-text text-transparent">
            CODE UNIVERSE.
          </span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          Girgit Hub is a high-performance, decentralized version control system designed for developers who demand speed, style, and absolute control over their local history.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="group px-10 py-5 bg-gradient-to-r from-[#b428b4] to-[#3023ae] text-white font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,0,110,0.3)]"
          >
            START DEPLOYING <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection("commands")}
            className="px-10 py-5 border-2 border-[#3023ae]/30 text-[#3023ae] font-black rounded-2xl hover:bg-[#3023ae]/5 hover:border-[#3023ae] transition-all"
          >
            VIEW COMMANDS
          </button>
        </div>
      </section>

      {/* Command Reference Section */}
      <section id="commands" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            COMMAND <span className="text-[#3023ae]">REFERENCE</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-[0.2em] font-bold text-sm">
            Master the 12 core operations of Girgit Hub
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {girgitCommands.map((command, idx) => (
            <div 
              key={idx} 
              className="group bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/[0.08] hover:border-[#3023ae]/50 transition-all duration-300"
            >
              <div className={`mb-4 transition-transform group-hover:scale-110 ${command.color}`}>
                {command.icon}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#3023ae] transition-colors">
                {command.cmd}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {command.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Visual Flow) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-32 rounded-[4rem] bg-white/[0.02] border border-white/5 shadow-inner">
        <h2 className="text-4xl font-black text-center mb-20 text-gray-900">
          THE <span className="text-[#b428b4]">WORKFLOW</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
                <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-gradient-to-br from-[#b428b4] to-[#b428b4]/40 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_20px_rgba(255,0,110,0.3)]">01</div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-900 mb-3">Initialize & Track</h4>
                        <p className="text-gray-500 font-medium italic">"girgit init && girgit begin"</p>
                        <p className="text-gray-500 mt-2">Initialize your Space and link it to your developer profile in seconds.</p>
                    </div>
                </div>

                <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3023ae] to-[#3023ae]/40 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_20px_rgba(0,217,255,0.3)]">02</div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-900 mb-3">Stage & Snapshot</h4>
                        <p className="text-gray-500 font-medium italic">"girgit add . && girgit commit \"message\""</p>
                        <p className="text-gray-500 mt-2">Capture changes with atomic precision. Track everything from lines to binary assets.</p>
                    </div>
                </div>

                <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-gradient-to-br from-[#ffbe0b] to-[#ffbe0b]/40 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_20px_rgba(255,190,11,0.3)]">03</div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-900 mb-3">Synchronize</h4>
                        <p className="text-gray-500 font-medium italic">"girgit push"</p>
                        <p className="text-gray-500 mt-2">Instantly sync your local history to Girgit Hub for cloud-based accessibility.</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#0a0b0f] border border-[#b428b4]/30 rounded-[3rem] p-4 shadow-[0_0_60px_rgba(255,0,110,0.1)] overflow-hidden">
                <div className="flex bg-white/5 p-4 items-center gap-2 rounded-t-[2rem]">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-[10px] text-gray-500 font-black ml-4">TERMINAL v2.0</span>
                </div>
                <div className="p-8 font-mono text-sm overflow-x-auto min-h-[400px]">
                    <SyntaxHighlighter language="bash" style={tomorrow} customStyle={{ background: "transparent", padding: "0" }}>
{`$ girgit begin
 Authenticating user... Success!
 Welcome back, Developer.

$ girgit init web-app
 New repository created: web-app

$ girgit status
 M index.tsx (Modified)
 A components/Card.tsx (Added)

$ girgit save-version
 Running auto-pipeline...
 [+] Staging 2 files
 [+] Creating commit: Auto-Save
 [+] Pushing to cloud
 Done! Space updated.`}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-white/[0.05] to-transparent p-10 rounded-[3rem] border border-white/10 hover:border-[#b428b4]/40 transition-all shadow-2xl">
            <div className="bg-[#b428b4]/20 p-5 rounded-3xl w-fit mb-8 group-hover:bg-[#b428b4] transition-all">
              <Zap className="w-8 h-8 text-[#b428b4] group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Warp-Speed Push</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Compressed binary transfers ensure your code reaches the space station in milliseconds.</p>
          </div>

          <div className="group bg-gradient-to-br from-white/[0.05] to-transparent p-10 rounded-[3rem] border border-white/10 hover:border-[#3023ae]/40 transition-all shadow-2xl">
            <div className="bg-[#3023ae]/20 p-5 rounded-3xl w-fit mb-8 group-hover:bg-[#3023ae] transition-all">
              <Lock className="w-8 h-8 text-[#3023ae] group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Zero-Trust Security</h3>
            <p className="text-gray-500 font-medium leading-relaxed">End-to-end encrypted repositories ensure your intellectual property stays yours.</p>
          </div>

          <div className="group bg-gradient-to-br from-white/[0.05] to-transparent p-10 rounded-[3rem] border border-white/10 hover:border-[#ffbe0b]/40 transition-all shadow-2xl">
            <div className="bg-[#ffbe0b]/20 p-5 rounded-3xl w-fit mb-8 group-hover:bg-[#ffbe0b] transition-all">
              <History className="w-8 h-8 text-[#ffbe0b] group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Deep History Log</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Traverse through time with complete lineage tracking and atomic diffing visualizations.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 pb-40">
        <div className="relative group bg-gradient-to-r from-[#b428b4]/10 to-[#3023ae]/10 border border-white/10 rounded-[4rem] p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#b428b4]/5 to-[#3023ae]/5 group-hover:scale-110 transition-transform duration-700"></div>
          <h2 className="text-5xl font-black text-gray-900 mb-8 relative z-10">THE SPACE IS WAITING.</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-12 text-lg relative z-10 font-medium italic">"Join 5,000+ developers tracking their progress with Girgit Hub."</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button
              onClick={() => navigate("/register")}
              className="px-12 py-5 bg-white text-[#0d0221] font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              CREATE FREE ACCOUNT
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-12 py-5 border border-white/20 text-gray-900 font-black rounded-2xl hover:bg-white/10 transition-all"
            >
              LOGIN TO SPACE
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0b0f]/80 backdrop-blur-2xl py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-1 px-3 bg-gradient-to-br from-[#b428b4] to-[#3023ae] rounded-lg text-white font-black text-xl italic">J</div>
                <span className="text-2xl font-black text-gray-900">GIRGIT HUB</span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
                The ultimate version control orbit for modern software architects. Fast, safe, and visually elite.
              </p>
              <div className="flex gap-4">
                  {/* Social placeholders could go here */}
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-black text-lg mb-8 uppercase tracking-widest">Orbit</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors">WORKFLOW</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">SECURITY</button></li>
                <li><button onClick={() => scrollToSection("commands")} className="hover:text-white transition-colors">COMMANDS</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-black text-lg mb-8 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><a href="https://github.com/JagdishPathakji" target="_blank" className="hover:text-[#b428b4] transition-colors">GITHUB</a></li>
                <li><a href="#" className="hover:text-[#ffbe0b] transition-colors">SUPPORT</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-20 pt-10 text-center flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-600 font-black text-sm tracking-widest">© 2026 GIRGIT HUB. ENGINEERED BY JAGDISH PATHAKJI.</p>
            <div className="flex gap-8 text-xs font-black text-gray-700 tracking-[0.3em]">
                <a href="#">PRIVACY</a>
                <a href="#">TERMS</a>
                <a href="#">COOKIES</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
