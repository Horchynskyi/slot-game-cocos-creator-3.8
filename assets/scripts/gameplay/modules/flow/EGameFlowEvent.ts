export enum EGameFlowEvent {
    HAS_WIN = 'HAS_WIN',
    ROUND_FINISHED = 'ROUND_FINISHED',
}

declare module '../../events_manager/GameEventsManager' {
    export interface GameEventMap {
        [EGameFlowEvent.HAS_WIN]: [];
        [EGameFlowEvent.ROUND_FINISHED]: [];
    }
}
