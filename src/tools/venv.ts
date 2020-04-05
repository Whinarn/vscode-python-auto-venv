import * as vscode from 'vscode';
import * as settings from '../settings';
import { executeCommandBasic, getCommand } from '../commandUtils';

export async function setupVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<void> {
    const pythonPath = settings.getPythonPath(workspaceFolder);
    const command = getCommand(pythonPath, '-m', 'venv', '.venv');
    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}
