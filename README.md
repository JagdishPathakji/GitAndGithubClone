# 🚀 Girgit Hub - Personal Version Control System

> A lightweight, AI-enhanced version control system with a powerful CLI and a vibrant web interface, using Google Drive as cloud storage.

**Live Demo:** [https://version-control-system-frontend.onrender.com/](https://version-control-system-frontend.onrender.com/)

---

## ✨ How Girgit Hub is Uniquely and Better

While Git and GitHub are industry standards, **Girgit Hub** introduces unique features tailored for modern, social-first development:

1.  **🤖 Integrated AI Code Review**: Unlike Git, Girgit Hub has built-in AI support (`girgit diff`) that analyzes your changes and provides instant feedback, suggestions, and risk assessments.
2.  **☁️ Google Drive as Cloud Provider**: Girgit Hub uses your own Google Drive for storage. No need for complex server setups or worrying about private repo limits on external platforms.
3.  **🔥 Social-First Architecture**: Features like contribution heatmaps, user following, and repository starring are core to the platform, making it feel like a social network for developers from day one.
4.  **⚡ Lightweight & Modern**: Built with a sleek React + TypeScript frontend and a Node.js backend, offering a "glassmorphism" aesthetic that feels premium and state-of-the-art.

---

## 🛠 Features

### 🎯 Core Features
- **Repository Management** - Create, manage, and organize repositories through CLI or Web.
- **Version Control** - Track file changes with UUID-based commits and persistent history.
- **Public/Private Repos** - Toggle visibility to share with the community or keep projects private.
- **File Browsing** - High-performance file tree explorer with syntax highlighting.
- **Commit History** - Detailed timeline of all changes with metadata and parent tracking.
- **Status Tracking** - Real-time monitoring of staged, unstaged, and modified files.

### 🌐 Web Interface (Frontend)
- **Glassmorphic Dashboard**: A beautiful, modern UI with vibrant gradients (Magenta, Cyan, Gold).
- **Contribution Heatmap**: Track your daily push activity with a GitHub-style streak grid.
- **Social Ecosystem**: Follow/unfollow users and discover trending public repositories.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop experiences.
- **Syntax Highlighting**: Preview code files directly in the browser with `react-syntax-highlighter`.

### 💻 CLI Package (Backend2)
- **Command-Line Interface**: A robust CLI built with `yargs` and `chalk`.
- **Local Staging Area**: Manage local changes before committing, similar to Git's staging.
- **AI-Powered Diff**: Automated code analysis using `ChatOllama` (GPT-OSS models).
- **Secure Auth**: OTP-based authentication via terminal for enhanced security.

---

## 💻 CLI Commands (Backend2)

| Command | Description |
| :--- | :--- |
| `girgit begin` | **Authentication**: Initialize the system with secure Login or Signup. |
| `girgit init` | **Initialize**: Create a new empty Girgit Hub repository in the current directory. |
| `girgit add <paths...>` | **Stage**: Add files or folders to the staging area (see below for options). |
| `girgit commit <message>` | **Commit**: Save the current staging area as a new version with a message. |
| `girgit unstage <paths...>`| **Unstage**: Remove files and folders from the staging area. |
| `girgit log` | **History**: Show details of all commits made in the repository. |
| `girgit push` | **Sync**: Push all the commits to your Google Drive remote storage. |
| `girgit status` | **Status**: Check the status of each file/folder (modified, staged, etc.). |
| `girgit diff` | **AI Review**: Compare different states (AI-integrated analysis). |
| `girgit revert <commitId>` | **Undo**: Replace working directory with a specific previous commit. |
| `girgit clone <path>` | **Clone**: Clone a remote repository (username/reponame) to local. |
| `girgit save-version` | **Turbo**: One-click `init` + `add` + `commit` + `push`. |

### **Detailed Command Usage**

#### **Staging & Unstaging**
For both `add` and `unstage`, you can specify multiple targets:

| Command Pattern | Description |
| :--- | :--- |
| `girgit add .` | Stage all files/folders in the current directory. |
| `girgit add <file1> <file2>` | Stage specific multiple files. |
| `girgit add <folder1> <folder2>` | Stage multiple folders. |
| `girgit add <file> <folder>` | Stage a mix of files and folders. |
| `girgit unstage .` | Unstage everything. |
| `girgit unstage <file1> <file2>` | Unstage specific multiple files. |

#### **AI-Powered Diff**
Compare states with integrated AI analysis:
```bash
girgit diff --mode stage-vs-cwd          # Compare staging with current work
girgit diff --mode commit-vs-stage --commitId <id> # Compare commit with stage
girgit diff --mode commit-vs-commit --commitA <id> --commitB <id> # Compare two commits
```

---

## 📂 Project Structure

### 🌐 Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx        # Main user dashboard with stats & repos
│   │   ├── OwnRepo.tsx          # Detailed repository view & file explorer
│   │   ├── LandingPage.tsx      # Premium landing page with animations
│   │   ├── Navbar.tsx           # Responsive navigation component
│   │   ├── StreakGrid.tsx       # Contribution heatmap calendar
│   │   ├── Profile.tsx          # User profile management
│   │   ├── PublicProfile.tsx    # Viewing other users' profiles
│   │   ├── getPublicRepo.tsx    # Public repository discovery
│   │   └── Documentation.tsx    # In-app help & command guide
│   ├── functionalities/         # API abstraction layer
│   │   ├── getAllProfile.tsx
│   │   ├── getAllRepo.tsx
│   │   └── handleLogout.tsx
│   ├── App.tsx                  # Main routing & state
│   └── main.tsx                 # Entry point
├── tailwind.config.js           # Styling configuration
└── vite.config.ts               # Build tool configuration
```

### ⚙️ Backend1 (REST API)
```
backend1/
├── controllers/
│   ├── userController.js        # Auth, Profiles, Streaks, Following
│   ├── repoController.js        # Repository CRUD, Starring, Visibility
│   └── issueController.js       # Issue tracking logic
├── routes/
│   ├── user.router.js           # User-related endpoints
│   ├── repo.router.js           # Repository-related endpoints
│   └── main.router.js           # General API routing
├── database/
│   ├── models/                  # Mongoose Schemas (User, Repo, Content)
│   └── redisConnection.js       # Redis caching for OTP & performance
├── externals/
│   └── sendEmail.js             # Brevo integration for OTP emails
├── config/
│   └── drive-config.js          # Google Drive API configuration
└── index.js                     # Main Express server entry
```

### 🛠 Backend2 (CLI Utility)
```
backend2/
├── controllers/
│   ├── diff-engine/             # 🤖 AI Analysis & Diff Logic
│   │   ├── aiAnalyzer.js        # AI Code Review integration
│   │   ├── diffEngine.js        # File comparison logic
│   │   └── ui.js                # CLI Diff visualization
│   ├── add.js                   # Staging logic with .girgitignore support
│   ├── commit.js                # UUID-based local commit system
│   ├── push.js                  # Google Drive syncing logic
│   ├── status.js                # File state detection
│   └── begin.js                 # CLI Auth flow
├── apicall/
│   └── handleDbForRepo.js       # Syncing local state with Backend1 DB
├── config/
│   └── drive-config.js          # Client-side Drive API setup
└── index.js                     # Yargs CLI entry point (`girgit`)
```

---

## 🚀 Quick Start

### **1. Install CLI**
```bash
npm install -g girgit
```

### **2. Authenticate**
```bash
girgit begin
```

### **3. Start Versioning**
```bash
girgit init
girgit add .
girgit commit "Initial commit with AI check"
girgit push
```

---

## 👨‍💻 Author

**Jagdish Pathakji**

- GitHub: [@JagdishPathakji](https://github.com/JagdishPathakji)
- LinkedIn: [Jagdish Pathakji](https://www.linkedin.com/in/jagdishpathakji)
- Email: pathakjijagdish1@gmail.com

---

**Made with ❤️ by Jagdish Pathakji**
*Last Updated: February 2026*