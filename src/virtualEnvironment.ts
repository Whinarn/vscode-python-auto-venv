import * as vscode from 'vscode';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const VENV_DIR_NAMES = ['.venv', 'venv'];
let lastDirectoryPath: string | undefined;
let lastPythonPath: string | undefined;

export function updateVirtualEnvironment(document: vscode.TextDocument): void {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return;
    }

    console.log('We must update the virtual environment!');
    console.log('Filename:', document.fileName);

    // First check if we have to 
    const directoryPath = dirname(document.fileName);
    if (lastDirectoryPath === directoryPath) {
        return;
    }

    lastDirectoryPath = directoryPath;

    const pythonPath = findVirtualEnvironment(workspaceFolder, directoryPath);
    if (pythonPath && pythonPath !== lastPythonPath) {
        lastPythonPath = pythonPath;
        setVirtualEnvironment(workspaceFolder, pythonPath);
    }
}

function findVirtualEnvironment(workspaceFolder: vscode.WorkspaceFolder, path: string): string | undefined {
    const workspaceRootPath = workspaceFolder.uri.fsPath;
    const workspaceRootPathWithSlash = workspaceRootPath + '/';

    while (path.startsWith(workspaceRootPathWithSlash) || path === workspaceRootPath) {
        for (let i = 0; i < VENV_DIR_NAMES.length; i++) {
            let venvPythonPath = join(path, VENV_DIR_NAMES[i], 'bin', 'python');
            if (existsSync(venvPythonPath)) {
                return venvPythonPath;
            }
        }
    }

    return undefined;
}

function setVirtualEnvironment(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', pythonPath);
}