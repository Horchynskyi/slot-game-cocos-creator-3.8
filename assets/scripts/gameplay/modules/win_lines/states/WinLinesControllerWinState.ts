import { ControllerState } from 'db://assets/scripts/basic/ControllerState';
import type { WinLinesController } from 'db://assets/scripts/gameplay/modules/win_lines/WinLinesController';
import { EWinLinesEvent } from 'db://assets/scripts/gameplay/modules/win_lines/EWinLinesEvent';
import { WinLinesControllerIndividualLineWinState } from 'db://assets/scripts/gameplay/modules/win_lines/states/WinLinesControllerIndividualLineWinState';
import { WinLinesControllerBasicState } from 'db://assets/scripts/gameplay/modules/win_lines/states/WinLinesControllerBasicState';

export class WinLinesControllerWinState extends ControllerState<WinLinesController> {
    public onEnter(): void {
        super.onEnter();

        const { model, view, config } = this;

        view.showWinLines(model.spinResult.wins.map((win) => win.winMatrix));

        this.scheduleOnce(() => {
            if (model.spinResult.wins.length > 1) {
                this.parent.changeState(
                    WinLinesControllerIndividualLineWinState,
                );
            } else {
                this.parent.changeState(WinLinesControllerBasicState);
            }

            this.parent.emit(EWinLinesEvent.WIN_PRESENTATION_FINISHED);
        }, config.initialWinPresentationDuration);
    }
}
