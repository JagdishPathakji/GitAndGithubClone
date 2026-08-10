import { useNavigate } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Navbar from "../components/Navbar";

export default function Documentation({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("installation");

  // Dynamically get username from localStorage (as seen in Login.tsx/Dashboard.tsx)
  const username = localStorage.getItem("username") || "User";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const sections = [
    { id: "installation", label: "Installation", icon: "⚙️" },
    { id: "commands", label: "Commands", icon: "🎯" },
    { id: "workflow", label: "Workflow", icon: "📊" },
    { id: "faq", label: "FAQ", icon: "❓" },
  ];

  const commands = [
    {
      cmd: "girgit begin",
      desc: "Start authentication. It lets you login/signup for using Girgit Hub commands. Must be run first before other commands.",
      example: "girgit begin",
      notes: "You will be prompted to enter your email/password in terminal.",
    },
    {
      cmd: "girgit init",
      desc: "Initialize a new repository in the current directory. Creates necessary metadata files.",
      example: "girgit init my-project",
      notes: "Repository name should be unique within your account.",
    },
    {
      cmd: "girgit add",
      desc: "Stage files or directories for commit. You can stage specific files or all changes.",
      example: "girgit add .",
      notes: "Use 'girgit unstage <file>' to remove files from staging.",
    },
    {
      cmd: "girgit commit",
      desc: "Create a new commit for all staged changes. You should provide a descriptive message.",
      example: 'girgit commit "Added authentication module"',
      notes: "Always write meaningful commit messages.",
    },
    {
      cmd: "girgit save-version",
      desc: "A powerful combination of init, add, commit, and push in a single command. It also helps you set up .girgitignore.",
      example: "girgit save-version",
      notes: "Follow the terminal prompts to complete the process.",
    },
    {
      cmd: "girgit push",
      desc: "Push local commits to remote repository.",
      example: "girgit push",
      notes: "Make sure you are authenticated and have initialized the repo.",
    },
    {
      cmd: "girgit diff",
      desc: "Compare different states of your repository to see what changed.",
      example: 'girgit diff --mode stage-vs-cwd\ngirgit diff --mode commit-vs-stage --commitId <id>\ngirgit diff --mode commit-vs-commit --commitA <id1> --commitB <id2>',
      notes: "Modes: stage-vs-cwd, commit-vs-stage, commit-vs-commit.",
    },
    {
      cmd: "girgit clone",
      desc: "Clone a remote repository into a local directory.",
      example: "girgit clone username/reponame",
      notes: "Clones the full repository history and sets up remote origin.",
    },
    {
      cmd: "girgit status",
      desc: "View status of files in the repository, including staged, modified, and untracked files.",
      example: "girgit status",
    },
    {
      cmd: "girgit log",
      desc: "View commit history of the current repository.",
      example: "girgit log",
    },
    {
      cmd: "girgit unstage",
      desc: "Remove files from the staging area.",
      example: "girgit unstage <file>",
    },
    {
      cmd: "girgit revert",
      desc: "Undo commits and move repository back to a previous state.",
      example: "girgit revert <commit-hash>",
      notes: "Use carefully! You can specify which commit to revert.",
    },
  ];

  const faq = [
    {
      q: "What's the difference between global and local installation?",
      a: "Global installation allows you to run Girgit Hub from anywhere on your system without npx. Local installation is project-specific and requires using npx before commands.",
    },
    {
      q: "How do I authenticate?",
      a: "Run 'girgit begin' to login or signup. It will prompt you in the terminal for credentials.",
    },
    {
      q: "What is .girgitignore and how do I use it?",
      a: "Similar to .gitignore, .girgitignore is a file that tells Girgit Hub which files or folders to ignore (e.g., node_modules). You can create it manually or via 'girgit save-version'.",
    },
    {
      q: "Can I undo a commit?",
      a: "Yes, 'girgit revert <commit-hash>' allows you to revert a commit.",
    },
    {
      q: "How do I make my repository public?",
      a: "Use the web dashboard to change repository visibility to 'public'.",
    },
    {
      q: "What if I staged the wrong files?",
      a: "Use 'girgit unstage <file>' to remove files from staging before committing.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-800">
      {/* Navbar with dynamic username */}
      <Navbar username={username} setIsAuthenticated={setIsAuthenticated} navigate={navigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-b from-[#1a1629]/95 to-gray-100/95 backdrop-blur-xl border border-[#b428b4]/40 p-6 shadow-2xl shadow-[#b428b4]/5">
              <h3 className="text-sm font-bold text-[#b428b4] uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-[#b428b4] to-[#3023ae]"></span>
                Sections
              </h3>

              <nav className="space-y-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-[#b428b4] to-[#3023ae] text-gray-900 shadow-lg shadow-[#b428b4]/30"
                        : "text-gray-500 hover:bg-[#b428b4]/15 hover:text-[#b428b4] hover:translate-x-1"
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
            <section id="installation" className="scroll-mt-20 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Installation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Global Installation",
                    cmd: "npm install -g girgit",
                    desc: "Install Girgit Hub globally to use anywhere in your system.",
                    note: "Requires admin privileges on some systems.",
                  },
                  {
                    title: "Local Installation",
                    cmd: "npm install girgit",
                    desc: "Install Girgit Hub in the current project folder. Must use npx to run commands.",
                    note: "Useful for project-specific usage.",
                  },
                ].map((inst, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-[#b428b4]/40 p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <h3 className="text-2xl font-bold text-[#b428b4] mb-2">{inst.title}</h3>
                    <p className="text-gray-600 mb-3">{inst.desc}</p>
                    <div className="relative mb-2">
                      <SyntaxHighlighter
                        language="bash"
                        style={tomorrow}
                        customStyle={{
                          backgroundColor: "#1a1629",
                          padding: "16px",
                        }}
                      >
                        {inst.cmd}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(inst.cmd, `install-${idx}`)}
                        className="absolute top-4 right-4 p-2.5 hover:bg-[#b428b4]/20 transition-all"
                      >
                        {copied === `install-${idx}` ? (
                          <Check className="w-5 h-5 text-[#ffbe0b]" />
                        ) : (
                          <Copy className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                    <p className="text-yellow-400 text-sm">{inst.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="commands" className="scroll-mt-20 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Commands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-[#b428b4]/40 p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-[#b428b4]">{cmd.cmd}</h3>
                      <button
                        onClick={() => copyToClipboard(cmd.example, `cmd-${idx}`)}
                        className="p-2 bg-[#b428b4]/20 hover:bg-[#b428b4]/40 transition-colors"
                      >
                        {copied === `cmd-${idx}` ? (
                          <Check className="text-[#ffbe0b]" />
                        ) : (
                          <Copy className="text-white" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 mb-3">{cmd.desc}</p>
                    <div className="overflow-hidden mb-2">
                      <SyntaxHighlighter
                        language="bash"
                        style={tomorrow}
                        customStyle={{
                          backgroundColor: "#1a1629",
                          padding: "16px",
                        }}
                      >
                        {cmd.example}
                      </SyntaxHighlighter>
                    </div>
                    {cmd.notes && <p className="text-yellow-400 text-sm">{cmd.notes}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section id="workflow" className="scroll-mt-20 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Basic Workflow</h2>
              <div className="bg-[#0a0b0f] border border-[#1f2029] p-6 overflow-x-auto">
                <SyntaxHighlighter
                  language="bash"
                  style={tomorrow}
                  customStyle={{
                    backgroundColor: "#1a1629",
                    padding: "16px",
                  }}
                >
{`# Option A: The Manual Flow
girgit begin
girgit init my-project
girgit add .
girgit commit "Initial commit"
girgit push

# Option B: The Streamlined Flow
girgit begin
girgit save-version

# View Changes & History
girgit diff --mode stage-vs-cwd
girgit status
girgit log`}
                </SyntaxHighlighter>
              </div>
            </section>

            <section id="faq" className="scroll-mt-20 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">FAQ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-[#b428b4]/40 p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <h4 className="text-lg font-bold text-[#b428b4] mb-2">❓ {item.q}</h4>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
