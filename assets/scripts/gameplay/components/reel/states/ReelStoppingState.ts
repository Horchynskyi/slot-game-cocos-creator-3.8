import { _decorator, easing } from 'cc';
import { ReelComponent } from '../ReelComponent';
import { ReelBasicState } from './ReelBasicState';
import { Deferred } from 'db://assets/scripts/basic/Deferred';
const { ccclass } = _decorator;

@ccclass('ReelStoppingState')
export class ReelStoppingState extends ReelBasicState<ReelComponent> {
    protected _completeDeferred: Deferred = null;
    protected elapsedTime: number = 0;
    protected startOffset: number = 0;
    protected targetStopOffset: number = 0;

    public onEnter(): void {
        super.onEnter();

        this._completeDeferred = new Deferred();

        const { stopIndex, strip, spinningOffset, config } = this.parent;

        const symbolsToStop = 4;

        let symbolIndex = (stopIndex + symbolsToStop) % strip.length;

        this.parent.stripIndex = symbolIndex;

        const passedSymbolOffset = spinningOffset % config.symbolSize.y;

        const stopOffset =
            spinningOffset -
            passedSymbolOffset -
            config.symbolSize.y * symbolsToStop;

        this.startOffset = spinningOffset;
        this.targetStopOffset = stopOffset;
    }

    public onExit(): void {
        super.onExit();

        this.elapsedTime = 0;
    }

    protected update(dt: number): void {
        this.elapsedTime += dt;

        const { config } = this;

        const duration = config.reels.spinningStopTime;
        const rawProgress = duration > 0 ? this.elapsedTime / duration : 1;
        const progress = Math.min(1, rawProgress);
        const easedProgress = easing[config.reels.spinningStopEasing](progress);

        this.parent.spinningOffset =
            this.startOffset +
            (this.targetStopOffset - this.startOffset) * easedProgress;

        this.parent.checkSymbolReorder();
        this.parent.updateSymbolsPositions();

        if (this.elapsedTime < duration) {
            return;
        }

        this.parent.spinningOffset = 0;
        this.parent.lastSpinningReorderOffset = 0;

        this.parent.changeState(ReelBasicState);

        this._completeDeferred.resolve();
    }

    public get completeDeferred() {
        return this._completeDeferred;
    }
}
