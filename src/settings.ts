import * as vscode from 'vscode';

const SETTINGS_SECTION = 'pythonautovenv';
const DEFAULT_ENABLE = true;
const DEFAULT_PYTHON_PATH = 'python';
const DEFAULT_PIP_PATH = 'pip';
const DEFAULT_PIPENV_PATH = 'pipenv';
const DEFAULT_POETRY_PATH = 'poetry';
const DEFAULT_PREFER_PIPENV = false;
const DEFAULT_PREFER_POETRY = false;
const DEFAULT_VENV_DIR_NAMES = ['.venv', 'venv'];
const DEFAULT_AUTO_INSTALL_VENV = false;
const DEFAULT_INSTALL_VENV_FILES = ['poetry.lock', 'pyproject.toml', 'Pipfile.lock', 'Pipfile', 'requirements-dev.txt', 'requirements.txt'];
const DEFAULT_INSTALL_VENV_COMMAND = '';
const DEFAULT_INSTALL_VENV_COMMAND_FOR_FILE = {};
const DEFAULT_UNINSTALL_VENV_COMMAND = '';
const DEFAULT_UNINSTALL_VENV_COMMAND_FOR_FILE = {};

export type StringMap = { [key: string]: string; };

export function getEnable(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('enable', DEFAULT_ENABLE);
}

export function getPythonPath(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('pythonPath', DEFAULT_PYTHON_PATH);
}

export function getPipPath(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('pipPath', DEFAULT_PIP_PATH);
}

export function getPipenvPath(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('pipenvPath', DEFAULT_PIPENV_PATH);
}

export function getPoetryPath(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('poetryPath', DEFAULT_POETRY_PATH);
}

export function getPreferPipenv(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('preferPipenv', DEFAULT_PREFER_PIPENV);
}

export function getPreferPoetry(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('preferPoetry', DEFAULT_PREFER_POETRY);
}

export function getVenvDirectoryNames(workspaceFolder?: vscode.WorkspaceFolder): string[] {
    const settings = getSettings(workspaceFolder);
    return settings.get<string[]>('venvDirectoryNames', DEFAULT_VENV_DIR_NAMES);
}

export function getAutoInstallVenv(workspaceFolder?: vscode.WorkspaceFolder): boolean {
    const settings = getSettings(workspaceFolder);
    return settings.get<boolean>('autoInstallVenv', DEFAULT_AUTO_INSTALL_VENV);
}

export function getInstallVenvFiles(workspaceFolder?: vscode.WorkspaceFolder): string[] {
    const settings = getSettings(workspaceFolder);
    return settings.get<string[]>('installVenvFiles', DEFAULT_INSTALL_VENV_FILES);
}

export function getInstallVenvCommand(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('installVenvCommand', DEFAULT_INSTALL_VENV_COMMAND);
}

export function getInstallVenvCommandForFile(workspaceFolder?: vscode.WorkspaceFolder): StringMap {
    const settings = getSettings(workspaceFolder);
    return settings.get<StringMap>('installVenvCommandForFile', DEFAULT_INSTALL_VENV_COMMAND_FOR_FILE);
}

export function getUninstallVenvCommand(workspaceFolder?: vscode.WorkspaceFolder): string {
    const settings = getSettings(workspaceFolder);
    return settings.get<string>('uninstallVenvCommand', DEFAULT_UNINSTALL_VENV_COMMAND);
}

export function getUninstallVenvCommandForFile(workspaceFolder?: vscode.WorkspaceFolder): StringMap {
    const settings = getSettings(workspaceFolder);
    return settings.get<StringMap>('uninstallVenvCommandForFile', DEFAULT_UNINSTALL_VENV_COMMAND_FOR_FILE);
}

export function getSettings(workspaceFolder?: vscode.WorkspaceFolder): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(SETTINGS_SECTION, workspaceFolder);
}
