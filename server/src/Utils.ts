export const colorsForPlayers = [
    'rgba(200, 0, 0, 1)',       // Intense Red
    'rgba(0, 0, 200, 1)',       // Intense Blue
    'rgba(0, 150, 0, 1)',       // Intense Green
    'rgba(150, 0, 150, 1)',     // Intense Magenta
    'rgba(150, 75, 0, 1)',      // Intense Brown/Orange
    'rgba(0, 0, 100, 1)',       // Dark Blue
    'rgba(200, 0, 100, 1)',     // Intense Pink
    'rgba(0, 150, 150, 1)',     // Intense Cyan
];

export const getRandomContrastingColor = (): string => {

    const res = colorsForPlayers[0]
    colorsForPlayers.splice(0, 1);
    return res;
};