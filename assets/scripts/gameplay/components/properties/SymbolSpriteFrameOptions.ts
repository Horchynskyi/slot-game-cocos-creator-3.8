import { _decorator, Enum, SpriteFrame } from 'cc';
import { ESymbolMap } from 'db://assets/scripts/enums';
const { ccclass, property } = _decorator;

@ccclass('SymbolSpriteFramesOption')
class SymbolSpriteFramesOption {
    @property({ type: Enum(ESymbolMap) })
    readonly type: ESymbolMap = ESymbolMap.H1;

    @property(SpriteFrame)
    readonly spriteFrame: SpriteFrame = null;
}

@ccclass('SymbolSpriteFramesOptions')
export class SymbolSpriteFramesOptions {
    @property(SymbolSpriteFramesOption)
    readonly options: SymbolSpriteFramesOption[] = [];

    @property(SpriteFrame)
    readonly defaultSpriteFrame: SpriteFrame = null;
}
