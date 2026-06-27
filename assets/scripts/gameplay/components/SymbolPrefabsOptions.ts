import { _decorator, Component, Enum, Node, Prefab } from 'cc';
import { ESymbolMap } from '../../enums';
const { ccclass, property } = _decorator;

@ccclass('SymbolPrefabsOption')
class SymbolPrefabsOption {
    @property({ type: Enum(ESymbolMap) })
    readonly type: ESymbolMap = ESymbolMap.H1;

    @property(Prefab)
    readonly prefab: Prefab = null;
}

@ccclass('SymbolPrefabsOptions')
export class SymbolPrefabsOptions {
    @property(SymbolPrefabsOption)
    readonly options: SymbolPrefabsOption[] = [];

    @property(Prefab)
    readonly defaultPrefab: Prefab = null;
}
