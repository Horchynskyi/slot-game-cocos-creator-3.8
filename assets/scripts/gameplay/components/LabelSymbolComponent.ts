import { _decorator, Component, Label, Node } from 'cc';
import { SymbolComponent } from '../../basic/components/SymbolComponent';
import { ESymbolMap } from '../../enums';
const { ccclass, property } = _decorator;

@ccclass('LabelSymbolComponent')
export class LabelSymbolComponent extends SymbolComponent<ESymbolMap> {
    @property(Label)
    public label: Label = null;

    protected afterSymbolTypeChanged() {
        this.label.string = ESymbolMap[this._type];
    }
}
