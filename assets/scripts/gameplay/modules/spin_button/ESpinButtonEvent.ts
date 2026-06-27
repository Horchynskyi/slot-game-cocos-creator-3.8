export enum ESpinButtonEvent {
    SPIN_BUTTON_CLICKED = 'SPIN_BUTTON_CLICKED',
}

declare module '../../events_manager/GameEventsManager' {
    export interface GameEventMap {
        [ESpinButtonEvent.SPIN_BUTTON_CLICKED]: [];
    }
}
