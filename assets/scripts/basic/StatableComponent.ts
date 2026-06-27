import { Component } from 'cc';
import type { StateComponent } from './StateComponent';

export class StatableComponent<
    TState extends StateComponent = StateComponent,
> extends Component {
    protected state: TState = null;

    protected states: Map<new () => TState, TState> = new Map();

    public changeState(stateClass: new () => TState): void {
        if (this.state) {
            this.state.onExit();
        }

        if (!this.states.get(stateClass)) {
            this.addState(stateClass);
        }

        let state = this.states.get(stateClass);

        state.onEnter();

        this.state = state;
    }

    protected addState(stateClass: new () => TState): void {
        const state = this.addComponent(stateClass);

        state.enabled = false;

        this.setupState(state);

        this.states.set(stateClass, state);
    }

    protected setupState(state: TState) {
        state.setup({ parent: this });
    }

    protected enterFirstState(): void {}

    protected setupStates(): void {}
}
