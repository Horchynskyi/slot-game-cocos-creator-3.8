export enum EReelsEvent {
    SPINNING_STARTED = 'SPINNING_STARTED',
    SPINNING_STOP_FINISHED = 'SPINNING_STOP_FINISHED',
    WIN_PRESENTATION_FINISHED = 'WIN_PRESENTATION_FINISHED',
}

declare module 'db://assets/scripts/gameplay/events_manager/GameEventsManager' {
    export interface GameEventMap {
        [EReelsEvent.SPINNING_STARTED]: [];
        [EReelsEvent.SPINNING_STOP_FINISHED]: [];
        [EReelsEvent.WIN_PRESENTATION_FINISHED]: [];
    }
}
