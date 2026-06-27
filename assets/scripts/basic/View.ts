import { _decorator, Component } from 'cc';
import { Config } from './Config';
import { DeepReadonly } from 'db://assets/scripts/types';
import { EventArguments, EventKey } from './EventsManager';
const { ccclass } = _decorator;

@ccclass('View')
export class View<
    TConfig extends Config = Config,
    TEvents = Record<string, unknown[]>,
> extends Component {
    protected config: DeepReadonly<TConfig> = null;

    public setup({ config }: { config: TConfig }): void {
        this.config = config as DeepReadonly<TConfig>;
    }

    public on<K extends EventKey<TEvents>>(
        type: K,
        callback: (...args: EventArguments<TEvents, K>) => void,
        target?: unknown,
    ): void {
        this.node.on(type, callback, target);
    }

    public once<K extends EventKey<TEvents>>(
        type: K,
        callback: (...args: EventArguments<TEvents, K>) => void,
        target?: unknown,
    ): void {
        this.node.once(type, callback, target);
    }

    public off<K extends EventKey<TEvents>>(
        type: K,
        callback?: (...args: EventArguments<TEvents, K>) => void,
        target?: unknown,
    ): void {
        this.node.off(type, callback, target);
    }

    public emit<K extends EventKey<TEvents>>(
        type: K,
        ...args: EventArguments<TEvents, K>
    ): void {
        this.node.emit(type, ...args);
    }
}
