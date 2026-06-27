import { _decorator, Component, tween } from 'cc';
import { ReelComponent } from '../ReelComponent';
import { ReelBasicState } from './ReelBasicState';
import { Deferred } from 'db://assets/scripts/basic/Deferred';
const { ccclass, property } = _decorator;

@ccclass('ReelSpinningState')
export class ReelSpinningState extends ReelBasicState<ReelComponent> {
    protected _minSpinningTimePassedDeferred: Deferred = null;
    protected _minSpinningTimePassed: boolean = false;

    protected spinningTimePassed: number = 0;

    public onEnter(): void {
        super.onEnter();

        this._minSpinningTimePassedDeferred = new Deferred();
    }

    public onExit(): void {
        super.onExit();

        this.spinningTimePassed = 0;
        this._minSpinningTimePassed = false;
    }

    protected update(dt: number): void {
        this.spinningTimePassed += dt;

        this.parent.spinningOffset -= this.config.reels.spinningSpeed * dt;

        this.parent.checkSymbolReorder();
        this.parent.updateSymbolsPositions();

        if (
            this.spinningTimePassed >= this.config.reels.minSpinningTime &&
            !this._minSpinningTimePassed
        ) {
            this._minSpinningTimePassed = true;
            this._minSpinningTimePassedDeferred.resolve();
        }
    }

    public get minSpinningTimePassed() {
        return this._minSpinningTimePassed;
    }

    public get minSpinningTimePassedDeferred() {
        return this._minSpinningTimePassedDeferred;
    }
}
