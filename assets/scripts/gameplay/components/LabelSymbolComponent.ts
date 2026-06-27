import { _decorator, Component, Label, Node } from 'cc';
import { SymbolComponent } from 'db://assets/scripts/basic/components/SymbolComponent';
import { ESymbolMap } from 'db://assets/scripts/enums';
const { ccclass, property } = _decorator;

// Just for debugging if we don't have symbol assets to see what happens on a reels.
@ccclass('LabelSymbolComponent')
export class LabelSymbolComponent extends SymbolComponent<ESymbolMap> {
    @property(Label)
    public label: Label = null;

    protected afterSymbolTypeChanged() {
        this.label.string = ESymbolMap[this._type];
    }
}
