import * as vscode from 'vscode';
import * as logger from './logger';

const PYTHON_EXTENSION_NAME = 'ms-python.python';

interface IPythonExtensionApi {
    // TODO: Fill in necessary API to get and change python path
}

export function activatePythonExtension(): void {
    const pythonExtension = getPythonExtension();
    if (pythonExtension) {
        pythonExtension.activate();
    } else {
        const errorMessage = 'The official Python extension (ms-python.python) could not be found. Please install it for this extension to function!';
        logger.error(errorMessage);
        vscode.window.showErrorMessage(errorMessage);
    }
}

export function getPythonPath(workspaceFolder: vscode.WorkspaceFolder): string | undefined {
    const pythonExtension = getPythonExtension();
    if (pythonExtension && isUsingInterpreterPathService(pythonExtension)) {
        // TODO: Get the python path using the new interpreter path service
    }

    return getPythonPathFromSettings(workspaceFolder);
}

export function setPythonPath(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string | undefined): void {
    const pythonExtension = getPythonExtension();
    if (pythonExtension && isUsingInterpreterPathService(pythonExtension)) {
        // TODO: Set the python path using the new interpreter path service
    }

    return setPythonPathInSettings(workspaceFolder, pythonPath);
}

function getPythonExtension(): vscode.Extension<IPythonExtensionApi> | undefined {
    return vscode.extensions.getExtension<IPythonExtensionApi>(PYTHON_EXTENSION_NAME);
}

function isUsingInterpreterPathService(pythonExtension: vscode.Extension<IPythonExtensionApi>): boolean {
    // TODO: Figure out if the python extension is using the new interpreter path service
    return false;
}

function getPythonPathFromSettings(workspaceFolder: vscode.WorkspaceFolder): string | undefined {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    return pythonSettings.get('pythonPath');
}

function setPythonPathInSettings(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string | undefined): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', pythonPath);
}
