import { _decorator, Graphics } from 'cc';
import { GameView } from 'db://assets/scripts/gameplay/GameView';
const { ccclass, property } = _decorator;

@ccclass('WinLinesView')
export class WinLinesView extends GameView {
    @property(Graphics)
    protected graphics: Graphics = null;

    public showWinLines(winLines: ReadonlyArray<ReadonlyArray<number>>): void {
        this.graphics.clear();

        const leftEdgeX = -(
            (this.config.reelsCount * this.config.symbolSize.x) /
            2
        );
        const rightEdgeX =
            (this.config.reelsCount * this.config.symbolSize.x) / 2;

        for (const winLine of winLines) {
            const startPosition = this.utils.getSymbolPositionInPixels(
                0,
                winLine[0],
            );
            const endPosition = this.utils.getSymbolPositionInPixels(
                winLine.length - 1,
                winLine[winLine.length - 1],
            );

            this.graphics.moveTo(leftEdgeX, startPosition.y);
            this.graphics.lineTo(startPosition.x, startPosition.y);

            for (let reelIndex = 1; reelIndex < winLine.length; reelIndex++) {
                const position = this.utils.getSymbolPositionInPixels(
                    reelIndex,
                    winLine[reelIndex],
                );

                this.graphics.lineTo(position.x, position.y);
            }

            this.graphics.lineTo(rightEdgeX, endPosition.y);

            this.graphics.stroke();
        }
    }

    public hideWinLines(): void {
        this.graphics.clear();
    }
}
