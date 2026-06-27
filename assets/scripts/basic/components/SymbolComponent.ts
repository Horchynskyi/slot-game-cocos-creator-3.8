import { _decorator, Component, Enum, Node } from 'cc';
import { SymbolAnimationComponent } from './SymbolAnimationComponent';
const { ccclass, property } = _decorator;

@ccclass('SymbolComponent')
export class SymbolComponent<TSymbolMap = any> extends Component {
    protected _type: TSymbolMap = null;

    protected animationComponent: SymbolAnimationComponent = null;

    protected onLoad(): void {
        this.animationComponent = this.getComponent(SymbolAnimationComponent);
    }

    public playAnimation(name: string) {
        if (this.animationComponent) {
            this.animationComponent.play(name);
        }
    }

    public setSymbolType(type: TSymbolMap) {
        this._type = type;

        this.afterSymbolTypeChanged();
    }

    protected afterSymbolTypeChanged() {
        // Override this method in subclasses to handle symbol type changes
    }

    public get type() {
        return this._type;
    }
}
