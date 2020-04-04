import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function fileStat(filePath: string): Promise<fs.Stats | undefined> {
    return new Promise<fs.Stats>((resolve, reject) => {
        fs.stat(filePath, (err, stat) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return resolve(undefined);
                }
                return reject(err);
            }

            resolve(stat);
        });
    });
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

export function readFileContents(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data.trim());
        });
    });
}

export async function removeFile(filePath: string): Promise<boolean> {
    if (await fileExists(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
    }

    return false;
}

export async function removeDirectory(filePath: string): Promise<boolean> {
    if (!await dirExists(filePath)) {
        await fs.promises.rmdir(filePath, {
            recursive: true,
        });
        return true;
    }

    return false;
}

export async function findFileInParents(workspaceFolder: vscode.WorkspaceFolder, dirPath: string, findFileNames: string[]): Promise<string | undefined> {
    const workspaceResolvedPath = path.resolve(workspaceFolder.uri.fsPath);
    const workspaceRootPath = removeTrailingDirectorySeparator(workspaceResolvedPath);
    const workspaceRootPathWithSlash = addTrailingDirectorySeparator(workspaceRootPath);

    let currentDirPath = path.resolve(dirPath);
    while (currentDirPath.startsWith(workspaceRootPathWithSlash) || currentDirPath === workspaceRootPath) {
        const filePath = await findFileInDirectory(currentDirPath, findFileNames);
        if (filePath) {
            return filePath;
        }

        currentDirPath = path.dirname(currentDirPath);
    }

    return undefined;
}

async function findFileInDirectory(dirPath: string, findFileNames: string[]): Promise<string | undefined> {
    for (let i = 0; i < findFileNames.length; i++) {
        const filePath = path.join(dirPath, findFileNames[i]);
        if (await fileExists(filePath)) {
            return filePath;
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
