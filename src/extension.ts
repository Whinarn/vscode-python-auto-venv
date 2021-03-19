import * as vscode from 'vscode';
import { getEnable } from './settings';
import { installVirtualEnvironment } from './virtualEnvironment/install';
import { uninstallVirtualEnvironment } from './virtualEnvironment/uninstall';
import { setVirtualEnvironment } from './virtualEnvironment/set';
import { activatePythonExtension } from './pythonExtension';
import * as logger from './logger';

const PYTHON_LANGUAGE_ID = 'python';
let activeDocument: vscode.TextDocument | undefined;

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = logger.setup();
    logger.info('Python Auto Venv activated!');

    context.subscriptions.push(vscode.commands.registerCommand('pythonautovenv.installVenv', onInstallVirtualEnvironmentCommand));
    context.subscriptions.push(vscode.commands.registerCommand('pythonautovenv.uninstallVenv', onUninstallVirtualEnvironmentCommand));

    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor));
    context.subscriptions.push(outputChannel);

    activatePythonExtension();
    onDidChangeActiveTextEditor(vscode.window.activeTextEditor);
}

function onInstallVirtualEnvironmentCommand(): void {
    if (activeDocument && isSavedPythonDocument(activeDocument)) {
        installVirtualEnvironment(activeDocument).catch((err) => {
            logger.error('Failed to install virtual environment:', err);
            vscode.window.showErrorMessage('Failed to install virtual environment:', err);
        });
    } else {
        vscode.window.showErrorMessage('Unable to install virtual environment because no saved python editor is currently active.');
    }
}

function onUninstallVirtualEnvironmentCommand(): void {
    if (activeDocument && isSavedPythonDocument(activeDocument)) {
        uninstallVirtualEnvironment(activeDocument).then((success) => {
            if (!success) {
                vscode.window.showErrorMessage('The virtual environment was not uninstalled because it wasn\'t found.');
            }
        }).catch((err) => {
            logger.error('Failed to uninstall virtual environment:', err);
            vscode.window.showErrorMessage('Failed to uninstall virtual environment:', err);
        });
    } else {
        vscode.window.showErrorMessage('Unable to uninstall virtual environment because no saved python editor is currently active.');
    }
}

function onDidOpenTextDocument(document: vscode.TextDocument): void {
    if (document === activeDocument) {
        onDidChangeActiveTextDocument(document, false);
    }
}

function onDidChangeActiveTextEditor(editor: vscode.TextEditor | undefined): void {
    activeDocument = editor?.document;

    if (activeDocument) {
        onDidChangeActiveTextDocument(activeDocument, false);
    }
}

function onDidChangeActiveTextDocument(document: vscode.TextDocument, forced: boolean): void {
    if (isSavedPythonDocument(document)) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder || !getEnable(workspaceFolder)) {
            // Skip if the document is not in a workspace, or if this extension is disabled in the workspace
            return;
        }

        setVirtualEnvironment(document, forced).catch((err) => {
            logger.error('Failed to set virtual environment:', err);
            vscode.window.showErrorMessage('Failed to set virtual environment:', err);
        });
    }
}

function isSavedPythonDocument(document: vscode.TextDocument): boolean {
    return (!document.isUntitled && document.fileName.length > 0 && document.languageId === PYTHON_LANGUAGE_ID);
}

export function deactivate() {
    logger.info('Python Auto Venv deactivated!');
}
