import { _decorator } from 'cc';
import { GameController } from '../../GameController';
import { WinFieldView } from './WinFieldView';
import { EGameFlowEvent } from '../flow/EGameFlowEvent';
import { ESpinButtonEvent } from '../spin_button/ESpinButtonEvent';
const { ccclass, property } = _decorator;

@ccclass('WinFieldController')
export class WinFieldController extends GameController<WinFieldView> {
    protected setupEvents(): void {
        super.setupEvents();

        this.on(EGameFlowEvent.HAS_WIN, this.onHasWin);
        this.on(ESpinButtonEvent.SPIN_BUTTON_CLICKED, this.onSpinButtonClicked);
    }

    protected onHasWin() {
        this.view.setWinField(this.model.spinResult.totalWin);
    }

    protected onSpinButtonClicked(): void {
        this.view.setWinField(0);
    }
}
