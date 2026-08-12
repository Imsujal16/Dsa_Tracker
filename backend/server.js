const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Paths
const WORKSPACE_DIR = path.join(__dirname, '..', 'workspace');
const TEMP_DIR = path.join(__dirname, 'temp');
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Ensure directories exist
if (!fs.existsSync(WORKSPACE_DIR)) fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Load or save config
function getConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
      return {};
    }
  }
  return { repoUrl: '', autoPushTime: '23:00' };
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

// Default initial C++ template
const DEFAULT_CPP = `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to SJ Code Editor!" << endl;
    cout << "Write your C++ code here." << endl;
    return 0;
}
`;

// Initialize default file if workspace is empty
const defaultFile = path.join(WORKSPACE_DIR, 'main.cpp');
if (!fs.existsSync(defaultFile)) {
  fs.writeFileSync(defaultFile, DEFAULT_CPP, 'utf-8');
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. List all .cpp files in workspace
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(WORKSPACE_DIR)
      .filter(f => f.endsWith('.cpp') || f.endsWith('.h') || f.endsWith('.hpp'))
      .map(name => {
        const stat = fs.statSync(path.join(WORKSPACE_DIR, name));
        return {
          name,
          size: stat.size,
          mtime: stat.mtime
        };
      });
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Read specific file content
app.post('/api/files/read', (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ success: false, error: 'Filename is required' });
  
  const filePath = path.join(WORKSPACE_DIR, path.basename(filename));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ success: true, filename, content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Save file
app.post('/api/files/save', (req, res) => {
  const { filename, content } = req.body;
  if (!filename) return res.status(400).json({ success: false, error: 'Filename required' });

  const safeFilename = path.basename(filename).endsWith('.cpp') 
    ? path.basename(filename) 
    : `${path.basename(filename)}.cpp`;

  const filePath = path.join(WORKSPACE_DIR, safeFilename);

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    res.json({ success: true, filename: safeFilename, message: 'File saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete file
app.post('/api/files/delete', (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ success: false, error: 'Filename required' });

  const filePath = path.join(WORKSPACE_DIR, path.basename(filename));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File deleted' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(404).json({ success: false, error: 'File not found' });
  }
});

// 6. Compile & Run C++ Code
app.post('/api/run', async (req, res) => {
  const { code, input = '' } = req.body;
  if (!code) return res.status(400).json({ success: false, error: 'No code provided' });

  const fileId = Date.now();
  const cppFile = path.join(TEMP_DIR, `code_${fileId}.cpp`);
  const exeFile = path.join(TEMP_DIR, `code_${fileId}.exe`);
  const inputFile = path.join(TEMP_DIR, `input_${fileId}.txt`);

  fs.writeFileSync(cppFile, code, 'utf-8');
  fs.writeFileSync(inputFile, input, 'utf-8');

  // Step 1: Compile using g++
  const compileCmd = `g++ -O2 "${cppFile}" -o "${exeFile}"`;
  const startTime = Date.now();

  exec(compileCmd, { timeout: 10000 }, (compileErr, stdout, stderr) => {
    if (compileErr || stderr) {
      // Clean temp files
      cleanupTemp([cppFile, exeFile, inputFile]);
      return res.json({
        success: false,
        stage: 'compilation',
        error: stderr || compileErr.message,
        executionTime: ((Date.now() - startTime) / 1000).toFixed(2)
      });
    }

    // Step 2: Run Executable with stdin input
    const runCmd = `"${exeFile}" < "${inputFile}"`;
    exec(runCmd, { timeout: 5000, maxBuffer: 1024 * 1024 * 5 }, (runErr, runStdout, runStderr) => {
      const execTime = ((Date.now() - startTime) / 1000).toFixed(2);
      cleanupTemp([cppFile, exeFile, inputFile]);

      if (runErr) {
        if (runErr.killed) {
          return res.json({
            success: false,
            stage: 'execution',
            error: 'Execution Timed Out (Limit: 5s). Possible infinite loop in your code.',
            executionTime: execTime
          });
        }
        return res.json({
          success: false,
          stage: 'execution',
          error: runStderr || runErr.message,
          executionTime: execTime
        });
      }

      res.json({
        success: true,
        output: runStdout || '(Code executed with no output)',
        executionTime: execTime
      });
    });
  });
});

function cleanupTemp(files) {
  files.forEach(f => {
    if (fs.existsSync(f)) {
      try { fs.unlinkSync(f); } catch (e) {}
    }
  });
}

// 7. Git Integration & Sync
async function performGitSync(customCommitMsg) {
  return new Promise((resolve) => {
    const rootDir = path.join(__dirname, '..');
    const config = getConfig();

    // Helper function to run shell commands in sequence
    const runCmd = (cmd) => new Promise((res) => {
      exec(cmd, { cwd: rootDir }, (err, stdout, stderr) => {
        res({ err, stdout: stdout.trim(), stderr: stderr.trim() });
      });
    });

    (async () => {
      let logs = [];

      // 1. Ensure Git repository initialized
      const initRes = await runCmd('git init');
      if (initRes.stdout) logs.push(initRes.stdout);

      // 2. Configure Remote URL if specified in config or check existing origin
      let targetRepo = config.repoUrl;
      const remoteRes = await runCmd('git remote get-url origin');
      if (!remoteRes.err && remoteRes.stdout) {
        targetRepo = targetRepo || remoteRes.stdout;
      }

      if (targetRepo) {
        if (remoteRes.err) {
          await runCmd(`git remote add origin ${targetRepo}`);
        } else {
          await runCmd(`git remote set-url origin ${targetRepo}`);
        }
      }

      // 3. Stage files
      await runCmd('git add .');

      // 4. Commit changes (handle "nothing to commit" gracefully)
      const commitMsg = customCommitMsg || `Auto-commit: C++ Code Update [${new Date().toLocaleString()}]`;
      const commitRes = await runCmd(`git commit -m "${commitMsg}"`);
      if (commitRes.stdout) logs.push(commitRes.stdout);

      // 5. If remote repository is configured, pull & push!
      if (targetRepo) {
        await runCmd('git branch -M main');
        
        // Pull remote changes first to prevent push rejection
        const pullRes = await runCmd('git pull origin main --rebase');
        if (pullRes.stdout) logs.push(pullRes.stdout);

        // Push to remote main branch
        const pushRes = await runCmd('git push -u origin main');
        if (pushRes.err && !pushRes.stderr.includes('Everything up-to-date')) {
          logs.push(`Push Note/Error: ${pushRes.stderr || pushRes.err.message}`);
          resolve({
            success: false,
            log: logs.join('\n\n') || 'Push failed. Please check repository permissions or network.'
          });
          return;
        } else {
          logs.push(pushRes.stderr || pushRes.stdout || 'Everything up-to-date on GitHub!');
        }
      }

      resolve({
        success: true,
        log: logs.filter(Boolean).join('\n\n') || 'Git sync completed successfully.'
      });
    })();
  });
}

// Git Sync Endpoint
app.post('/api/git-sync', async (req, res) => {
  const { commitMessage } = req.body;
  const result = await performGitSync(commitMessage);
  res.json(result);
});

// Config Endpoints
app.get('/api/config', (req, res) => {
  res.json({ success: true, config: getConfig() });
});

app.post('/api/config', (req, res) => {
  const { repoUrl, autoPushTime } = req.body;
  const cfg = getConfig();
  if (repoUrl !== undefined) cfg.repoUrl = repoUrl;
  if (autoPushTime !== undefined) cfg.autoPushTime = autoPushTime;
  saveConfig(cfg);

  // Re-schedule cron if time changed
  setupCronJob();
  res.json({ success: true, config: cfg, message: 'Configuration saved' });
});

// Git status check
app.get('/api/git-status', (req, res) => {
  const rootDir = path.join(__dirname, '..');
  exec('git status --short', { cwd: rootDir }, (err, stdout) => {
    exec('git log -1 --format="%cd (%cr) - %s"', { cwd: rootDir }, (logErr, logStdout) => {
      res.json({
        success: true,
        modifiedFiles: stdout.trim().split('\n').filter(Boolean),
        lastCommit: logStdout.trim() || 'No commits yet'
      });
    });
  });
});

// ----------------------------------------------------
// CRON JOB SETUP (Daily Auto Push)
// ----------------------------------------------------
let activeCron = null;

function setupCronJob() {
  const config = getConfig();
  const time = config.autoPushTime || '23:00'; // Default 11 PM
  const [hour, minute] = time.split(':');

  if (activeCron) activeCron.stop();

  // Schedule cron pattern: "minute hour * * *"
  const cronPattern = `${minute || '0'} ${hour || '23'} * * *`;
  
  try {
    activeCron = cron.schedule(cronPattern, async () => {
      console.log(`[${new Date().toISOString()}] Starting Daily GitHub Auto-Push...`);
      const result = await performGitSync('Daily Automatic GitHub Push');
      console.log('Cron Git Sync Result:', result);
    });
    console.log(`Scheduled Daily Auto-Push at ${time} everyday (Cron: ${cronPattern})`);
  } catch (e) {
    console.error('Error setting up Cron job:', e.message);
  }
}

setupCronJob();

// Start Server
app.listen(PORT, () => {
  console.log(`SJ Code Backend Server running on http://localhost:${PORT}`);
});
