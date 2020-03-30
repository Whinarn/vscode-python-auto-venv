import * as childProcess from 'child_process';
import * as logger from './logger';

const whitespaceRegex = /(\s+)/g;

export interface ExecuteOptions extends childProcess.ExecOptions {
}

export interface ExecuteCommandError extends childProcess.ExecException {
    stderr: string;
}

export function executeCommand(command: string, options: ExecuteOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        logger.info('Executing command:', command);
        childProcess.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                return reject({
                    ...err,
                    stderr: stderr,
                });
            }

            resolve(stdout.trim());
        });
    });
}

export async function executeCommandBasic(command: string, options: ExecuteOptions): Promise<string> {
    try {
        return await executeCommand(command, options);
    } catch (err) {
        throw new Error(err.stderr || err.message);
    }
}

export function escapePath(path: string): string {
    if (process.platform === 'win32') {
        if (whitespaceRegex.test(path)) {
            return `"${path}"`;
        }
        return path;
    } else {
        return path.replace(whitespaceRegex, '\\$1');
    }
}
