import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Save, GitBranch, Settings, Plus, Trash2, Terminal, 
  FileCode, CheckCircle, AlertCircle, RefreshCw, X, Clock, UploadCloud 
} from 'lucide-react';

export default function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState('main.cpp');
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to SJ Code C++ IDE!" << endl;\n    return 0;\n}\n`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('Click "Run Code" to compile and execute your C++ program.');
  const [outputType, setOutputType] = useState('info'); // info, success, error
  const [executionTime, setExecutionTime] = useState(null);
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [activeTab, setActiveTab] = useState('output');
  const [gitLog, setGitLog] = useState('');
  const [lastCommit, setLastCommit] = useState('');
  
  const [showSettings, setShowSettings] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [autoPushTime, setAutoPushTime] = useState('23:00');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const editorRef = useRef(null);

  // Load files & config on mount
  useEffect(() => {
    fetchFiles();
    fetchConfig();
    fetchGitStatus();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
        if (data.files.length > 0 && !data.files.find(f => f.name === currentFile)) {
          loadFile(data.files[0].name);
        }
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.success) {
        setRepoUrl(data.config.repoUrl || '');
        setAutoPushTime(data.config.autoPushTime || '23:00');
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    }
  };

  const fetchGitStatus = async () => {
    try {
      const res = await fetch('/api/git-status');
      const data = await res.json();
      if (data.success) {
        setLastCommit(data.lastCommit);
      }
    } catch (err) {
      console.error('Error fetching git status:', err);
    }
  };

  const loadFile = async (filename) => {
    try {
      const res = await fetch('/api/files/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentFile(filename);
        setCode(data.content);
      }
    } catch (err) {
      console.error('Error reading file:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/files/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: currentFile, content: code })
      });
      const data = await res.json();
      if (data.success) {
        fetchFiles();
      }
    } catch (err) {
      console.error('Error saving file:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    setIsCompiling(true);
    setActiveTab('output');
    setOutput('Compiling and executing...');
    setOutputType('info');
    setExecutionTime(null);

    // Auto save before run
    await handleSave();

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input })
      });
      const data = await res.json();
      
      setExecutionTime(data.executionTime);
      if (data.success) {
        setOutput(data.output);
        setOutputType('success');
      } else {
        setOutput(data.error || 'Compilation or Execution error occurred.');
        setOutputType('error');
      }
    } catch (err) {
      setOutput('Failed to connect to backend server.');
      setOutputType('error');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleGitSync = async () => {
    setIsSyncing(true);
    setActiveTab('git');
    setGitLog('Initiating Git push to GitHub...');

    try {
      const res = await fetch('/api/git-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitMessage: `Manual push: updated ${currentFile}` })
      });
      const data = await res.json();

      if (data.success) {
        setGitLog(`✅ Push Successful!\n\n${data.log}`);
        fetchGitStatus();
      } else {
        setGitLog(`❌ Git Push Failed:\n\n${data.log}\n\nMake sure your GitHub Repo URL is set in Settings!`);
      }
    } catch (err) {
      setGitLog('Network error during Git push.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, autoPushTime })
      });
      setShowSettings(false);
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!newFileName) return;
    const name = newFileName.endsWith('.cpp') ? newFileName : `${newFileName}.cpp`;
    const initialContent = `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Solution for ${name}\n    cout << "Hello World!" << endl;\n    return 0;\n}\n`;

    await fetch('/api/files/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: name, content: initialContent })
    });

    setNewFileName('');
    setShowNewFileModal(false);
    await fetchFiles();
    loadFile(name);
  };

  const handleDeleteFile = async (filename) => {
    if (files.length <= 1) {
      alert("You cannot delete the last file!");
      return;
    }
    if (confirm(`Delete ${filename}?`)) {
      await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      const updatedFiles = files.filter(f => f.name !== filename);
      setFiles(updatedFiles);
      if (currentFile === filename) {
        loadFile(updatedFiles[0].name);
      }
    }
  };

  // Keyboard shortcut Ctrl+Enter to run code
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <FileCode size={20} color="#fff" />
          </div>
          <span>SJ Code <span style={{ fontSize: '0.7rem', color: '#6366f1', marginLeft: '4px' }}>C++ IDE</span></span>
        </div>

        <div className="header-controls">
          {/* File dropdown selector */}
          <div className="file-selector-container">
            <FileCode size={16} color="#9ca3af" />
            <select 
              value={currentFile} 
              onChange={(e) => loadFile(e.target.value)}
              className="file-select"
            >
              {files.map(f => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-secondary" onClick={handleSave} disabled={isSaving}>
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button className="btn btn-primary" onClick={handleRun} disabled={isCompiling}>
            <Play size={16} />
            {isCompiling ? 'Running...' : 'Run Code (Ctrl+Enter)'}
          </button>

          <button className="btn btn-github" onClick={handleGitSync} disabled={isSyncing}>
            <UploadCloud size={16} />
            {isSyncing ? 'Pushing...' : 'Sync to GitHub'}
          </button>

          <button className="btn-icon-only" onClick={() => setShowSettings(true)} title="Settings & GitHub Config">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="main-workspace">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <span>Workspace (.cpp)</span>
            <button className="btn-icon-only" onClick={() => setShowNewFileModal(true)} title="Create New File">
              <Plus size={16} />
            </button>
          </div>
          <div className="file-list">
            {files.map(f => (
              <div 
                key={f.name} 
                className={`file-item ${currentFile === f.name ? 'active' : ''}`}
                onClick={() => loadFile(f.name)}
              >
                <div className="file-name-group">
                  <FileCode size={14} />
                  <span>{f.name}</span>
                </div>
                {files.length > 1 && (
                  <button 
                    className="btn-icon-only" 
                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(f.name); }}
                    title="Delete file"
                    style={{ padding: '2px' }}
                  >
                    <Trash2 size={12} color="#ef4444" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* GitHub Status Footer */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <GitBranch size={14} color="#10b981" />
              <strong style={{ color: '#fff' }}>Daily Auto-Push: {autoPushTime}</strong>
            </div>
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {lastCommit || 'Ready to sync'}
            </div>
          </div>
        </aside>

        {/* Center/Right Panel: Monaco Editor + Terminal Output */}
        <main className="editor-panel-group">
          {/* Monaco Editor */}
          <div className="editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="cpp"
              language="cpp"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: true },
                automaticLayout: true,
                tabSize: 4,
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                bracketPairColorization: { enabled: true },
                smoothScrolling: true
              }}
            />
          </div>

          {/* Bottom Terminal Panel */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <div className="terminal-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
                  onClick={() => setActiveTab('output')}
                >
                  <Terminal size={14} /> Output
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'input' ? 'active' : ''}`}
                  onClick={() => setActiveTab('input')}
                >
                  Input (stdin)
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'git' ? 'active' : ''}`}
                  onClick={() => setActiveTab('git')}
                >
                  <GitBranch size={14} /> Git Sync Log
                </button>
              </div>

              {executionTime && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Executed in {executionTime}s
                </div>
              )}
            </div>

            <div className="terminal-body">
              {activeTab === 'output' && (
                <div className={outputType === 'error' ? 'output-error' : outputType === 'success' ? 'output-success' : ''}>
                  {output}
                </div>
              )}

              {activeTab === 'input' && (
                <textarea
                  className="input-textarea"
                  placeholder="Provide std::cin inputs here (separated by newlines or spaces)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}

              {activeTab === 'git' && (
                <div style={{ color: '#9ca3af' }}>
                  {gitLog || 'Click "Sync to GitHub" to push your workspace code manually, or wait for the automatic daily push at 11:00 PM.'}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Settings & GitHub Setup</span>
              <button className="btn-icon-only" onClick={() => setShowSettings(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label className="form-label">GitHub Repository Remote URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://github.com/username/your-repo.git"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Paste your GitHub repository link here to auto-push changes.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Daily Auto-Push Schedule Time (24hr)</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={autoPushTime}
                  onChange={(e) => setAutoPushTime(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  The editor will automatically commit and push to GitHub every day at this time.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="modal-overlay" onClick={() => setShowNewFileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create New C++ File</span>
              <button className="btn-icon-only" onClick={() => setShowNewFileModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateFile}>
              <div className="form-group">
                <label className="form-label">File Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. binary_search.cpp"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewFileModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create File</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
