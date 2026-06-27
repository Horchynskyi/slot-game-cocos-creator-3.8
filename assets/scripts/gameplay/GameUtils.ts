import { Vec2, Vec3 } from 'cc';
import { DeepReadonly } from '../types';
import { GameConfig } from './GameConfig';

export class GameUtils {
    constructor(protected config: DeepReadonly<GameConfig>) {}

    public getSymbolPositionInPixels(x: number, y: number) {
        const { config } = this;

        const startX = -((config.reelsCount - 1) * config.symbolSize.x) / 2;
        const startY = ((config.rowsCount - 1) * config.symbolSize.y) / 2;

        return new Vec3(
            startX + x * config.symbolSize.x,
            startY - y * config.symbolSize.y,
            0,
        );
    }
}
