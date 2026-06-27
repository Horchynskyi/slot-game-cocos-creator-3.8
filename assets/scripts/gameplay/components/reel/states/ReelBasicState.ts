import { _decorator, Component } from 'cc';
import { ReelComponent } from 'db://assets/scripts/gameplay/components/reel/ReelComponent';
import { StateComponent } from 'db://assets/scripts/basic/StateComponent';
const { ccclass, property } = _decorator;

@ccclass('ReelBasicState')
export class ReelBasicState<
    TParent extends ReelComponent = ReelComponent,
> extends StateComponent<TParent> {
    public get config(): TParent['config'] {
        return this.parent.config;
    }
}
