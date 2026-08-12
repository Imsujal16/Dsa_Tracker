# SJ Code — Custom C++ IDE & Daily GitHub Auto-Push

SJ Code is a lightweight, web-based C++ development environment designed to replicate VS Code's editor experience with built-in compilation, execution, and automated GitHub daily pushes.

---

## 🚀 How to Run

Simply double-click `run.bat` in the root folder!

Or via terminal:
1. **Backend:** `cd backend && node server.js` (runs on http://localhost:5000)
2. **Frontend:** `cd frontend && npm run dev` (runs on http://localhost:3000)

---

## ✨ Features

- **VS Code Monaco Editor:** Full C++ syntax highlighting, auto-completion, line numbers, and dark theme.
- **Instant C++ Compilation & Run:** Powered by local `g++` with error line reporting and timing.
- **Interactive `std::cin` Input:** Use the `Input (stdin)` tab to pass inputs into `cin`.
- **Keyboard Shortcut:** Press `Ctrl + Enter` anytime inside the editor to compile & run instantly.
- **GitHub Auto-Push:** 
  - Automated cron job pushes your workspace `.cpp` files every night at your configured time (e.g. 11:00 PM).
  - Manual **Sync to GitHub** button in the header toolbar.
- **Workspace File Management:** Create, save, and manage multiple `.cpp` files in the `workspace/` directory.

---

## ⚙️ Setting Up Your GitHub Repository

1. Open SJ Code in browser (`http://localhost:3000`).
2. Click the **Settings (⚙️)** icon in the top right.
3. Paste your GitHub repository URL (e.g., `https://github.com/your-username/cpp-dsa-practice.git`).
4. Click **Save Settings**.

---

## 📁 Directory Overview

- `workspace/`: Stores all your `.cpp` source files (these get pushed to GitHub).
- `backend/`: Node.js Express server for compilation (`g++`), execution, and Git background cron scheduler.
- `frontend/`: React + Vite + Monaco Editor UI.
- `run.bat`: One-click double-clickable batch launcher for Windows.
