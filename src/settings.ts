import * as vscode from 'vscode';

const SETTINGS_SECTION = 'pythonautovenv';
const DEFAULT_ENABLE = true;
const DEFAULT_USE_PIPENV = false;
const DEFAULT_PIPENV_PATH = 'pipenv';
const DEFAULT_VENV_DIR_NAMES = ['.venv', 'venv'];
const DEFAULT_INSTALL_VENV_FILES = ['Pipfile.lock', 'Pipfile', 'requirements-dev.txt', 'requirements.txt'];

export function getEnable(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('enable', DEFAULT_ENABLE);
}

export function getUsePipenv(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('usePipenv', DEFAULT_USE_PIPENV);
}

export function getPipenvPath(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('pipenvPath', DEFAULT_PIPENV_PATH);
}

export function getVenvDirectoryNames(workspaceFolder?: vscode.WorkspaceFolder): string[] {
    const settings = getSettings(workspaceFolder);
    return settings.get<string[]>('venvDirectoryNames', DEFAULT_VENV_DIR_NAMES);
}

export function getInstallVenvFiles(workspaceFolder?: vscode.WorkspaceFolder): string[] {
    const settings = getSettings(workspaceFolder);
    return settings.get<string[]>('installVenvFiles', DEFAULT_INSTALL_VENV_FILES);
}

export function getSettings(workspaceFolder?: vscode.WorkspaceFolder): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(SETTINGS_SECTION, workspaceFolder);
}
