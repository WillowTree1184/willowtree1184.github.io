export function waitFor(
    condition: () => boolean,
    interval: number = 50,
    timeout: number = 10000,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const check = () => {
            if (condition()) {
                resolve();
                return;
            }

            if (Date.now() - startTime > timeout) {
                reject(new Error('waitFor timeout'));
                return;
            }

            setTimeout(check, interval);
        };

        check();
    });
}
