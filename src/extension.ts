import * as vscode from 'vscode';
import { getEnable } from './settings';
import { updateVirtualEnvironment } from './virtualEnvironment';
import * as logger from './logger';

const PYTHON_LANGUAGE_ID = 'python';
let activeDocument: vscode.TextDocument | undefined;

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = logger.setup();
    logger.info('Python Auto Venv activated!');

    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor));
    context.subscriptions.push(outputChannel);

    onDidChangeActiveTextEditor(vscode.window.activeTextEditor);
}

function onDidOpenTextDocument(document: vscode.TextDocument): void {
    if (document === activeDocument) {
        onDidChangeActiveTextDocument(document);
    }
}

function onDidChangeActiveTextEditor(editor: vscode.TextEditor | undefined): void {
    activeDocument = editor?.document;

    if (activeDocument) {
        onDidChangeActiveTextDocument(activeDocument);
    }
}

function onDidChangeActiveTextDocument(document: vscode.TextDocument): void {
    if (!document.isUntitled && document.fileName.length && document.languageId === PYTHON_LANGUAGE_ID) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder || !getEnable(workspaceFolder)) {
            // Skip if the document is not in a workspace, or if this extension is disabled in the workspace
            return;
        }

        updateVirtualEnvironment(document);
    }
}

export function deactivate() {
    logger.info('Python Auto Venv deactivated!');
}
