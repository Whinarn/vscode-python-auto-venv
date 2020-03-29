import * as vscode from 'vscode';

const OUTPUT_CHANNEL_NAME = 'Python Auto Venv';

let outputChannel: vscode.OutputChannel | undefined;

export function setup(): vscode.OutputChannel {
    outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    return outputChannel;
}

export function info(message: any, ...optionalParams: any[]): void {
    if (outputChannel) {
        const text = getText('[INFO]', message, optionalParams);
        outputChannel.appendLine(text);
    }
}

export function warn(message: any, ...optionalParams: any[]): void {
    if (outputChannel) {
        const text = getText('[WARNING]', message, optionalParams);
        outputChannel.appendLine(text);
    }
}

export function error(message: any, ...optionalParams: any[]): void {
    if (outputChannel) {
        const text = getText('[ERROR]', message, optionalParams);
        outputChannel.appendLine(text);
    }
}

function getText(level: string, message: any, optionalParams: any[]): string {
    return [
        level,
        message,
        ...optionalParams
    ].join(' ');
}
