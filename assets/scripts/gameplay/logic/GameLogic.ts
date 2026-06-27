import { TSpinResult, TWinResult } from '../../types';
import { ESymbolMap } from '../../enums';
import { GameEventsManager } from '../events_manager/GameEventsManager';
import { GameConfig } from '../GameConfig';
import { GameModel } from '../GameModel';
import { EGameLogicEvent } from './EGameLogicEvent';
import { ESpinButtonEvent } from '../modules/spin_button/ESpinButtonEvent';

export class GameLogic {
    constructor(
        protected model: GameModel,
        protected eventsManager: GameEventsManager,
        protected config: GameConfig,
    ) {
        eventsManager.on(
            ESpinButtonEvent.SPIN_BUTTON_CLICKED,
            this.onSpinButtonClicked,
            this,
        );
    }

    private async onSpinButtonClicked() {
        const spinResult = await this.generateSpinResult();

        this.model.spinResult = spinResult;

        this.eventsManager.emit(EGameLogicEvent.SPIN_RESULT_READY, spinResult);
    }

    protected async generateSpinResult(): Promise<TSpinResult> {
        const { config } = this;

        const result: TSpinResult = {
            stopSymbolIndexes: [],
        };

        for (let i = 0; i < config.reelStrips.length; i++) {
            const stopIndex = Math.floor(
                Math.random() * config.reelStrips[i].length,
            );

            result.stopSymbolIndexes.push(stopIndex);
        }

        const wins = this.getWin(result.stopSymbolIndexes);

        if (wins.length > 0) {
            result.wins = wins;
            result.totalWin = wins.reduce((acc, win) => acc + win.win, 0);
        } else {
            // return this.generateSpinResult();
        }

        return result;
    }

    protected getWin(stopIndexes: number[]): TWinResult[] {
        const { config } = this;
        const wins: TWinResult[] = [];

        if (stopIndexes.length !== config.reelStrips.length) {
            return wins;
        }

        for (const winMatrix of config.winMatrixes) {
            let winSymbol: ESymbolMap = null;
            let winSymbols = 0;

            for (let reelIndex = 0; reelIndex < winMatrix.length; reelIndex++) {
                const strip = config.reelStrips[reelIndex];
                const rowIndex = winMatrix[reelIndex];
                const stripIndex =
                    (stopIndexes[reelIndex] + rowIndex) % strip.length;
                const symbol = strip[stripIndex];

                if (symbol === ESymbolMap.WILD) {
                    winSymbols++;
                } else if (winSymbol === null) {
                    winSymbol = symbol;
                    winSymbols++;
                } else if (symbol !== winSymbol) {
                    break;
                } else {
                    winSymbols++;
                }
            }

            if (winSymbols >= 3) {
                const payoutSymbol = winSymbol ?? ESymbolMap.WILD;
                const win = config.payTable[payoutSymbol]?.[winSymbols] ?? 0;

                wins.push({
                    win: win,
                    winMatrix,
                    length: winSymbols,
                });
            }
        }

        return wins;
    }
}
