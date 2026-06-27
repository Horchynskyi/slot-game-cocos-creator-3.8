import { _decorator } from 'cc';
import { GameController } from '../../GameController';
import { SpinButtonView } from './SpinButtonView';
import { ESpinButtonViewEvents } from './ESpinButtonViewEvents';
import { ESpinButtonEvent } from './ESpinButtonEvent';
import { EGameFlowEvent } from '../flow/EGameFlowEvent';
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
