import { _decorator, Enum, Sprite, SpriteFrame } from 'cc';
import { SymbolComponent } from '../../basic/components/SymbolComponent';
import { ESymbolMap } from '../../enums';
const { ccclass, property } = _decorator;

@ccclass('SymbolSpriteFramesOption')
class SymbolSpriteFramesOption {
    @property({ type: Enum(ESymbolMap) })
    readonly type: ESymbolMap = ESymbolMap.H1;

    @property(SpriteFrame)
    readonly spriteFrame: SpriteFrame = null;
}

@ccclass('SymbolSpriteFramesOptions')
class SymbolSpriteFramesOptions {
    @property(SymbolSpriteFramesOption)
    readonly options: SymbolSpriteFramesOption[] = [];

    @property(SpriteFrame)
    readonly defaultSpriteFrame: SpriteFrame = null;
}

@ccclass('SpriteSymbolComponent')
export class SpriteSymbolComponent extends SymbolComponent<ESymbolMap> {
    @property({ type: Enum(ESymbolMap) })
    public get type() {
        return this._type;
    }

    protected set type(value: ESymbolMap) {
        this.setSymbolType(value);
    }

    protected _type: ESymbolMap = ESymbolMap.H1;

    @property(Sprite)
    public sprite: Sprite = null;

    @property(SymbolSpriteFramesOptions)
    readonly symbolSpriteFramesOptions: SymbolSpriteFramesOptions =
        new SymbolSpriteFramesOptions();

    protected afterSymbolTypeChanged() {
        const frame = this.symbolSpriteFramesOptions.options.find(
            (f) => f.type === this._type,
        );

        if (frame) {
            this.sprite.spriteFrame = frame.spriteFrame;
        } else {
            console.log(
                `[SpriteSymbolComponent] No sprite frame found for type ${this._type}, using default sprite frame.`,
            );
            this.sprite.spriteFrame =
                this.symbolSpriteFramesOptions.defaultSpriteFrame;
        }
    }
}
