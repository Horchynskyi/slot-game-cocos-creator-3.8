export type DeepReadonly<T> = T extends (...args: any[]) => any
    ? T
    : T extends readonly (infer U)[]
      ? readonly DeepReadonly<U>[]
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

export type TWinResult = {
    win: number;
    winMatrix: number[];
    length: number;
};

export type TSpinResult = {
    stopSymbolIndexes: number[];
    wins?: TWinResult[];
    totalWin?: number;
};
