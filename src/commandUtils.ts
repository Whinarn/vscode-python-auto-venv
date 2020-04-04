import * as childProcess from 'child_process';
import * as logger from './logger';

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

export function getCommand(commandPath: string, ...args: string[]): string {
    const escapedCommandPath = escapePath(commandPath);
    const escapedArgs = args.map((arg) => {
        return escapeArgument(arg);
    });
    return [
        escapedCommandPath,
        ...escapedArgs
    ].join(' ');
}

export function escapePath(path: string): string {
    if (process.platform === 'win32') {
        if (/(\s+)/g.test(path)) {
            return `"${path}"`;
        }
        return path;
    } else {
        return path.replace(/(\s+)/g, '\\$1');
    }
}

export function escapeArgument(arg: string): string {
    if (process.platform === 'win32') {
        if (/[^A-Za-z0-9_\/:=-]/.test(arg)) {
            const escapedDoubleQuotes = arg.replace(/"/g, '""');
            return `"${escapedDoubleQuotes}"`;
        }
        return arg;
    } else {
        if (/[^A-Za-z0-9_\/:=-]/.test(arg)) {
            const escapedSingleQuotes = arg.replace(/'/g, '\\\'');
            return `'${escapedSingleQuotes}'`;
        }
        return arg;
    }
}
