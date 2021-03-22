import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export type ValidateFileCallback = (filePath: string) => boolean | Promise<boolean>;

export async function fileStat(filePath: string): Promise<fs.Stats | undefined> {
    try {
        return await fs.promises.stat(filePath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return undefined;
        }
        throw err;
    }
}

export async function dirExists(filePath: string): Promise<boolean> {
    const stat = await fileStat(filePath);
    if (!stat) {
        return false;
    }

    return stat && stat.isDirectory();
}

export async function fileExists(filePath: string): Promise<boolean> {
    const stat = await fileStat(filePath);
    if (!stat) {
        return false;
    }

    return stat && stat.isFile();
}

export async function readFileContents(filePath: string): Promise<string> {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data.trim();
}

export async function removeFile(filePath: string): Promise<boolean> {
    if (await fileExists(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
    }

    return false;
}

export async function removeDirectory(dirPath: string): Promise<boolean> {
    if (await dirExists(dirPath)) {
        await removeDirectoryWithoutCheck(dirPath);
        return true;
    }

    return false;
}

async function removeDirectoryWithoutCheck(dirPath: string): Promise<void> {
    const files = await fs.promises.readdir(dirPath);
    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        const filePath = path.join(dirPath, fileName);
        const stat = await fileStat(filePath);
        if (stat) {
            if (stat.isFile()) {
                await fs.promises.unlink(filePath);
            } else if (stat.isDirectory()) {
                await removeDirectoryWithoutCheck(filePath);
            }
        }
    }

    await fs.promises.rmdir(dirPath);
}

export async function findFileInParents(
    workspaceFolder: vscode.WorkspaceFolder,
    dirPath: string,
    findFileNames: string[],
    validateFileCallback?: ValidateFileCallback
): Promise<string | undefined> {
    const workspaceResolvedPath = path.resolve(workspaceFolder.uri.fsPath);
    const workspaceRootPath = removeTrailingDirectorySeparator(workspaceResolvedPath);
    const workspaceRootPathWithSlash = addTrailingDirectorySeparator(workspaceRootPath);

    let currentDirPath = path.resolve(dirPath);
    while (currentDirPath.startsWith(workspaceRootPathWithSlash) || currentDirPath === workspaceRootPath) {
        const filePath = await findFileInDirectory(currentDirPath, findFileNames, validateFileCallback);
        if (filePath) {
            return filePath;
        }

        currentDirPath = path.dirname(currentDirPath);
    }

    return undefined;
}

async function findFileInDirectory(
    dirPath: string,
    findFileNames: string[],
    validateFileCallback?: ValidateFileCallback
): Promise<string | undefined> {
    for (let i = 0; i < findFileNames.length; i++) {
        const filePath = path.join(dirPath, findFileNames[i]);
        if (await fileExists(filePath)) {
            if (validateFileCallback) {
                const validateResult = await Promise.resolve(validateFileCallback(filePath));
                if (validateResult) {
                    return filePath;
                }
            } else {
                return filePath;
            }
        }
    }

    return undefined;
}

export function removeTrailingDirectorySeparator(dirPath: string): string {
    if (dirPath.endsWith(path.sep)) {
        return dirPath.substr(0, dirPath.length - 1);
    }

    return dirPath;
}

export function addTrailingDirectorySeparator(dirPath: string): string {
    if (dirPath.endsWith(path.sep)) {
        return dirPath;
    }

    return dirPath + path.sep;
}
