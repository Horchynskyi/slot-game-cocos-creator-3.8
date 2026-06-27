import { _decorator, Component, Node } from 'cc';
import { GameModel } from './GameModel';
import { GameController } from './GameController';
import { GameConfig } from './GameConfig';
import { GameView } from './GameView';
import { EventsManager } from '../basic/EventsManager';
import { GameEventMap } from './events_manager/GameEventsManager';
import { GameLogic } from './logic/GameLogic';
import { GameUtils } from './GameUtils';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('GameplayMain')
@executeInEditMode
export class GameplayMain extends Component {
    protected model: GameModel = new GameModel();
    protected config: GameConfig = new GameConfig();
    protected eventsManager: EventsManager<GameEventMap> =
        new EventsManager<GameEventMap>();
    protected utils: GameUtils = new GameUtils(this.config);

    protected logic: GameLogic = null;

    protected onLoad() {
        this.logic = new GameLogic(this.model, this.eventsManager, this.config);

        this.setupControllers();
        this.setupViews();
    }

    protected setupControllers() {
        const { model, config, eventsManager, utils } = this;

        const controllers = this.getComponentsInChildren(GameController);

        for (const controller of controllers) {
            controller.setup({ model, config, eventsManager, utils });
        }
    }

    protected setupViews() {
        const { config, utils } = this;

        const views = this.getComponentsInChildren(GameView);

        for (const view of views) {
            view.setup({ config, utils });
        }
    }
}
