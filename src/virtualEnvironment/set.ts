import * as vscode from 'vscode';
import * as path from 'path';
import * as logger from '../logger';
import { findVenvPythonPath } from './find';

let lastDirectoryPath: string | undefined;
let lastPythonPath: string | undefined;

export async function setVirtualEnvironment(document: vscode.TextDocument): Promise<void> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return;
    }

    const directoryPath = path.dirname(document.fileName);
    if (lastDirectoryPath === directoryPath) {
        return;
    }

    lastDirectoryPath = directoryPath;

    const pythonPath = await findVenvPythonPath(workspaceFolder, directoryPath);
    if (pythonPath) {
        if (pythonPath !== lastPythonPath) {
            lastPythonPath = pythonPath;

            try {
                setVirtualEnvironmentPythonPath(workspaceFolder, pythonPath);
            } catch (err) {
                logger.error('Failed to set virtual environment:', err);
            }
        }
    } else {
        logger.warn('Unable to find virtual environment under directory:', directoryPath);
    }
}

function setVirtualEnvironmentPythonPath(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', pythonPath);

    logger.info('Changed the virtual environment python path:', pythonPath);
}
