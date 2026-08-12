Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get project directory
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)

' 1. Start Node.js backend server silently in background
WshShell.Run "cmd /c cd /d """ & scriptPath & "\backend"" && node server.js", 0, False

' 2. Wait 1.5 seconds for server to listen on port 5000
WScript.Sleep 1500

' 3. Open Standalone App Mode using Edge or Chrome
edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

If fso.FileExists(chromePath) Then
    WshShell.Run """" & chromePath & """ --app=http://localhost:5000", 1, False
ElseIf fso.FileExists(edgePath) Then
    WshShell.Run """" & edgePath & """ --app=http://localhost:5000", 1, False
Else
    WshShell.Run "http://localhost:5000", 1, False
End If
