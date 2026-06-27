import { _decorator, Component, Node } from 'cc';
import { GameController } from '../../GameController';
import { WinLinesView } from './WinLinesView';
import { WinLinesControllerWinState } from './states/WinLinesControllerWinState';
import { WinLinesControllerBasicState } from './states/WinLinesControllerBasicState';
import { WinLinesControllerIndividualLineWinState } from './states/WinLinesControllerIndividualLineWinState';
import { EReelsEvent } from '../reels/EReelsEvent';
import { EGameFlowEvent } from '../flow/EGameFlowEvent';
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
