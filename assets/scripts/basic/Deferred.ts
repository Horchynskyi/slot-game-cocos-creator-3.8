export class Deferred<T = void> {
    public readonly promise: Promise<T>;

    private _resolve!: (value: T | PromiseLike<T>) => void;
    private _reject!: (reason?: unknown) => void;
    private _isSettled = false;

    public constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public resolve(value: T | PromiseLike<T> = undefined as T): void {
        if (this._isSettled) return;
        this._isSettled = true;
        this._resolve(value);
    }

    public reject(reason?: unknown): void {
        if (this._isSettled) return;
        this._isSettled = true;
        this._reject(reason);
    }

    public get isSettled(): boolean {
        return this._isSettled;
    }
}
