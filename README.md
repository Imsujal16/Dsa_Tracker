# 💻 SJ Code — Custom C++ IDE & Daily GitHub Auto-Push

> **A modern, lightweight C++ development environment (like VS Code) that compiles & runs your code locally and automatically pushes your daily progress to GitHub!**

---

## 🔥 Features

- 🎨 **VS Code Editor Engine:** Built with Monaco Editor (`vs-dark` theme, C++ syntax highlighting, auto-formatting, line numbers, and tab completion).
- ⚡ **1-Click Execution & Shortcuts:** Compiles & executes C++ code with local `g++` in milliseconds. Press `Ctrl + Enter` inside the editor to run instantly.
- 📥 **Interactive `std::cin` Input Support:** Dedicated `Input (stdin)` tab for passing inputs to interactive C++ programs.
- 🔄 **Automated Daily GitHub Push:** Built-in `node-cron` scheduler automatically commits and pushes your `workspace/` code to GitHub every day (default: 11:00 PM).
- 🖱️ **Manual 1-Click Sync:** "Sync to GitHub" button in the header toolbar for instant pushes anytime.
- 🖥️ **Standalone Desktop Web App:** Launches in silent windowed app mode (without browser tabs/clutter). Can be pinned directly to your Windows Taskbar for 1-click launch!

---

## 🛠️ Complete Step-by-Step Setup Guide

Follow these simple steps to set up **SJ Code** on any Windows laptop:

### 1️⃣ Prerequisites

Before installing, ensure your laptop has:
1. **Node.js (v18 or higher):** [Download Node.js](https://nodejs.org/)
2. **Git:** [Download Git for Windows](https://git-scm.com/)
3. **C++ Compiler (`g++` / MinGW):** Ensure `g++` is installed and added to your system `PATH`.
   - *To test if `g++` is installed, open Command Prompt (`cmd`) and run:* `g++ --version`

---

### 2️⃣ Clone the Repository

Open Command Prompt or PowerShell and clone this repo:

```bash
git clone https://github.com/Imsujal16/Dsa_Tracker.git
cd Dsa_Tracker
```

---

### 3️⃣ Install Dependencies

Install the required npm packages for both backend and frontend:

**Install Backend Packages:**
```bash
cd backend
npm install
cd ..
```

**Install Frontend Packages:**
```bash
cd frontend
npm install
npm run build
cd ..
```

---

### 4️⃣ One-Click App Setup & Launch

We have included easy scripts so you don't have to manage command line windows:

1. **Create Desktop Shortcut:**
   Double-click `create_shortcut.vbs` (or run `cscript create_shortcut.vbs` in terminal). This will create an **`SJ Code`** icon on your Windows Desktop.
2. **Launch the App:**
   Double-click the **`SJ Code`** Desktop shortcut (or run `run.bat`).
3. **Pin to Taskbar:**
   When the app window opens, right-click the **SJ Code** icon on your Windows Taskbar and click **"Pin to taskbar"**. Now it's available in 1-click anytime!

---

## ⚙️ Configuring Your GitHub Repository

1. Open **SJ Code**.
2. Click the **Settings (⚙️)** icon in the top-right header toolbar.
3. Paste your GitHub Repository URL (e.g. `https://github.com/username/your-dsa-repo.git`).
4. Set your preferred **Daily Auto-Push Time** (e.g. `23:00` for 11:00 PM).
5. Click **Save Settings**.

---

## 📁 Project Directory Structure

```text
SJ Code/
├── workspace/                  # Your C++ source files (auto-synced to GitHub)
│   ├── main.cpp
│   └── dsa_test.cpp
├── backend/                    # Node.js + Express backend
│   ├── server.js               # Compiler API, execution handler, Git cron job
│   ├── config.json             # Stores GitHub repo URL & push schedule
│   └── package.json
├── frontend/                   # React + Vite + Monaco Editor
│   ├── src/
│   │   ├── App.jsx             # Main IDE layout & terminal
│   │   └── index.css           # VS Code dark theme styles
│   └── dist/                   # Production build
├── launch_app.vbs              # Silent launcher script
├── create_shortcut.vbs         # Windows shortcut generator
├── run.bat                     # One-click batch launcher
└── README.md
```

---

## 💻 Tech Stack

- **Frontend:** React 19, Vite, `@monaco-editor/react`, `lucide-react`, Vanilla CSS
- **Backend:** Node.js, Express, `node-cron`, Child Process (`g++`, `git`)
- **Desktop Integration:** VBScript, Chrome/Edge Standalone App Mode (`--app=http://localhost:5000`)

---

## 🤝 Contributing & License

Feel free to fork this repository, submit pull requests, or customize it for your DSA / competitive programming practice!

Happy Coding! 🚀
