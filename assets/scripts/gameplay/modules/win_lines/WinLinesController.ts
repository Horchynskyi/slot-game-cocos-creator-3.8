import { _decorator, Component, Node } from 'cc';
import { GameController } from 'db://assets/scripts/gameplay/GameController';
import { WinLinesControllerIndividualLineWinState } from './states/WinLinesControllerIndividualLineWinState';
import { EReelsEvent } from 'db://assets/scripts/gameplay/modules/reels/EReelsEvent';
import { EGameFlowEvent } from 'db://assets/scripts/gameplay/modules/flow/EGameFlowEvent';
import { WinLinesControllerBasicState } from 'db://assets/scripts/gameplay/modules/win_lines/states/WinLinesControllerBasicState';
import { WinLinesControllerWinState } from 'db://assets/scripts/gameplay/modules/win_lines/states/WinLinesControllerWinState';
import { WinLinesView } from 'db://assets/scripts/gameplay/modules/win_lines/WinLinesView';
const { ccclass, property } = _decorator;

@ccclass('WinLinesController')
export class WinLinesController extends GameController<WinLinesView> {
    protected setupEvents(): void {
        super.setupEvents();

        this.on(EReelsEvent.SPINNING_STARTED, this.onSpinningStarted);
        this.on(EGameFlowEvent.HAS_WIN, this.onHasWin);
    }

    protected enterFirstState(): void {
        this.changeState(WinLinesControllerBasicState);
    }

    protected setupStates(): void {
        this.addState(WinLinesControllerBasicState);
        this.addState(WinLinesControllerWinState);
        this.addState(WinLinesControllerIndividualLineWinState);
    }

    protected onSpinningStarted() {
        this.changeState(WinLinesControllerBasicState);
    }

    protected onHasWin() {
        this.changeState(WinLinesControllerWinState);
    }
}
