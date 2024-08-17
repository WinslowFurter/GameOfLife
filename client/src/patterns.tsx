export const patterns: { [key: string]: boolean[][] } = {
    block: [
        [true, true],
        [true, true],
    ],
    gliderDownRight: [
        [false, true, false],
        [false, false, true],
        [true, true, true],
    ],
    gliderUpRight: [
        [true, true, true],
        [false, false, true],
        [false, true, false],
    ],
    gliderUpLeft: [
        [true, true, true],
        [true, false, false],
        [false, true, false],
    ],
    gliderDownLeft: [
        [false, true, false],
        [true, false, false],
        [true, true, true],
    ],
    splash: [
        [false, true, false],
        [true, true, false],
        [false, true, true],
    ],
    pentomino: [
        [false, true, true],
        [true, true, false],
        [false, true, false],
    ],
    verticalZouzou: [
        [false, true, false],
        [false, true, false],
        [false, true, false],
    ],
    horizontalZouzou: [
        [false, false, false],
        [true, true, true],
        [false, false, false],
    ],
    Clowntruetruefalse: [
        [true, false, true],
        [true, false, true],
        [true, true, true],
    ],
    Zoer: [
        [true, true, false, false],
        [true, true, false, false],
        [false, false, true, true],
        [false, false, true, true],
    ]
};