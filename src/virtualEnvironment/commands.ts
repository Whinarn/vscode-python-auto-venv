export interface CustomCommandOptions {
    filePath: string;
}

export function prepareCustomCommand(command: string, options: CustomCommandOptions): string {
    return command.replace('$1', options.filePath);
}
