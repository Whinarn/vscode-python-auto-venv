import * as vscode from 'vscode';
import * as path from 'path';
import { executeCommandBasic, getCommand } from '../commandUtils';
import { findVenvExePath } from '../virtualEnvironment/find';

export const REQUIREMENTS_FILENAME_PREFIX = 'requirements';
export const REQUIREMENTS_EXT = '.txt';

export function isRequirementsFileName(fileName: string): boolean {
    return (fileName.startsWith(REQUIREMENTS_FILENAME_PREFIX) && fileName.endsWith(REQUIREMENTS_EXT));
}

export async function installRequirementsFile(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, requirementsFilePath: string): Promise<void> {
    const pipPath = await findVenvExePath(workspaceFolder, venvProjectPath, 'pip');
    if (!pipPath) {
        throw new Error(`Unable to find pip executable in venv project: ${venvProjectPath}`);
    }

    const relativeRequirementsFilePath = path.relative(venvProjectPath, requirementsFilePath);
    const command = getCommand(pipPath, 'install', '-r', relativeRequirementsFilePath);
    await executeCommandBasic(command, {
        cwd: venvProjectPath,
    });
}
