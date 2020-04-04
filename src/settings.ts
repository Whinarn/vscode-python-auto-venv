import * as vscode from 'vscode';

const SETTINGS_SECTION = 'pythonautovenv';
const DEFAULT_ENABLE = true;
const DEFAULT_PIPENV_PATH = 'pipenv';
const DEFAULT_PREFER_PIPENV = false;
const DEFAULT_VENV_DIR_NAMES = ['.venv', 'venv'];
const DEFAULT_INSTALL_VENV_FILES = ['Pipfile.lock', 'Pipfile', 'requirements-dev.txt', 'requirements.txt'];

export function getEnable(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('enable', DEFAULT_ENABLE);
}

export function getPipenvPath(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('pipenvPath', DEFAULT_PIPENV_PATH);
}

export function getPreferPipenv(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('preferPipenv', DEFAULT_PREFER_PIPENV);
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
