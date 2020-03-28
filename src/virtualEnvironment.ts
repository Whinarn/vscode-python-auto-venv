import * as vscode from 'vscode';
import { dirname, join, sep } from 'path';
import { fileExistsSync } from './fileUtils';

const VENV_DIR_NAMES = ['.venv', 'venv'];
let lastDirectoryPath: string | undefined;
let lastPythonPath: string | undefined;

export function updateVirtualEnvironment(document: vscode.TextDocument): void {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return;
    }

    const directoryPath = dirname(document.fileName);
    if (lastDirectoryPath === directoryPath) {
        return;
    }

    lastDirectoryPath = directoryPath;

    const pythonPath = findVirtualEnvironmentPythonPath(workspaceFolder, directoryPath);
    if (pythonPath && pythonPath !== lastPythonPath) {
        lastPythonPath = pythonPath;
        setVirtualEnvironment(workspaceFolder, pythonPath);
    }
}

function findVirtualEnvironmentPythonPath(workspaceFolder: vscode.WorkspaceFolder, path: string): string | undefined {
    const workspaceRootPath = workspaceFolder.uri.fsPath;
    const workspaceRootPathWithSlash = workspaceRootPath + sep;

    let currentPath = path;
    while (currentPath.startsWith(workspaceRootPathWithSlash) || currentPath === workspaceRootPath) {
        const pythonPath = findVirtualEnvironmentPythonPathInDirectory(currentPath);
        if (pythonPath) {
            return pythonPath;
        }

        currentPath = dirname(currentPath);
    }

    return undefined;
}

function findVirtualEnvironmentPythonPathInDirectory(path: string): string | undefined {
    for (let i = 0; i < VENV_DIR_NAMES.length; i++) {
        let pythonPath = getVirtualEnvironmentPythonPath(path, VENV_DIR_NAMES[i]);
        if (fileExistsSync(pythonPath)) {
            return pythonPath;
        }
    }

    return undefined;
}

function getVirtualEnvironmentPythonPath(path: string, venvName: string): string {
    if (process.platform === 'win32') {
        return join(path, venvName, 'Scripts', 'python.exe');
    } else {
        return join(path, venvName, 'bin', 'python');
    }
}

function setVirtualEnvironment(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', pythonPath);
}
