import * as vscode from 'vscode';
import * as path from 'path';
import { findIndex } from 'lodash';
import * as settings from '../settings';
import * as logger from '../logger';
import { executeCommand, executeCommandBasic, getCommand } from '../commandUtils';
import { readFileContents } from '../ioUtils';

export const POETRY_PROJECT_FILENAME = 'pyproject.toml';
export const POETRY_LOCK_FILENAME = 'poetry.lock';
export const POETRY_FILENAMES = [POETRY_PROJECT_FILENAME, POETRY_LOCK_FILENAME];

export function isPoetryFileName(fileName: string): boolean {
    return (fileName === POETRY_PROJECT_FILENAME || fileName === POETRY_LOCK_FILENAME);
}

export async function isPoetryFilePath(filePath: string): Promise<boolean> {
    const fileName = path.basename(filePath);

    if (fileName === POETRY_PROJECT_FILENAME) {
        const fileContents = await readFileContents(filePath);
        const fileLines = fileContents.split('\n');
        const poetryToolLineIndex = findIndex(fileLines, line => line.trim() === '[tool.poetry]');
        return (poetryToolLineIndex !== -1);
    }

    return (fileName === POETRY_LOCK_FILENAME);
}

export async function getVenvPath(workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const poetryPath = settings.getPoetryPath(workspaceFolder);
    const command = getCommand(poetryPath, 'env', 'info', '--path');

    try {
        const venvPath = await executeCommand(command, {
            cwd: dirPath,
        });
        return venvPath.length > 0 ? venvPath : undefined;
    } catch (err) {
        if (err.code === 1) {
            logger.error('Failed to get poetry environment path:', err.stderr || err.message);
            return undefined;
        }
        throw new Error(err.stderr || err.message);
    }
}

export async function installVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<void> {
    const poetryPath = settings.getPoetryPath(workspaceFolder);
    const command = getCommand(poetryPath, 'install', '--no-root');
    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}

export async function uninstallVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<boolean> {
    const poetryPath = settings.getPoetryPath(workspaceFolder);

    const environments = await getEnvironments(workspaceFolder, venvProjectPath);
    if (environments.length === 0) {
        return false;
    }

    for (const environment in environments) {
        const command = getCommand(poetryPath, 'env', 'remove', environment);
        try {
            await executeCommand(command, {
                cwd: venvProjectPath,
            });
        } catch (err) {
            if (err.code === 1) {
                logger.error('Failed to uninstall poetry environment:', err.stderr || err.message);
                return false;
            }
            throw new Error(err.stderr || err.message);
        }
    }

    return true;
}

async function getEnvironments(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<string[]> {
    const poetryPath = settings.getPoetryPath(workspaceFolder);
    const command = getCommand(poetryPath, 'env', 'list');

    try {
        const result = await executeCommand(command, {
            cwd: venvProjectPath,
        });
        return result.split('\n').map((line) => line.trim());
    } catch (err) {
        if (err.code === 1) {
            logger.error('Failed to get poetry environments:', err.stderr || err.message);
            return [];
        }
        throw new Error(err.stderr || err.message);
    }
}
