import { _decorator, easing } from 'cc';
import { ReelComponent } from 'db://assets/scripts/gameplay/components/reel/ReelComponent';
import { Deferred } from 'db://assets/scripts/basic/Deferred';
import { ReelBasicState } from 'db://assets/scripts/gameplay/components/reel/states/ReelBasicState';
import { ReelSpinningState } from 'db://assets/scripts/gameplay/components/reel/states/ReelSpinningState';
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
            this.parent.changeState(ReelSpinningState);

            this.completeDeferred.resolve();
        }
    }

    public get completeDeferred(): Deferred {
        return this._completeDeferred;
    }
}
