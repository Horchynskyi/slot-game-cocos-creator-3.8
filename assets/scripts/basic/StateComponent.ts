import { Component } from 'cc';

export class StateComponent<TParent = unknown> extends Component {
    protected parent: TParent = null;

    public onEnter() {
        this.enabled = true;
    }

    public onExit() {
        this.enabled = false;

        this.unscheduleAllCallbacks();
    }

    public setup({ parent }: { parent: TParent }): void {
        this.parent = parent;
    }
}
