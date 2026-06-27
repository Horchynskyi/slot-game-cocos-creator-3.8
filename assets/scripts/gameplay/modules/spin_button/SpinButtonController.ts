import { _decorator } from 'cc';
import { GameController } from 'db://assets/scripts/gameplay/GameController';
import { EGameFlowEvent } from 'db://assets/scripts/gameplay/modules/flow/EGameFlowEvent';
import { ESpinButtonEvent } from 'db://assets/scripts/gameplay/modules/spin_button/ESpinButtonEvent';
import { ESpinButtonViewEvents } from 'db://assets/scripts/gameplay/modules/spin_button/ESpinButtonViewEvents';
import { SpinButtonView } from 'db://assets/scripts/gameplay/modules/spin_button/SpinButtonView';
const { ccclass } = _decorator;

@ccclass('SpinButtonController')
export class SpinButtonController extends GameController<SpinButtonView> {
    protected setupEvents(): void {
        super.setupEvents();

        this.on(EGameFlowEvent.ROUND_FINISHED, this.onRoundFinished);
    }

    protected setupViewEvents(): void {
        super.setupViewEvents();

        const { view } = this;

        view.on(
            ESpinButtonViewEvents.SPIN_BUTTON_CLICKED,
            this.onViewSpinButtonClicked,
            this,
        );
    }

    protected onViewSpinButtonClicked(): void {
        this.view.setSpinButtonInteractable(false);

        this.emit(ESpinButtonEvent.SPIN_BUTTON_CLICKED);
    }

    protected onRoundFinished(): void {
        this.view.setSpinButtonInteractable(true);
    }
}
