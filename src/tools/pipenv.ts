import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import { executeCommand, escapePath } from '../commandUtils';
import { fileExists } from '../ioUtils';

const PIPFILE_LOCK_FILENAME = 'Pipfile.lock';

export async function getVenvPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const command = getCommand(workspaceFolder, '--venv');

    try {
        const venvPath = await executeCommand(command, {
            cwd: dirPath,
        });
        if (venvPath.length) {
            return venvPath;
        }

        return undefined;
    } catch (err) {
        if (err.code === 1 && typeof err.stderr === 'string' && err.stderr.toLowerCase().includes('no virtualenv')) {
            // The venv could not be found
            return undefined;
        }
        throw new Error(err.stderr || err.message);
    }
}

export async function installVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<void> {
    const pipfileLockPath = path.join(venvProjectPath, PIPFILE_LOCK_FILENAME);
    const hasLockFile = await fileExists(pipfileLockPath);

    let command: string;
    if (hasLockFile) {
        command = getCommand(workspaceFolder, '--bare', 'sync', '--dev');
    } else {
        command = getCommand(workspaceFolder, '--bare', 'install', '--dev');
    }

    try {
        await executeCommand(command, {
            cwd: venvProjectPath,
        });
    } catch (err) {
        throw new Error(err.stderr || err.message);
    }
}

export async function uninstallVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<boolean> {
    const command = getCommand(workspaceFolder, '--rm');

    try {
        await executeCommand(command, {
            cwd: venvProjectPath,
        });
        return true;
    } catch (err) {
        if (err.code === 1 && typeof err.stderr === 'string' && err.stderr.toLowerCase().includes('no virtualenv')) {
            // The venv could not be found
            return false;
        }
        throw new Error(err.stderr || err.message);
    }
}

function getCommand(workspaceFolder: vscode.WorkspaceFolder, ...args: string[]): string {
    let pipenvPath = settings.getPipenvPath(workspaceFolder);
    pipenvPath = escapePath(pipenvPath);
    return [
        pipenvPath,
        ...args
    ].join(' ');
}