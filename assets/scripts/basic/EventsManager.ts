import { EventTarget } from 'cc';

export type EventKey<T> = Extract<keyof T, string>;

export type EventArguments<T, K extends keyof T> = T[K] extends unknown[]
    ? T[K]
    : never;

export class EventsManager<TEvents> {
    private readonly eventTarget = new EventTarget();

    public on<K extends EventKey<TEvents>>(
        type: K,
        callback: (...args: EventArguments<TEvents, K>) => void,
        target?: unknown,
    ): void {
        this.eventTarget.on(type, callback, target);
    }

    public once<K extends EventKey<TEvents>>(
        type: K,
        callback: (...args: EventArguments<TEvents, K>) => void,
        target?: unknown,
    ): void {
        this.eventTarget.once(type, callback, target);
    }

    public off<K extends EventKey<TEvents>>(
        type: K,
        callback?: (...args: EventArguments<TEvents, K>) => void,
        target?: unknown,
    ): void {
        this.eventTarget.off(type, callback, target);
    }

    public emit<K extends EventKey<TEvents>>(
        type: K,
        ...args: EventArguments<TEvents, K>
    ): void {
        this.eventTarget.emit(type, ...args);
    }
}
