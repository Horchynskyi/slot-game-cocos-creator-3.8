import { _decorator } from 'cc';
import { View } from '../basic/View';
import { GameConfig } from './GameConfig';
import { GameUtils } from './GameUtils';
const { ccclass } = _decorator;

@ccclass('GameView')
export class GameView<TEvents = Record<string, unknown[]>> extends View<
    GameConfig,
    TEvents
> {
    protected utils: GameUtils = null;

    public setup({
        config,
        utils,
    }: {
        config: GameConfig;
        utils: GameUtils;
    }): void {
        super.setup({ config });

        this.utils = utils;
    }
}
