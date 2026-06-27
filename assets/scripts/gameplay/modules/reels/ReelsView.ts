import {
    _decorator,
    Component,
    instantiate,
    Node,
    Prefab,
    Vec2,
    Vec3,
} from 'cc';
import { GameView } from '../../GameView';
import { SymbolPrefabsOptions } from '../../components/SymbolPrefabsOptions';
import { ESymbolMap } from '../../../enums';
import { SymbolComponent } from '../../../basic/components/SymbolComponent';
import { ReelComponent } from '../../components/reel/ReelComponent';
import { EReelsViewEvents } from './EReelsViewEvents';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ReelsView')
@executeInEditMode
export class ReelsView extends GameView {
    @property(SymbolPrefabsOptions)
    protected symbolPrefabsOptions: SymbolPrefabsOptions = null;

    @property(Node)
    protected symbolsParent: Node = null;

    @property(Node)
    protected unmaskedSymbolsParent: Node = null;

    protected symbolsPrefabsMap: Map<ESymbolMap, Prefab> = new Map();
    protected symbols: SymbolComponent[] = [];
    protected reels: ReelComponent[] = [];

    protected symbolsByReels: SymbolComponent[][] = [];

    protected reelsSpinningOffset: Map<number, number> = new Map();
    protected reelsLastReorderY: Map<number, number> = new Map();

    protected spinning: boolean = false;

    public startSpinning(): void {
        const { reels, symbols, symbolsParent } = this;

        for (const symbol of symbols) {
            symbol.playAnimation('idle');

            symbolsParent.addChild(symbol.node);
        }

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];

            this.scheduleOnce(() => {
                reel.startSpinning();
            }, i * 0.1); // Stagger the start of each reel by 0.5 seconds
        }
    }

    public stopSpinning(stopIndexes: number[]) {
        const { reels } = this;

        let finishedReels = 0;

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];

            this.scheduleOnce(async () => {
                await reel.stopSpinning(stopIndexes[i]);

                finishedReels++;

                if (finishedReels === reels.length) {
                    this.emit(EReelsViewEvents.SPINNING_STOP_FINISHED);
                }
            }, i * 0.1); // Stagger the stop of each reel by 0.5 seconds
        }
    }

    public playWinAnimation(winPositions: Vec2[]) {
        for (const pos of winPositions) {
            const symbol = this.symbolsByReels[pos.x][pos.y + 1]; // +1 because of the extra symbol at the top

            symbol.playAnimation('win');

            this.unmaskedSymbolsParent.addChild(symbol.node);
        }
    }

    protected onLoad(): void {
        const { symbolsPrefabsMap, symbolPrefabsOptions } = this;

        for (const option of symbolPrefabsOptions.options) {
            symbolsPrefabsMap.set(option.type, option.prefab);
        }

        this.createSymbols();
    }

    protected createSymbol(type: ESymbolMap): Node {
        return instantiate(this.getSymbolPrefab(type));
    }

    protected createSymbols() {
        const {
            config,
            symbolsByReels,
            node,
            symbols,
            reelsSpinningOffset,
            reelsLastReorderY,
            reels,
            symbolsParent,
            utils,
        } = this;

        symbolsParent.destroyAllChildren();

        for (const reel of this.getComponents(ReelComponent)) {
            reel.destroy();
        }

        for (let x = 0; x < config.reelsCount; x++) {
            reelsSpinningOffset.set(x, 0);
            reelsLastReorderY.set(x, 0);

            const reelComponent = this.addComponent(ReelComponent);

            for (let y = -1; y < config.rowsCount + 1; y++) {
                const symbolNode = this.createSymbol(y);

                symbolsParent.addChild(symbolNode);

                const symbol = symbolNode.getComponent(SymbolComponent);

                if (symbol) {
                    symbols.push(symbol);

                    symbolsByReels[x] = symbolsByReels[x] || [];
                    symbolsByReels[x][y + 1] = symbol;
                }
            }

            reelComponent.setup({
                symbols: symbolsByReels[x],
                config,
                strip: config.reelStrips[x],
                index: x,
                utils,
            });

            reels.push(reelComponent);
        }
    }

    protected getSymbolPrefab(type: ESymbolMap): Prefab {
        const { symbolsPrefabsMap, symbolPrefabsOptions } = this;

        const prefab =
            symbolsPrefabsMap.get(type) || symbolPrefabsOptions.defaultPrefab;

        if (!prefab) {
            throw new Error(`Prefab for symbol type ${type} not found`);
        }

        return prefab;
    }
}
