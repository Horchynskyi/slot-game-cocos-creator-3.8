export enum EWinLinesEvent {
    WIN_PRESENTATION_FINISHED = 'WIN_PRESENTATION_FINISHED',
    INDIVIDUAL_WIN_LINE_STARTED = 'INDIVIDUAL_WIN_LINE_STARTED',
}

declare module '../../events_manager/GameEventsManager' {
    export interface GameEventMap {
        [EWinLinesEvent.WIN_PRESENTATION_FINISHED]: [];
        [EWinLinesEvent.INDIVIDUAL_WIN_LINE_STARTED]: [number];
    }
}
