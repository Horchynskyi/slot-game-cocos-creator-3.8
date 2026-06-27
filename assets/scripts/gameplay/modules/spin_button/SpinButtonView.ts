import { _decorator, Button } from 'cc';
import { GameView } from '../../GameView';
import {
    ESpinButtonViewEvents,
    SpinButtonViewEventMap,
} from './ESpinButtonViewEvents';
const { ccclass, property } = _decorator;

@ccclass('SpinButtonView')
export class SpinButtonView extends GameView<SpinButtonViewEventMap> {
    @property(Button)
    protected spinButton: Button = null;

    public setSpinButtonInteractable(value: boolean) {
        this.spinButton.interactable = value;
    }

    //Calls from editor
    protected onSpnButtonClicked() {
        this.emit(ESpinButtonViewEvents.SPIN_BUTTON_CLICKED);
    }
}
