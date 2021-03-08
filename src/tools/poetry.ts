import * as vscode from 'vscode';
import * as settings from '../settings';
import { executeCommand, executeCommandBasic, getCommand } from '../commandUtils';

export const POETRY_FILENAME = 'pyproject.toml';
export const POETRY_LOCK_FILENAME = 'poetry.lock';

export function isPoetryFileName(fileName: string): boolean {
    return (fileName === POETRY_FILENAME || fileName === POETRY_LOCK_FILENAME);
}

export async function getVenvPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const poetryPath = settings.getPoetryPath(workspaceFolder);
    const command = getCommand(poetryPath, 'env', 'info', '-p');

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
    const poetryPath = settings.getPoetryPath(workspaceFolder);
    const command = getCommand(poetryPath, 'install');

    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}
