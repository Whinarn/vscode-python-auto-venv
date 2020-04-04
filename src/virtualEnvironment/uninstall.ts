import * as vscode from 'vscode';
import * as path from 'path';
import * as settings from '../settings';
import * as pip from '../tools/pip';
import * as pipenv from '../tools/pipenv';
import { executeCommandBasic } from '../commandUtils';
import { fileStat, removeFile, removeDirectory, readFileContents } from '../ioUtils';
import * as logger from '../logger';
import { prepareCustomCommand, CustomCommandOptions } from './commands';
import { findVenvInstallFile, getVenvInDirectory, findVenvPath, isVenvDirectory, isInsideVenvDirectory } from './find';
import { getWorkspacePythonPath, resetWorkspacePythonPath } from './pythonPath';

export async function uninstallVirtualEnvironment(document: vscode.TextDocument): Promise<boolean> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return false;
    }

    const directoryPath = path.dirname(document.fileName);
    const venvInstallFilePath = await findVenvInstallFile(workspaceFolder, directoryPath);
    if (!venvInstallFilePath) {
        logger.info('Unable to find virtual environment project to uninstall based on path:', directoryPath);
        return false;
    }

    const venvProjectPath = path.dirname(venvInstallFilePath);
    await removePythonPathIfWithinVenv(workspaceFolder, venvProjectPath);

    const uninstallCommand = getUninstallCommand(workspaceFolder, {
        filePath: venvInstallFilePath,
    });

    if (uninstallCommand.length) {
        await executeCommandBasic(uninstallCommand, {
            cwd: venvProjectPath,
        });
        logger.info('The virtual environment was successfully uninstalled:', venvProjectPath);
        return true;
    } else {
        return await uninstallVirtualEnvironmentDefault(workspaceFolder, venvProjectPath, venvInstallFilePath);
    }
}

async function removePythonPathIfWithinVenv(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<void> {
    const workspacePythonPath = getWorkspacePythonPath(workspaceFolder);
    if (!workspacePythonPath) {
        return;
    }

    const venvPath = await findVenvPath(workspaceFolder, venvProjectPath);
    if (!venvPath) {
        return;
    }

    if (await isInsideVenvDirectory(venvPath, workspacePythonPath)) {
        logger.info('Resetting workspace python path due to virtual environment being uninstalled:', venvPath);
        resetWorkspacePythonPath(workspaceFolder);
    }
}

async function uninstallVirtualEnvironmentDefault(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, venvInstallFilePath: string): Promise<boolean> {
    let result: boolean;
    const venvInstallFileName = path.basename(venvInstallFilePath);
    if (settings.getPreferPipenv(workspaceFolder) || pipenv.isPipfileFileName(venvInstallFileName)) {
        result = await pipenv.uninstallVenv(workspaceFolder, venvProjectPath);
    } else if (pip.isRequirementsFileName(venvInstallFileName)) {
        result = await uninstallVirtualEnvironmentDirectory(workspaceFolder, venvProjectPath);
    } else {
        throw new Error(`Unable to install virtual environment using unknown file: ${venvInstallFilePath}`);
    }

    logger.info('The virtual environment was successfully uninstalled:', venvProjectPath);
    return result;
}

async function uninstallVirtualEnvironmentDirectory(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string): Promise<boolean> {
    const venvPath = await getVenvInDirectory(workspaceFolder, venvProjectPath, false);
    if (!venvPath) {
        return false;
    }

    const venvStat = await fileStat(venvPath);
    if (!venvStat) {
        return false;
    }

    if (venvStat.isFile()) {
        // For venv files, we remove both the venv directory and the file
        const actualVenvPath = await readFileContents(venvPath);
        if (await isVenvDirectory(actualVenvPath)) {
            logger.info('Removing venv directory:', actualVenvPath);
            await removeDirectory(actualVenvPath);
        }

        logger.info('Removing venv file:', venvPath);
        return await removeFile(venvPath);
    } else if (venvStat.isDirectory()) {
        logger.info('Removing venv directory:', venvPath);
        return await removeDirectory(venvPath);
    }

    return false;
}

function getUninstallCommand(workspaceFolder: vscode.WorkspaceFolder, commandOptions: CustomCommandOptions): string {
    const fileName = path.basename(commandOptions.filePath);
    const commandPerFile = settings.getUninstallVenvCommandForFile(workspaceFolder);
    let command = commandPerFile[fileName];
    if (typeof command === 'undefined') {
        command = settings.getUninstallVenvCommand(workspaceFolder);
    }

    return prepareCustomCommand(command, commandOptions);
}
