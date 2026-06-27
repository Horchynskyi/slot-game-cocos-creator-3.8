import { _decorator, Component } from 'cc';
import { Model } from './Model';
import { DeepReadonly } from '../types';
import { Config } from './Config';
import { EventArguments, EventKey, EventsManager } from './EventsManager';
import { View } from './View';
import { ControllerState } from './ControllerState';
import { StatableComponent } from './StatableComponent';
import { EDITOR } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller<
    TView extends View<any, any> = View<any, any>,
    TModel extends Model = Model,
    TConfig extends Config = Config,
    TEvents = any,
> extends StatableComponent<ControllerState> {
    @property(View)
    readonly view: TView = null;

    protected _model: DeepReadonly<TModel> = null;
    protected _config: DeepReadonly<TConfig> = null;
    protected _eventsManager: EventsManager<TEvents> = null;

    public setup({
        model,
        config,
        eventsManager,
    }: {
        model: TModel;
        config: TConfig;
        eventsManager: EventsManager<TEvents>;
    }): void {
        this._model = model as DeepReadonly<TModel>;
        this._config = config as DeepReadonly<TConfig>;
        this._eventsManager = eventsManager;

        this.setupEvents();
        this.setupViewEvents();

        if (!EDITOR) {
            // this.setupStates();
            this.enterFirstState();
        }
    }

    protected setupEvents(): void {}

    protected setupViewEvents(): void {}

    public on<K extends EventKey<TEvents>>(
        type: K,
        callback: (...args: EventArguments<TEvents, K>) => void,
        target: unknown = this,
    ): void {
        this._eventsManager.on(type, callback, target);
    }

    public once<K extends EventKey<TEvents>>(
        type: K,
        callback: (...args: EventArguments<TEvents, K>) => void,
        target: unknown = this,
    ): void {
        this._eventsManager.once(type, callback, target);
    }

    public off<K extends EventKey<TEvents>>(
        type: K,
        callback?: (...args: EventArguments<TEvents, K>) => void,
        target: unknown = this,
    ): void {
        this._eventsManager.off(type, callback, target);
    }

    public emit<K extends EventKey<TEvents>>(
        type: K,
        ...args: EventArguments<TEvents, K>
    ): void {
        this._eventsManager.emit(type, ...args);
    }

    public get model() {
        return this._model;
    }

    public get config() {
        return this._config;
    }
}
