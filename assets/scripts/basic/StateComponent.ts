import { Component } from 'cc';
import type { StatableComponent } from './StatableComponent';

export class StateComponent<
    TParent extends StatableComponent = StatableComponent,
> extends Component {
    protected parent: TParent = null;

    public onEnter() {
        this.enabled = true;
    }

    public onExit() {
        this.enabled = false;

        this.unscheduleAllCallbacks();
    }

    public changeState(state: new () => StateComponent<TParent>): void {
        this.parent.changeState(state);
    }

    public setup({ parent }: { parent: TParent }): void {
        this.parent = parent;
    }
}
