import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import { executeCommandBasic, getCommand } from '../commandUtils';

export const REQUIREMENTS_FILENAME_PREFIX = 'requirements';
export const REQUIREMENTS_EXT = '.txt';

export function isRequirementsFileName(fileName: string): boolean {
    return (fileName.startsWith(REQUIREMENTS_FILENAME_PREFIX) && fileName.endsWith(REQUIREMENTS_EXT));
}

export async function installRequirementsFile(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, requirementsFilePath: string): Promise<void> {
    const pipPath = settings.getPipPath(workspaceFolder);
    const relativeRequirementsFilePath = path.relative(venvProjectPath, requirementsFilePath);
    const command = getCommand(pipPath, 'install', '-r', relativeRequirementsFilePath);
    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}
