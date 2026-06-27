import { TSpinResult } from '../../types';

export enum EGameLogicEvent {
    SPIN_RESULT_READY = 'SPIN_RESULT_READY',
}

declare module '../events_manager/GameEventsManager' {
    export interface GameEventMap {
        [EGameLogicEvent.SPIN_RESULT_READY]: [TSpinResult];
    }
}
