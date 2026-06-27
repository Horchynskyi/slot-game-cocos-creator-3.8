import { _decorator, Component } from 'cc';
import type { Controller } from './Controller';
import { StateComponent } from './StateComponent';
const { ccclass, property } = _decorator;

@ccclass('ControllerState')
export class ControllerState<
    TController extends Controller = Controller,
> extends StateComponent<TController> {
    public onEnter() {
        super.onEnter();

        this.setupEvents();
    }

    public onExit() {
        super.onExit();

        this.removeEvents();
    }

    protected setupEvents() {}

    protected removeEvents() {}

    public get model(): TController['model'] {
        return this.parent.model;
    }

    public get config(): TController['config'] {
        return this.parent.config;
    }

    public get view(): TController['view'] {
        return this.parent.view;
    }
}
