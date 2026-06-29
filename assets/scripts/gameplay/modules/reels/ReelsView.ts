import { _decorator, Node, Prefab, Vec2 } from 'cc';
import { GameView } from 'db://assets/scripts/gameplay/GameView';
import { ESymbolMap } from 'db://assets/scripts/enums';
import { SymbolComponent } from 'db://assets/scripts/basic/components/SymbolComponent';
import { ReelComponent } from 'db://assets/scripts/gameplay/components/reel/ReelComponent';
import { EReelsViewEvents } from './EReelsViewEvents';
import { SymbolPrefabsOptions } from 'db://assets/scripts/gameplay/components/properties/SymbolPrefabsOptions';
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
    protected reels: ReelComponent[] = [];

    protected symbolsByReels: SymbolComponent[][] = [];

    protected reelsSpinningOffset: Map<number, number> = new Map();
    protected reelsLastReorderY: Map<number, number> = new Map();

    public startSpinning(): void {
        const { reels } = this;

        this.playAnimationForAllSymbols('idle');
        this.moveAllSymbolToMaskedParent();

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
        this.moveAllSymbolToMaskedParent();

        for (const pos of winPositions) {
            const symbol = this.symbolsByReels[pos.x][pos.y + 1]; // +1 because of the extra symbol at the top

            symbol.playAnimation('win');

            this.unmaskedSymbolsParent.addChild(symbol.node);
        }
    }

    protected playAnimationForAllSymbols(name: string) {
        const { symbolsByReels } = this;

        for (const symbols of symbolsByReels) {
            for (const symbol of symbols) {
                symbol.playAnimation(name);
            }
        }
    }

    protected moveAllSymbolToMaskedParent() {
        const { symbolsByReels, symbolsParent } = this;

        for (const symbols of symbolsByReels) {
            for (const symbol of symbols) {
                symbolsParent.addChild(symbol.node);
            }
        }
    }

    protected onLoad(): void {
        const { symbolsPrefabsMap, symbolPrefabsOptions } = this;

        for (const option of symbolPrefabsOptions.options) {
            symbolsPrefabsMap.set(option.type, option.prefab);
        }

        this.createReels();
    }

    protected createReels() {
        const {
            config,
            symbolsByReels,
            reelsSpinningOffset,
            reelsLastReorderY,
            reels,
            symbolsParent,
            utils,
            symbolsPrefabsMap,
            symbolPrefabsOptions,
        } = this;

        // Clear existing symbols and reels for editor mode
        symbolsParent.destroyAllChildren();

        for (const reel of this.getComponents(ReelComponent)) {
            reel.destroy();
        }

        for (let x = 0; x < config.reelsCount; x++) {
            reelsSpinningOffset.set(x, 0);
            reelsLastReorderY.set(x, 0);

            const reelComponent = this.addComponent(ReelComponent);

            reelComponent.setup({
                config,
                strip: config.reelStrips[x],
                index: x,
                utils,
                symbolsPrefabsMap: symbolsPrefabsMap,
                symbolPrefabsOptions: symbolPrefabsOptions,
            });

            symbolsByReels[x] = reelComponent.symbols;

            for (const symbol of reelComponent.symbols) {
                symbolsParent.addChild(symbol.node);
            }

            reels.push(reelComponent);
        }
    }
}
