import { _decorator, Animation, Component, Node } from 'cc';
import { SymbolAnimationComponent } from '../../basic/components/SymbolAnimationComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SymbolCocosAnimationComponent')
@requireComponent(Animation)
export class SymbolCocosAnimationComponent extends SymbolAnimationComponent {
    protected animation: Animation;

    protected onLoad(): void {
        this.animation = this.getComponent(Animation);
    }

    public play(name: string) {
        this.animation.play(name);
    }
}
