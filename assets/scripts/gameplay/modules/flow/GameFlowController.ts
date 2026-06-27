import { _decorator } from 'cc';
import { GameController } from 'db://assets/scripts/gameplay/GameController';
import { GameEventMap } from 'db://assets/scripts/gameplay/events_manager/GameEventsManager';
import { EGameFlowEvent } from 'db://assets/scripts/gameplay/modules/flow/EGameFlowEvent';
import { EReelsEvent } from 'db://assets/scripts/gameplay/modules/reels/EReelsEvent';
import { EWinLinesEvent } from 'db://assets/scripts/gameplay/modules/win_lines/EWinLinesEvent';
const { ccclass, property } = _decorator;

@ccclass('GameFlowController')
export class GameFlowController extends GameController {
    protected setupEvents(): void {
        super.setupEvents();

        this.on(
            EReelsEvent.SPINNING_STOP_FINISHED,
            this.onSpinningStopFinished,
            this,
        );
    }

    protected async onSpinningStopFinished() {
        const { model } = this;

        const eventsFlow: [keyof GameEventMap, keyof GameEventMap][] = [];

        if (model.spinResult.wins) {
            eventsFlow.push([
                EGameFlowEvent.HAS_WIN,
                EWinLinesEvent.WIN_PRESENTATION_FINISHED,
            ]);
        }

        for (const [startEvent, endEvent] of eventsFlow) {
            await new Promise<void>((resolve) => {
                this.once(endEvent, () => {
                    resolve();
                });

                this.emit(startEvent);
            });
        }

        this.emit(EGameFlowEvent.ROUND_FINISHED);
    }
}
