import { _decorator, Component, tween } from 'cc';
import { SymbolComponent } from '../../../basic/components/SymbolComponent';
import { ESymbolMap } from '../../../enums';
import { DeepReadonly } from '../../../types';
import { GameConfig } from '../../GameConfig';
import { GameUtils } from '../../GameUtils';
import { StatableComponent } from '../../../basic/StatableComponent';
import { ReelBasicState } from './states/ReelBasicState';
import { ReelSpinningStartState } from './states/ReelSpinningStartState';
import { EDITOR } from 'cc/env';
import { ReelSpinningState } from './states/ReelSpinningState';
import { ReelStoppingState } from './states/ReelStoppingState';

const { ccclass, property } = _decorator;

@ccclass('ReelComponent')
export class ReelComponent extends StatableComponent<ReelBasicState> {
    public spinningOffset: number = 0;
    public stripIndex: number = 0;
    public lastSpinningReorderOffset: number = 0;

    protected _stopIndex: number;

    protected symbols: SymbolComponent[] = null;
    protected _config: DeepReadonly<GameConfig> = null;
    protected _strip: ReadonlyArray<ESymbolMap> = null;
    protected symbolsOffset: number = 1;
    protected utils: GameUtils;
    protected index: number = 0;

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
        symbols,
        config,
        strip,
        utils,
        index,
    }: {
        symbols: SymbolComponent[];
        config: DeepReadonly<GameConfig>;
        strip: ReadonlyArray<ESymbolMap>;
        utils: GameUtils;
        index: number;
    }) {
        this.symbols = symbols;
        this._config = config;
        this._strip = strip;
        this.utils = utils;
        this.index = index;

        this.setupSymbolsTypeByStrip();
        this.updateSymbolsPositions();

        if (!EDITOR) {
            this.setupStates();
            this.enterFirstState();
        }
    }

    protected enterFirstState() {
        this.changeState(ReelBasicState);
    }

    protected setupStates() {
        this.addState(ReelBasicState);
        this.addState(ReelSpinningState);
        this.addState(ReelSpinningStartState);
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

                lastSymbol.setSymbolType(this.strip[value]);
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
