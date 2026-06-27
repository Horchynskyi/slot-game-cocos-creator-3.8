import { _decorator, easing } from 'cc';
import { ReelComponent } from '../ReelComponent';
import { ReelBasicState } from './ReelBasicState';
import { ReelSpinningState } from './ReelSpinningState';
import { Deferred } from 'db://assets/scripts/basic/Deferred';
const { ccclass } = _decorator;

@ccclass('ReelSpinningStartState')
export class ReelSpinningStartState extends ReelBasicState<ReelComponent> {
    protected _completeDeferred: Deferred = null;

    protected elapsedTime: number = 0;

    public onEnter(): void {
        super.onEnter();

        this._completeDeferred = new Deferred();
    }

    public onExit() {
        super.onExit();
        this.elapsedTime = 0;
    }

    protected update(dt: number): void {
        const { config } = this;

        this.elapsedTime += dt;

        const duration = config.reels.spinningStartTime;
        const rawProgress = duration > 0 ? this.elapsedTime / duration : 1;
        const progress = Math.min(1, rawProgress);

        const easedProgress =
            easing[config.reels.spinningStartEasing](progress);
        const targetOffset = config.reels.spinningStartOffset;

        this.parent.spinningOffset = targetOffset * easedProgress;

        this.parent.updateSymbolsPositions();

        if (this.elapsedTime >= duration) {
            this.changeState(ReelSpinningState);

            this.completeDeferred.resolve();
        }
    }

    public get completeDeferred(): Deferred {
        return this._completeDeferred;
    }
}
