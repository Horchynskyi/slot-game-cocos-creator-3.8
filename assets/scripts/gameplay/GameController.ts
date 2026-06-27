import { _decorator } from 'cc';
import { Controller } from 'db://assets/scripts/basic/Controller';
import { GameModel } from './GameModel';
import { GameConfig } from './GameConfig';
import { GameEventMap } from 'db://assets/scripts/gameplay/events_manager/GameEventsManager';
import { GameView } from './GameView';
import { GameUtils } from './GameUtils';
import { GameEventsManager } from 'db://assets/scripts/gameplay/events_manager/GameEventsManager';
const { ccclass } = _decorator;

@ccclass('GameController')
export class GameController<
    TView extends GameView<any> = GameView<any>,
> extends Controller<TView, GameModel, GameConfig, GameEventMap> {
    protected utils: GameUtils = null;

    public setup({
        model,
        config,
        eventsManager,
        utils,
    }: {
        model: GameModel;
        config: GameConfig;
        eventsManager: GameEventsManager;
        utils: GameUtils;
    }): void {
        super.setup({ model, config, eventsManager });

        this.utils = utils;
    }
}
