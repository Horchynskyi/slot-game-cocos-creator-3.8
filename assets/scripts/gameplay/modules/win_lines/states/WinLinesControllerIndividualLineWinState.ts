import { ControllerState } from 'db://assets/scripts/basic/ControllerState';
import type { WinLinesController } from '../WinLinesController';
import { EWinLinesEvent } from '../EWinLinesEvent';

export class WinLinesControllerIndividualLineWinState extends ControllerState<WinLinesController> {
    protected currentLineIndex: number = 0;
    protected lineChangeDuration: number = 1.1;

    public onEnter(): void {
        super.onEnter();

        this.playCurrentLineWin();
    }

    public onExit(): void {
        super.onExit();

        this.currentLineIndex = 0;
    }

    protected playCurrentLineWin() {
        const { model, view, parent } = this;

        parent.emit(
            EWinLinesEvent.INDIVIDUAL_WIN_LINE_STARTED,
            this.currentLineIndex,
        );

        view.showWinLines([
            model.spinResult.wins[this.currentLineIndex].winMatrix,
        ]);

        this.scheduleOnce(() => {
            this.proceedToNextLineWin();
        }, this.lineChangeDuration);
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
