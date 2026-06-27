import { easing, Vec2 } from 'cc';
import { Config } from 'db://assets/scripts/basic/Config';
import { ESymbolMap } from 'db://assets/scripts/enums';

export class GameConfig extends Config {
    public currencySign: string = '$';

    public symbolSize = new Vec2(265, 250);

    public reelsCount: number = 5;
    public rowsCount: number = 3;

    public initialWinPresentationDuration: number = 1;
    public individualWinPresentationDuration: number = 1.1;

    public reels = {
        spinningStartTime: 0.25,
        spinningStartOffset: this.symbolSize.y * 0.25,
        spinningStopTime: 0.5,
        spinningStartEasing: 'backOut' as keyof typeof easing,
        spinningStopEasing: 'backOut' as keyof typeof easing,
        spinningSpeed: 4000,
        minSpinningTime: 1.5,
    };

    public reelStrips = [
        [
            ESymbolMap.L5,
            ESymbolMap.H1,
            ESymbolMap.L1,
            ESymbolMap.L2,
            ESymbolMap.H4,
            ESymbolMap.WILD,
            ESymbolMap.H2,
            ESymbolMap.L3,
            ESymbolMap.H3,
            ESymbolMap.L4,
        ],
        [
            ESymbolMap.L1,
            ESymbolMap.L4,
            ESymbolMap.H3,
            ESymbolMap.H1,
            ESymbolMap.H2,
            ESymbolMap.L2,
            ESymbolMap.H4,
            ESymbolMap.L3,
            ESymbolMap.L5,
            ESymbolMap.WILD,
        ],
        [
            ESymbolMap.H1,
            ESymbolMap.L4,
            ESymbolMap.L1,
            ESymbolMap.L2,
            ESymbolMap.H4,
            ESymbolMap.WILD,
            ESymbolMap.H2,
            ESymbolMap.L3,
            ESymbolMap.H3,
            ESymbolMap.L5,
        ],
        [
            ESymbolMap.H3,
            ESymbolMap.H1,
            ESymbolMap.WILD,
            ESymbolMap.L1,
            ESymbolMap.L2,
            ESymbolMap.L3,
            ESymbolMap.H4,
            ESymbolMap.H2,
            ESymbolMap.L4,
            ESymbolMap.L5,
        ],
        [
            ESymbolMap.WILD,
            ESymbolMap.L3,
            ESymbolMap.H1,
            ESymbolMap.H2,
            ESymbolMap.L1,
            ESymbolMap.L2,
            ESymbolMap.H4,
            ESymbolMap.L4,
            ESymbolMap.H3,
            ESymbolMap.L5,
        ],
    ];

    //prettier-ignore
    public winMatrixes = [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0],
        [2, 1, 0, 1, 2],
        [0, 0, 1, 2, 2],
        [2, 2, 1, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 2, 2, 2, 1],
        [2, 1, 2, 1, 2],
    ];

    //prettier-ignore
    public payTable = {
        [ESymbolMap.WILD]: {
            3: 100,
            4: 1000,
            5: 2000,
        },
        [ESymbolMap.H1]: {
            3: 50,
            4: 500,
            5: 1000
        },
        [ESymbolMap.H2]: {
            3: 20,
            4: 150,
            5: 750
        },
        [ESymbolMap.H3]: {
            3: 15,
            4: 100,
            5: 500
        },
        [ESymbolMap.H4]: {
            3: 15,
            4: 100,
            5: 500
        },
        [ESymbolMap.L1]: {
            3: 10,
            4: 75,
            5: 250
        },
        [ESymbolMap.L2]: {
            3: 5,
            4: 50,
            5: 150
        },
        [ESymbolMap.L3]: {
            3: 5,
            4: 25,
            5: 150
        },
        [ESymbolMap.L4]: {
            3: 5,
            4: 25,
            5: 150
        },
        [ESymbolMap.L5]: {
            3: 5,
            4: 15,
            5: 100
        },
    }
}
