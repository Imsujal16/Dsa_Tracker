Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Path to Desktop
desktopPath = WshShell.SpecialFolders("Desktop")
projectPath = fso.GetParentFolderName(WScript.ScriptFullName)

' Create Shortcut on Desktop
Set shortcut = WshShell.CreateShortcut(desktopPath & "\SJ Code.lnk")
shortcut.TargetPath = "wscript.exe"
shortcut.Arguments = """" & projectPath & "\launch_app.vbs"""
shortcut.WorkingDirectory = projectPath
shortcut.Description = "SJ Code - C++ IDE & Daily GitHub Auto-Push"
shortcut.IconLocation = "shell32.dll, 14" ' Standard Windows App / Terminal Icon
shortcut.Save

' Create Shortcut inside project folder as well
Set localShortcut = WshShell.CreateShortcut(projectPath & "\SJ Code.lnk")
localShortcut.TargetPath = "wscript.exe"
localShortcut.Arguments = """" & projectPath & "\launch_app.vbs"""
localShortcut.WorkingDirectory = projectPath
localShortcut.Description = "SJ Code - C++ IDE & Daily GitHub Auto-Push"
localShortcut.IconLocation = "shell32.dll, 14"
localShortcut.Save

WScript.Echo "SJ Code Desktop shortcut created successfully!"
