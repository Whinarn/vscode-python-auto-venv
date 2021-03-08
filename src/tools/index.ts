import * as vscode from 'vscode';
import * as path from 'path';
import { findIndex } from 'lodash';
import { isRequirementsFileName } from './pip';
import * as pipenv from './pipenv';
import * as poetry from './poetry';

export type DependencyToolId = 'none' | 'pipenv' | 'poetry';

interface IDependencyTool {
    id: DependencyToolId;
    installVenvFileNames: string[];
    getVenvPath: (workspaceFolder: vscode.WorkspaceFolder, dirPath: string) => Promise<string | undefined>;
    installVenv: (workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string) => Promise<void>;
    uninstallVenv: (workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string) => Promise<boolean>;
    validateFile: (filePath: string) => boolean | Promise<boolean>;
}

const dependencyTools: IDependencyTool[] = [
    {
        id: 'poetry',
        installVenvFileNames: poetry.POETRY_FILENAMES,
        getVenvPath: poetry.getVenvPath,
        installVenv: poetry.installVenv,
        uninstallVenv: poetry.uninstallVenv,
        validateFile: poetry.isPoetryFilePath,
    },
    {
        id: 'pipenv',
        installVenvFileNames: pipenv.PIPFILE_FILENAMES,
        getVenvPath: pipenv.getVenvPath,
        installVenv: pipenv.installVenv,
        uninstallVenv: pipenv.uninstallVenv,
        validateFile: validateAlwaysTrue,
    }
];

export async function isValidInstallVenvFile(filePath: string): Promise<boolean> {
    const tool = await getDependencyToolByFilePath(filePath);

    if (tool) {
        return await Promise.resolve(tool.validateFile(filePath));
    }

    const fileName = path.basename(filePath);
    return isRequirementsFileName(fileName);
}

export async function isDependencyToolFilePath(filePath: string): Promise<boolean> {
    const tool = await getDependencyToolByFilePath(filePath);
    return !!tool;
}

export async function installVenvUsingDependencyTool(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, venvInstallFilePath: string): Promise<boolean> {
    const tool = await getDependencyToolByFilePath(venvInstallFilePath);
    if (!tool) {
        return false;
    }

    await tool.installVenv(workspaceFolder, venvProjectPath);
    return true;
}

export async function uninstallVenvUsingDependencyTool(workspaceFolder: vscode.WorkspaceFolder, venvProjectPath: string, venvInstallFilePath: string): Promise<boolean> {
    const tool = await getDependencyToolByFilePath(venvInstallFilePath);
    if (!tool) {
        return false;
    }

    return await tool.uninstallVenv(workspaceFolder, venvProjectPath);
}

export async function getDependencyToolVenvPathByFilePath(filePath: string, workspaceFolder: vscode.WorkspaceFolder, dirPath: string): Promise<string | undefined> {
    const tool = await getDependencyToolByFilePath(filePath);
    if (tool) {
        return await tool.getVenvPath(workspaceFolder, dirPath);
    }

    return undefined;
}

async function getDependencyToolByFilePath(filePath: string): Promise<IDependencyTool | undefined> {
    const fileName = path.basename(filePath);
    for (const tool of dependencyTools) {
        if (findIndex(tool.installVenvFileNames, (installVenvFileName) => installVenvFileName === fileName) !== -1) {
            if (await Promise.resolve(tool.validateFile(filePath))) {
                return tool;
            }
        }
    }

    return undefined;
}

function validateAlwaysTrue(_filePath: string): boolean {
    return true;
}
