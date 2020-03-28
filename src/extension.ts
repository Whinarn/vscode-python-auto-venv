import * as vscode from 'vscode';
import { updateVirtualEnvironment } from './virtualEnvironment';

const PYTHON_LANGUAGE_ID = 'python';
let activeDocument: vscode.TextDocument | undefined;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor));

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
        updateVirtualEnvironment(document);
    }
}

export function deactivate() {

}
