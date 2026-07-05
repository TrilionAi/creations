; Inno Setup Script - Universal Editor Desktop
; Requer Inno Setup 6.x

#define MyAppName "Universal Editor Desktop"
#define MyAppVersion "1.1.0"
#define MyAppPublisher "Lucas Morosov"
#define MyAppExeName "Universal Editor Desktop.exe"

[Setup]
AppId={{5953B558-3CC2-4E19-A4C5-8B86FD5311A8}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=installer_output
OutputBaseFilename=Universal_Editor_Desktop_Setup_{#MyAppVersion}
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "startupicon"; Description: "Start with Windows"; GroupDescription: "Other options:"

[Files]
Source: "dist\Universal Editor Desktop\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: startupicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Clean up AppData settings on uninstall
Type: files; Name: "{userappdata}\Editor Universal\settings.json"
Type: files; Name: "{userappdata}\Editor Universal\error.log"
Type: dirifempty; Name: "{userappdata}\Editor Universal"

[Code]
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  // Close app if it is running
  Exec('taskkill', '/f /im "Universal Editor Desktop.exe"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Result := True;
end;

function InitializeUninstall(): Boolean;
var
  ResultCode: Integer;
begin
  // Close app before uninstalling
  Exec('taskkill', '/f /im "Universal Editor Desktop.exe"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Result := True;
end;
