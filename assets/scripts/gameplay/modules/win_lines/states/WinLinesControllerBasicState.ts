import { ControllerState } from 'db://assets/scripts/basic/ControllerState';
import type { WinLinesController } from '../WinLinesController';

export class WinLinesControllerBasicState extends ControllerState<WinLinesController> {
    public onEnter(): void {
        super.onEnter();

        this.view.hideWinLines();
    }
}
