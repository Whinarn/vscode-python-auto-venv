import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import * as logger from '../logger';
import { executeCommand, executeCommandBasic, getCommand } from '../commandUtils';
import { fileExists } from '../ioUtils';

export const PIPFILE_FILENAME = 'Pipfile';
export const PIPFILE_LOCK_FILENAME = 'Pipfile.lock';
export const PIPFILE_FILENAMES = [PIPFILE_FILENAME, PIPFILE_LOCK_FILENAME];

export function isPipfileFileName(fileName: string): boolean {
    return (fileName === PIPFILE_FILENAME || fileName === PIPFILE_LOCK_FILENAME);
}

export async function getVenvPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const pipenvPath = settings.getPipenvPath(workspaceFolder);
    const command = getCommand(pipenvPath, '--venv');

    try {
        const venvPath = await executeCommand(command, {
            cwd: dirPath,
        });
        return venvPath.length > 0 ? venvPath : undefined;
    } catch (err) {
        if (err.code === 1) {
            logger.error('Failed to get pipenv environment path:', err.stderr || err.message);
            return undefined;
        }
        throw new Error(err.stderr || err.message);
    }
}

export async function installVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<void> {
    const pipenvPath = settings.getPipenvPath(workspaceFolder);
    const pipfileLockPath = path.join(venvProjectPath, PIPFILE_LOCK_FILENAME);
    const hasLockFile = await fileExists(pipfileLockPath);

    let command: string;
    if (hasLockFile) {
        command = getCommand(pipenvPath, '--bare', 'sync', '--dev');
    } else {
        command = getCommand(pipenvPath, '--bare', 'install', '--dev');
    }

    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}

export async function installRequirementsFile(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, requirementsFilePath: string): Promise<void> {
    const pipenvPath = settings.getPipenvPath(workspaceFolder);
    const relativeRequirementsFilePath = path.relative(venvProjectPath, requirementsFilePath);
    const command = getCommand(pipenvPath, 'install', '-r', relativeRequirementsFilePath);
    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}

export async function uninstallVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<boolean> {
    const pipenvPath = settings.getPipenvPath(workspaceFolder);
    const command = getCommand(pipenvPath, '--rm');

    try {
        await executeCommand(command, {
            cwd: venvProjectPath,
        });
        return true;
    } catch (err) {
        if (err.code === 1) {
            logger.error('Failed to get pipenv environment path:', err.stderr || err.message);
            return false;
        }
        throw new Error(err.stderr || err.message);
    }
}
