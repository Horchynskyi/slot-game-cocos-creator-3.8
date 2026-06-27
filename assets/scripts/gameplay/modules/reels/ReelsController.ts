import { _decorator, Component, Node, Vec2 } from 'cc';
import { GameController } from 'db://assets/scripts/gameplay/GameController';
import { TSpinResult } from 'db://assets/scripts/types';
import { EReelsViewEvents } from './EReelsViewEvents';
import { EGameLogicEvent } from 'db://assets/scripts/gameplay/logic/EGameLogicEvent';
import { EWinLinesEvent } from 'db://assets/scripts/gameplay/modules/win_lines/EWinLinesEvent';
import { ESpinButtonEvent } from 'db://assets/scripts/gameplay/modules/spin_button/ESpinButtonEvent';
import { EGameFlowEvent } from 'db://assets/scripts/gameplay/modules/flow/EGameFlowEvent';
import { EReelsEvent } from 'db://assets/scripts/gameplay/modules/reels/EReelsEvent';
import { ReelsView } from 'db://assets/scripts/gameplay/modules/reels/ReelsView';
const { ccclass, property } = _decorator;

@ccclass('ReelsController')
export class ReelsController extends GameController<ReelsView> {
    protected setupEvents(): void {
        super.setupEvents();

        this.on(ESpinButtonEvent.SPIN_BUTTON_CLICKED, this.onSpinButtonClicked);
        this.on(EGameLogicEvent.SPIN_RESULT_READY, this.onSpinResultReady);
        this.on(EGameFlowEvent.HAS_WIN, this.onHasWin);
        this.on(
            EWinLinesEvent.INDIVIDUAL_WIN_LINE_STARTED,
            this.onIndividualWinLineStarted,
        );
    }

    protected onIndividualWinLineStarted(winLineIndex: number) {
        const { model, view } = this;

        const winPositions: Vec2[] = [];

        const win = model.spinResult.wins[winLineIndex];

        for (let x = 0; x < win.length; x++) {
            const y = win.winMatrix[x];

            winPositions.push(new Vec2(x, y));
        }

        view.playWinAnimation(winPositions);
    }

    protected onHasWin() {
        const { model, view } = this;

        const winPositions: Vec2[] = [];

        for (const win of model.spinResult.wins) {
            for (let x = 0; x < win.length; x++) {
                const y = win.winMatrix[x];

                winPositions.push(new Vec2(x, y));
            }
        }

        view.playWinAnimation(winPositions);
    }

    protected setupViewEvents(): void {
        super.setupViewEvents();

        this.view.on(
            EReelsViewEvents.SPINNING_STOP_FINISHED,
            this.onViewSpinningStopFinished,
            this,
        );
    }

    protected onSpinButtonClicked(): void {
        this.view.startSpinning();

        this.emit(EReelsEvent.SPINNING_STARTED);
    }

    protected onSpinResultReady(spinResult: TSpinResult): void {
        this.view.stopSpinning(spinResult.stopSymbolIndexes);
    }

    protected onViewSpinningStopFinished(): void {
        this.emit(EReelsEvent.SPINNING_STOP_FINISHED);
    }
}
