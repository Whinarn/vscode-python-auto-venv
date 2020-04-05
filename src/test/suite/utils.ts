import * as mocha from 'mocha';

type Done = (err?: any) => void;
type Func = (this: mocha.Context, done: Done) => void;
type AsyncFunc = (this: mocha.Context) => PromiseLike<any>;

export function testWithPlatform(title: string, platform: string, fn: Func|AsyncFunc): mocha.Test {
    const testProxy = createTestProxy(platform, fn);
    return test(title, testProxy);
}

function createTestProxy(platform: string, fn: Func|AsyncFunc): Func|AsyncFunc {
    if (isFunctionAsync(fn)) {
        return createTestAsyncProxy(platform, fn);
    } else {
        return createTestSyncProxy(platform, fn);
    }
}

function createTestAsyncProxy(platform: string, fn: AsyncFunc): AsyncFunc {
    return async function(this: mocha.Context): Promise<any> {
        const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        Object.defineProperty(process, 'platform', { value: platform });

        try {
            await fn.apply(this);
        } finally {
            if (originalPlatform) {
                Object.defineProperty(process, 'platform', originalPlatform);
            }
        }
    };
}

function createTestSyncProxy(platform: string, fn: Func): Func {
    return function(this: mocha.Context, done: Done): void {
        const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        Object.defineProperty(process, 'platform', { value: platform });

        const doneProxy: Done = function(err?: any) {
            done(err);
        };

        try {
            fn.apply(this, [doneProxy]);
        } finally {
            if (originalPlatform) {
                Object.defineProperty(process, 'platform', originalPlatform);
            }
        }
    };
}

function isFunctionAsync(fn: Func|AsyncFunc): fn is AsyncFunc {
    return fn.length === 0;
}
