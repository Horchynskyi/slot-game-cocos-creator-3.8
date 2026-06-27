import { _decorator, Enum, Sprite } from 'cc';
import { SymbolComponent } from 'db://assets/scripts/basic/components/SymbolComponent';
import { ESymbolMap } from 'db://assets/scripts/enums';
import { SymbolSpriteFramesOptions } from 'db://assets/scripts/gameplay/components/properties/SymbolSpriteFrameOptions';
const { ccclass, property } = _decorator;

@ccclass('SpriteSymbolComponent')
export class SpriteSymbolComponent extends SymbolComponent<ESymbolMap> {
    @property({ type: Enum(ESymbolMap) })
    public get type() {
        return this._type;
    }

    protected set type(value: ESymbolMap) {
        this.setSymbolType(value);
    }

    protected _type: ESymbolMap = ESymbolMap.WILD;

    @property(Sprite)
    public sprite: Sprite = null;

    @property(SymbolSpriteFramesOptions)
    readonly symbolSpriteFramesOptions: SymbolSpriteFramesOptions =
        new SymbolSpriteFramesOptions();

    protected afterSymbolTypeChanged() {
        const { sprite, symbolSpriteFramesOptions } = this;

        const frame = symbolSpriteFramesOptions.options.find(
            (f) => f.type === this._type,
        );

        if (frame) {
            sprite.spriteFrame = frame.spriteFrame;
        } else {
            sprite.spriteFrame = symbolSpriteFramesOptions.defaultSpriteFrame;
        }
    }
}
