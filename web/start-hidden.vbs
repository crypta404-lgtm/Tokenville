' Tokenville: liga o servidor da pagina sem abrir nenhuma janela.
' Se ele ja estiver rodando, o novo sai sozinho (porta em uso).
Dim fso, sh, dir
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = dir
sh.Run "node """ & dir & "\server.mjs"" 4747", 0, False
