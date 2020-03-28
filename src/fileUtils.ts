import * as fs from 'fs';

export async function fileExists(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return resolve(false);
                }
                return reject(err);
            }

            const isFile = stat.isFile();
            resolve(isFile);
        });
    });
}
