import * as vscode from 'vscode';

export function getWorkspacePythonPath(workspaceFolder: vscode.WorkspaceFolder): string | undefined {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    return pythonSettings.get('pythonPath');
}

export function setWorkspacePythonPath(workspaceFolder: vscode.WorkspaceFolder, pythonPath: string): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', pythonPath);
}

export function resetWorkspacePythonPath(workspaceFolder: vscode.WorkspaceFolder): void {
    const pythonSettings = vscode.workspace.getConfiguration('python', workspaceFolder);
    pythonSettings.update('pythonPath', undefined);
}
