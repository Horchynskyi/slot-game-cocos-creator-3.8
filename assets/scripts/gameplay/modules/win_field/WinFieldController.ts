import { _decorator } from 'cc';
import { GameController } from 'db://assets/scripts/gameplay/GameController';
import { EGameFlowEvent } from 'db://assets/scripts/gameplay/modules/flow/EGameFlowEvent';
import { ESpinButtonEvent } from 'db://assets/scripts/gameplay/modules/spin_button/ESpinButtonEvent';
import { WinFieldView } from 'db://assets/scripts/gameplay/modules/win_field/WinFieldView';
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
