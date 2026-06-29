import { _decorator, Component, instantiate, Node, Prefab, tween } from 'cc';
import { SymbolComponent } from 'db://assets/scripts/basic/components/SymbolComponent';
import { ESymbolMap } from 'db://assets/scripts/enums';
import { DeepReadonly } from 'db://assets/scripts/types';
import { GameConfig } from 'db://assets/scripts/gameplay/GameConfig';
import { GameUtils } from 'db://assets/scripts/gameplay/GameUtils';
import { StatableComponent } from 'db://assets/scripts/basic/StatableComponent';
import { EDITOR } from 'cc/env';
import { SymbolPrefabsOptions } from 'db://assets/scripts/gameplay/components/properties/SymbolPrefabsOptions';
import { ReelBasicState } from 'db://assets/scripts/gameplay/components/reel/states/ReelBasicState';
import { ReelSpinningStartState } from 'db://assets/scripts/gameplay/components/reel/states/ReelSpinningStartState';
import { ReelSpinningState } from 'db://assets/scripts/gameplay/components/reel/states/ReelSpinningState';
import { ReelStoppingState } from 'db://assets/scripts/gameplay/components/reel/states/ReelStoppingState';

const { ccclass, property } = _decorator;

@ccclass('ReelComponent')
export class ReelComponent extends StatableComponent<ReelBasicState> {
    public spinningOffset: number = 0;
    public stripIndex: number = 0;
    public lastSpinningReorderOffset: number = 0;

    public get symbols() {
        return this._symbols;
    }

    protected _symbols: SymbolComponent[] = [];

    protected symbolsOffset: number = 1;
    protected index: number = 0;
    protected utils: GameUtils = null;

    protected _stopIndex: number = null;
    protected _strip: ReadonlyArray<ESymbolMap> = null;
    protected _config: DeepReadonly<GameConfig> = null;
    protected symbolsPrefabsMap: Map<ESymbolMap, Prefab>;
    protected symbolPrefabsOptions: SymbolPrefabsOptions;

    public get stopIndex() {
        return this._stopIndex;
    }

    public get config() {
        return this._config;
    }

    public get strip() {
        return this._strip;
    }

    public setup({
        config,
        strip,
        utils,
        index,
        symbolsPrefabsMap,
        symbolPrefabsOptions,
    }: {
        config: DeepReadonly<GameConfig>;
        strip: ReadonlyArray<ESymbolMap>;
        utils: GameUtils;
        index: number;
        symbolsPrefabsMap: Map<ESymbolMap, Prefab>;
        symbolPrefabsOptions: SymbolPrefabsOptions;
    }) {
        this._config = config;
        this._strip = strip;

        this.utils = utils;
        this.index = index;

        this.symbolsPrefabsMap = symbolsPrefabsMap;
        this.symbolPrefabsOptions = symbolPrefabsOptions;

        this.createSymbols();
        this.setupSymbolsTypeByStrip();
        this.updateSymbolsPositions();

        if (!EDITOR) {
            this.setupStates();
            this.enterFirstState();
        }
    }

    protected createSymbol(type: ESymbolMap): Node {
        return instantiate(this.getSymbolPrefab(type));
    }

    protected createSymbols() {
        const { config, symbols } = this;

        for (let y = -1; y < config.rowsCount + 1; y++) {
            const symbolType =
                this.strip[this.getStripIndexWithOffset(this.stripIndex, y)];

            const symbolNode = this.createSymbol(symbolType);

            const symbol = symbolNode.getComponent(SymbolComponent);

            if (symbol) {
                symbols.push(symbol);
            } else {
                throw new Error(
                    `SymbolComponent not found on symbol prefab for type ${symbolType}`,
                );
            }
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

    protected enterFirstState() {
        this.changeState(ReelBasicState);
    }

    protected setupStates() {
        this.addState(ReelBasicState);
        this.addState(ReelSpinningState);
        this.addState(ReelSpinningStartState);
    }

    protected tryChangeSymbolType(symbol: SymbolComponent, type: ESymbolMap) {
        if (symbol.type === type) {
            return;
        }

        let actualSymbol = symbol;

        const prefab = this.getSymbolPrefab(type);

        if (symbol.node.name !== prefab.data.name) {
            const newSymbolNode = instantiate(prefab);

            const index = this.symbols.indexOf(symbol);

            const symbolParent = symbol.node.parent;

            symbol.node.destroy();

            this.symbols[index] = newSymbolNode.getComponent(SymbolComponent);

            symbolParent.addChild(newSymbolNode);

            actualSymbol = this.symbols[index];
        }

        actualSymbol.setSymbolType(type);
    }

    public startSpinning() {
        this.changeState(ReelSpinningStartState);
    }

    public async stopSpinning(stopIndex: number) {
        this._stopIndex = stopIndex;

        if (this.state instanceof ReelSpinningStartState) {
            await (this.state as ReelSpinningStartState).completeDeferred
                .promise;
        }

        if (this.state instanceof ReelSpinningState) {
            if (!this.state.minSpinningTimePassed) {
                await (this.state as ReelSpinningState)
                    .minSpinningTimePassedDeferred.promise;
            }
        }

        this.changeState(ReelStoppingState);

        await (this.state as ReelStoppingState).completeDeferred.promise;
    }

    public updateSymbolsPositions() {
        const { symbols } = this;

        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];

            symbol.node.position = this.getSymbolPosition(i - 1);
        }
    }

    public checkSymbolReorder() {
        const { config, symbols, spinningOffset } = this;

        const currentContainerY =
            spinningOffset + this.lastSpinningReorderOffset;

        const moveSymbolsToTop = Math.floor(
            -currentContainerY / config.symbolSize.y,
        );

        if (moveSymbolsToTop > 0) {
            for (let i = 0; i < moveSymbolsToTop; i++) {
                const lastSymbol = symbols.pop();

                symbols.unshift(lastSymbol);

                this.stripIndex -= 1;

                if (this.stripIndex < 0) {
                    this.stripIndex = this.strip.length - 1;
                }

                let value = this.getStripIndexWithOffset(
                    this.stripIndex,
                    -this.symbolsOffset,
                );

                this.tryChangeSymbolType(lastSymbol, this.strip[value]);
            }

            this.lastSpinningReorderOffset +=
                config.symbolSize.y * moveSymbolsToTop;
        }
    }

    public getStripIndexWithOffset(currentIndex: number, offset: number) {
        const { strip } = this;

        let newIndex = currentIndex + offset;

        if (newIndex < 0) {
            newIndex = strip.length + newIndex;
        } else if (newIndex >= strip.length) {
            newIndex = newIndex % strip.length;
        }

        return newIndex;
    }

    public setupSymbolsTypeByStrip() {
        const { symbols, strip, stripIndex, symbolsOffset } = this;

        let value = this.getStripIndexWithOffset(stripIndex, -symbolsOffset);

        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];

            symbol.setSymbolType(strip[value]);

            value++;

            if (value === strip.length) {
                value = 0;
            }
        }
    }

    public getSymbolPosition(symbolIndex: number) {
        const { utils, spinningOffset } = this;

        const position = utils.getSymbolPositionInPixels(
            this.index,
            symbolIndex,
        );

        position.y += spinningOffset + this.lastSpinningReorderOffset;

        return position;
    }
}
