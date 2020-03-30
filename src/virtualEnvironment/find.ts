import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import { fileStat, fileExists, findFileInParents, readFileContents } from '../ioUtils';
import * as pipenv from '../tools/pipenv';

export async function findVenvInstallFile(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const installVenvFiles = ['Pipfile', 'requirements-dev.txt', 'requirements.txt'];
    return await findFileInParents(workspaceFolder, dirPath, installVenvFiles);
}

export async function findVenvProjectPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const venvInstallFilePath = await findVenvInstallFile(workspaceFolder, dirPath);
    if (!venvInstallFilePath) {
        return undefined;
    }

    return path.dirname(venvInstallFilePath);
}

export async function getVenvInDirectory(workspaceFolder: vscode.WorkspaceFolder, dirPath: string, allowRedirect: boolean): Promise<string | undefined> {
    const venvDirNames = settings.getVenvDirectoryNames(workspaceFolder);
    return await findVenvInDirectory(dirPath, venvDirNames, allowRedirect);
}

export async function isVenvDirectory(dirPath: string): Promise<boolean> {
    const pythonPath = getPythonPathInVenv(dirPath);
    if (await fileExists(pythonPath)) {
        return true;
    }

    return false;
}

export async function findVenvPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const usePipenv = settings.getUsePipenv(workspaceFolder);
    if (usePipenv) {
        const venvPath = await pipenv.getVenvPath(workspaceFolder, dirPath);
        if (venvPath) {
            return venvPath;
        }
    }

    const venvInstallFilePath = await findVenvInstallFile(workspaceFolder, dirPath);
    if (!venvInstallFilePath) {
        return undefined;
    }

    const venvInstallDirPath = path.dirname(venvInstallFilePath);
    const venvPath = await getVenvInDirectory(workspaceFolder, venvInstallDirPath, true);
    return venvPath;
}

export async function findVenvPythonPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const venvPath = await findVenvPath(workspaceFolder, dirPath);
    if (!venvPath) {
        return undefined;
    }

    const venvPythonPath = getPythonPathInVenv(venvPath);
    if (await fileExists(venvPythonPath)) {
        return venvPythonPath;
    }

    return undefined;
}

async function findVenvInDirectory(dirPath: string, venvDirNames: string[], allowRedirect: boolean): Promise<string | undefined> {
    for (let i = 0; i < venvDirNames.length; i++) {
        const venvPath = path.join(dirPath, venvDirNames[i]);
        const venvStat = await fileStat(venvPath);

        if (venvStat) {
            if (venvStat.isFile()) {
                // If it's a file, we read the actual venv path from it
                const actualVenvPath = await readFileContents(venvPath);

                if (await isVenvDirectory(actualVenvPath)) {
                    if (!allowRedirect) {
                        return venvPath;
                    }

                    return actualVenvPath;
                }
            } else if (venvStat.isDirectory()) {
                if (await isVenvDirectory(venvPath)) {
                    return venvPath;
                }
            }
        }
    }

    return undefined;
}

function getPythonPathInVenv(venvPath: string): string {
    if (process.platform === 'win32') {
        return path.join(venvPath, 'Scripts', 'python.exe');
    } else {
        return path.join(venvPath, 'bin', 'python');
    }
}
