import { ControllerState } from 'db://assets/scripts/basic/ControllerState';
import type { WinLinesController } from 'db://assets/scripts/gameplay/modules/win_lines/WinLinesController';
import { EWinLinesEvent } from 'db://assets/scripts/gameplay/modules/win_lines/EWinLinesEvent';

export class WinLinesControllerIndividualLineWinState extends ControllerState<WinLinesController> {
    protected currentLineIndex: number = 0;

    public onEnter(): void {
        super.onEnter();

        this.playCurrentLineWin();
    }

    public onExit(): void {
        super.onExit();

        this.currentLineIndex = 0;
    }

    protected playCurrentLineWin() {
        const { model, view, parent, config } = this;

        parent.emit(
            EWinLinesEvent.INDIVIDUAL_WIN_LINE_STARTED,
            this.currentLineIndex,
        );

        view.showWinLines([
            model.spinResult.wins[this.currentLineIndex].winMatrix,
        ]);

        this.scheduleOnce(() => {
            this.proceedToNextLineWin();
        }, config.individualWinPresentationDuration);
    }

    protected proceedToNextLineWin() {
        const { model } = this;

        this.currentLineIndex++;

        if (this.currentLineIndex === model.spinResult.wins.length) {
            this.currentLineIndex = 0;
        }

        this.playCurrentLineWin();
    }
}
