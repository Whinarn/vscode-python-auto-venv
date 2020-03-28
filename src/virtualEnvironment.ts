import * as vscode from 'vscode';
import { dirname, join, sep } from 'path';
import { exec } from 'child_process';
import { getUsePipenv, getPipenvPath, getVenvDirectoryNames } from './settings';
import { fileExists } from './fileUtils';

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

    findVirtualEnvironmentPythonPath(workspaceFolder, directoryPath).then((pythonPath) => {
        if (pythonPath) {
            if (pythonPath !== lastPythonPath) {
                lastPythonPath = pythonPath;

                try {
                    setVirtualEnvironment(workspaceFolder, pythonPath);
                } catch (err) {
                    console.error('Failed to set virtual environment:', err);
                }
            }
        } else {
            console.warn('Unable to find virtual environment under directory:', directoryPath);
        }
    }).catch((err) => {
        console.error('Failed to find virtual environment:', err);
    });
    
}

async function findVirtualEnvironmentPythonPath(workspaceFolder: vscode.WorkspaceFolder, path: string): Promise<string | undefined> {
    const workspaceRootPath = workspaceFolder.uri.fsPath;
    const workspaceRootPathWithSlash = workspaceRootPath + sep;

    const usePipenv = getUsePipenv(workspaceFolder);
    if (usePipenv) {
        const venvPath = await getVirtualEnvironmentPathUsingPipenv(workspaceFolder, path);
        if (venvPath) {
            const venvPythonPath = getVirtualEnvironmentPythonPath(venvPath);
            if (await fileExists(venvPythonPath)) {
                return venvPythonPath;
            }
        }
    }

    const venvDirNames = getVenvDirectoryNames(workspaceFolder);
    let currentPath = path;
    while (currentPath.startsWith(workspaceRootPathWithSlash) || currentPath === workspaceRootPath) {
        const pythonPath = await findVirtualEnvironmentPythonPathInDirectory(currentPath, venvDirNames);
        if (pythonPath) {
            return pythonPath;
        }

        currentPath = dirname(currentPath);
    }

    return undefined;
}

function getVirtualEnvironmentPathUsingPipenv(workspaceFolder: vscode.WorkspaceFolder, path: string): Promise<string | undefined> {
    const pipenvPath = getPipenvPath(workspaceFolder);
    const command = `${pipenvPath} --venv`;

    return new Promise<string | undefined>((resolve, reject) => {
        exec(command, {cwd: path}, (err, stdout, stderr) => {
            if (err) {
                if (err.code === 1 && stderr.toLowerCase().includes('no virtualenv')) {
                    // The venv could not be found
                    return resolve(undefined);
                }
                return reject(new Error(stderr));
            }

            const venvPath = stdout.trim();
            if (venvPath.length) {
                resolve(venvPath);
            } else {
                resolve(undefined);
            }
        });
    });
}

async function findVirtualEnvironmentPythonPathInDirectory(path: string, venvDirNames: string[]): Promise<string | undefined> {
    for (let i = 0; i < venvDirNames.length; i++) {
        const venvPath = join(path, venvDirNames[i]);
        const pythonPath = getVirtualEnvironmentPythonPath(venvPath);
        if (await fileExists(pythonPath)) {
            return pythonPath;
        }
    }

    return undefined;
}

function getVirtualEnvironmentPythonPath(venvPath: string): string {
    if (process.platform === 'win32') {
        return join(venvPath, 'Scripts', 'python.exe');
    } else {
        return join(venvPath, 'bin', 'python');
    }
}

function setVirtualEnvironment(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', pythonPath);

    console.log('Changed the virtual environment python path:', pythonPath);
}
