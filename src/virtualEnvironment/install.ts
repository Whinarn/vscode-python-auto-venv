import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import { isDependencyToolFilePath, installVenvUsingDependencyTool } from '../tools';
import * as pip from '../tools/pip';
import * as venv from '../tools/venv';
import { executeCommandBasic } from '../commandUtils';
import { setPythonPath } from '../pythonExtension';
import * as logger from '../logger';
import { prepareCustomCommand, CustomCommandOptions } from './commands';
import { findVenvInstallFile, findVenvPythonPath } from './find';
import { uninstallVirtualEnvironment } from './uninstall';

export async function installVirtualEnvironment(document: vscode.TextDocument): Promise<void> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return;
    }

    const directoryPath = path.dirname(document.fileName);
    const venvInstallFilePath = await findVenvInstallFile(workspaceFolder, directoryPath);
    if (!venvInstallFilePath) {
        logger.info('Unable to find virtual environment project to install based on path:', directoryPath);
        return;
    }

    // Uninstall any existing environment first
    await uninstallVirtualEnvironment(document);

    const venvProjectPath = path.dirname(venvInstallFilePath);
    const installCommand = getInstallCommand(workspaceFolder, {
        filePath: venvInstallFilePath,
    });

    if (installCommand.length) {
        await executeCommandBasic(installCommand, {
            cwd: venvProjectPath,
        });
        logger.info('The virtual environment was successfully installed:', venvProjectPath);
    } else {
        await installVirtualEnvironmentDefault(workspaceFolder, venvProjectPath, venvInstallFilePath);
    }

    const pythonPath = await findVenvPythonPath(workspaceFolder, venvProjectPath);
    if (pythonPath) {
        setPythonPath(workspaceFolder, pythonPath);
        logger.info('Changed the virtual environment python path:', pythonPath);
    } else {
        logger.error('Unable to find virtual environment after installation:', venvProjectPath);
    }
}

async function installVirtualEnvironmentDefault(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, venvInstallFilePath: string): Promise<void> {
    const venvInstallFileName = path.basename(venvInstallFilePath);
    if (await isDependencyToolFilePath(venvInstallFilePath)) {
        await installVenvUsingDependencyTool(workspaceFolder, venvProjectPath, venvInstallFilePath);
    } else if (pip.isRequirementsFileName(venvInstallFileName)) {
        await venv.setupVenv(workspaceFolder, venvProjectPath);
        await pip.installRequirementsFile(workspaceFolder, venvProjectPath, venvInstallFilePath);
    } else {
        throw new Error(`Unable to install virtual environment using unknown file: ${venvInstallFilePath}`);
    }

    logger.info('The virtual environment was successfully installed:', venvInstallFilePath);
}

function getInstallCommand(workspaceFolder: vscode.WorkspaceFolder, commandOptions: CustomCommandOptions): string {
    const fileName = path.basename(commandOptions.filePath);
    const commandPerFile = settings.getInstallVenvCommandForFile(workspaceFolder);
    let command = commandPerFile[fileName];
    if (typeof command === 'undefined') {
        command = settings.getInstallVenvCommand(workspaceFolder);
    }

    return prepareCustomCommand(command, commandOptions);
}
