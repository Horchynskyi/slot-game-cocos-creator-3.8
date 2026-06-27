import { _decorator, Label } from 'cc';
import { GameView } from '../../GameView';
const { ccclass, property } = _decorator;

@ccclass('WinFieldView')
export class WinFieldView extends GameView {
    @property(Label)
    protected winFieldLabel: Label = null;

    public setWinField(value: number): void {
        const { config } = this;

        this.winFieldLabel.string = `${value}${config.currencySign}`;
    }
}
