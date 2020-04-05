import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import * as logger from '../logger';
import { findVenvPythonPath } from './find';
import { installVirtualEnvironment } from './install';
import { setWorkspacePythonPath } from './pythonPath';

let lastDirectoryPath: string | undefined;
let lastPythonPath: string | undefined;

export async function setVirtualEnvironment(document: vscode.TextDocument, forced: boolean): Promise<void> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return;
    }

    const directoryPath = path.dirname(document.fileName);
    if (!forced && lastDirectoryPath === directoryPath) {
        return;
    }

    lastDirectoryPath = directoryPath;

    const pythonPath = await findVenvPythonPath(workspaceFolder, directoryPath);
    if (pythonPath) {
        if (pythonPath !== lastPythonPath) {
            lastPythonPath = pythonPath;

            setWorkspacePythonPath(workspaceFolder, pythonPath);

            logger.info('Changed the virtual environment python path:', pythonPath);
        }
    } else {
        if (settings.getAutoInstallVenv(workspaceFolder)) {
            await installVirtualEnvironment(document);
        } else {
            logger.warn('Unable to find virtual environment under directory:', directoryPath);
        }
    }
}
