export const getRandomContrastingColor = (): string => {
    const colors = [
        'rgba(255, 0, 0, 1)',       // Red
        'rgba(0, 255, 0, 1)',       // Green
        'rgba(0, 0, 255, 1)',       // Blue
        'rgba(255, 255, 0, 1)',     // Yellow
        'rgba(0, 255, 255, 1)',     // Cyan
        'rgba(255, 0, 255, 1)',     // Magenta
        'rgba(255, 128, 0, 1)',     // Orange
        'rgba(128, 0, 255, 1)',     // Purple
        'rgba(0, 255, 128, 1)',     // Lime Green
        'rgba(255, 0, 128, 1)',     // Pink
        'rgba(128, 255, 0, 1)',     // Chartreuse
        'rgba(0, 128, 255, 1)',     // Azure
        'rgba(255, 255, 128, 1)',   // Light Yellow
        'rgba(128, 255, 255, 1)',   // Light Cyan
        'rgba(255, 128, 255, 1)',   // Light Magenta
        'rgba(128, 0, 0, 1)',       // Dark Red
        'rgba(0, 128, 0, 1)',       // Dark Green
        'rgba(0, 0, 128, 1)',       // Dark Blue
        'rgba(128, 128, 0, 1)',     // Olive
        'rgba(0, 128, 128, 1)',     // Teal
        'rgba(128, 0, 128, 1)',     // Indigo
        'rgba(128, 128, 128, 1)',   // Grey
        'rgba(192, 192, 192, 1)',   // Silver
        'rgba(255, 69, 0, 1)',      // Orange Red
        'rgba(154, 205, 50, 1)',    // Yellow Green
        'rgba(186, 85, 211, 1)',    // Medium Orchid
        'rgba(0, 191, 255, 1)',     // Deep Sky Blue
        'rgba(255, 20, 147, 1)',    // Deep Pink
        'rgba(173, 255, 47, 1)',    // Green Yellow
        'rgba(255, 105, 180, 1)',   // Hot Pink
        'rgba(72, 61, 139, 1)',     // Dark Slate Blue
        'rgba(250, 128, 114, 1)',   // Salmon
        'rgba(32, 178, 170, 1)',    // Light Sea Green
        'rgba(255, 165, 0, 1)',     // Orange
        'rgba(0, 206, 209, 1)',     // Dark Turquoise
        'rgba(139, 0, 139, 1)',     // Dark Magenta
        'rgba(233, 150, 122, 1)',   // Dark Salmon
        'rgba(144, 238, 144, 1)',   // Light Green
        'rgba(244, 164, 96, 1)',    // Sandy Brown
        'rgba(255, 228, 181, 1)'    // Moccasin
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

// Example usage:
const randomColor = getRandomContrastingColor();
