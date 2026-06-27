import { ControllerState } from 'db://assets/scripts/basic/ControllerState';
import type { WinLinesController } from '../WinLinesController';
import { WinLinesControllerIndividualLineWinState } from './WinLinesControllerIndividualLineWinState';
import { WinLinesControllerBasicState } from './WinLinesControllerBasicState';
import { EWinLinesEvent } from '../EWinLinesEvent';

export class WinLinesControllerWinState extends ControllerState<WinLinesController> {
    public onEnter(): void {
        super.onEnter();

        const { model, view } = this;

        view.showWinLines(model.spinResult.wins.map((win) => win.winMatrix));

        this.scheduleOnce(() => {
            if (model.spinResult.wins.length > 1) {
                this.changeState(WinLinesControllerIndividualLineWinState);
            } else {
                this.changeState(WinLinesControllerBasicState);
            }

            this.parent.emit(EWinLinesEvent.WIN_PRESENTATION_FINISHED);
        }, 1);
    }
}
