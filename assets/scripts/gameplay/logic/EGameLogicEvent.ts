import { TSpinResult } from 'db://assets/scripts/types';

export enum EGameLogicEvent {
    SPIN_RESULT_READY = 'SPIN_RESULT_READY',
}

declare module 'db://assets/scripts/gameplay/events_manager/GameEventsManager' {
    export interface GameEventMap {
        [EGameLogicEvent.SPIN_RESULT_READY]: [TSpinResult];
    }
}
