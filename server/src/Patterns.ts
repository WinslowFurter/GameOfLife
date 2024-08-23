export const PatternsPrimitives: { [key: string]: boolean[][] } = {
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


export const Patterns: { [key: string]: { pattern: boolean[][], weight: number } } = {
    block: { pattern: [[true, true], [true, true]], weight: 10 },
    gliderDownRight: { pattern: [[false, true, false], [false, false, true], [true, true, true]], weight: 5 },
    gliderUpRight: { pattern: [[true, true, true], [false, false, true], [false, true, false]], weight: 8 },
    gliderUpLeft: { pattern: [[true, true, true], [true, false, false], [false, true, false]], weight: 6 },
    gliderDownLeft: { pattern: [[false, true, false], [true, false, false], [true, true, true]], weight: 7 },
    splash: { pattern: [[false, true, false], [true, true, false], [false, true, true]], weight: 4 },
    pentomino: { pattern: [[false, true, true], [true, true, false], [false, true, false]], weight: 9 },
    verticalZouzou: { pattern: [[false, true, false], [false, true, false], [false, true, false]], weight: 3 },
    horizontalZouzou: { pattern: [[false, false, false], [true, true, true], [false, false, false]], weight: 2 },
    Clowntruetruefalse: { pattern: [[true, false, true], [true, false, true], [true, true, true]], weight: 1 },
    Zoer: { pattern: [[true, true, false, false], [true, true, false, false], [false, false, true, true], [false, false, true, true]], weight: 5 }
};


export function getRandomPatternName(): string {
    // Crée une liste de patterns avec répétition basée sur les poids
    const weightedPatterns: string[] = [];

    Object.keys(Patterns).forEach(key => {
        const { weight } = Patterns[key];
        for (let i = 0; i < weight; i++) {
            weightedPatterns.push(key);
        }
    });

    // Sélectionne un nom de pattern au hasard
    const randomIndex = Math.floor(Math.random() * weightedPatterns.length);
    return weightedPatterns[randomIndex];
}
