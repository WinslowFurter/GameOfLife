"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cells = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors")); // Import CORS
const player_1 = require("./player");
// Initialize constants and grid
const numRows = 50;
const numCols = 80;
exports.cells = [];
let grid = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 0));
const PORT = process.env.PORT || 3001;
// Create Express app and HTTP server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// Apply CORS middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
// Function to get the next state of the grid based on Game of Life rules
const getNextState = (currentGrid) => {
    const newGrid = currentGrid.map(arr => [...arr]);
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const aliveNeighbors = getAliveNeighbors(currentGrid, row, col);
            if (currentGrid[row][col] === 1) {
                newGrid[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3 ? 1 : 0;
            }
            else {
                newGrid[row][col] = aliveNeighbors === 3 ? 1 : 0;
            }
        }
    }
    return newGrid;
};
// Helper function to count alive neighbors of a cell
const getAliveNeighbors = (grid, row, col) => {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    return directions.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            count += grid[newRow][newCol];
        }
        return count;
    }, 0);
};
// Function to periodically update the grid state
const updateGridPeriodically = () => {
    setInterval(() => {
        grid = getNextState(grid);
        io.emit('updateGrid', grid); // Broadcast the updated grid to all clients
    }, 150); // Update every 0,05 second
};
// Start periodic grid updates
updateGridPeriodically();
// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    const player = new player_1.Player(socket.id);
    player.build();
    console.log(player_1.players);
    // Écouter les demandes pour la grille initiale
    socket.on('requestInitialGrid', () => {
        socket.emit('init', grid);
    });
    // Écouter les mises à jour de la grille par le client
    socket.on('placePattern', ({ row, col, pattern }) => {
        const newGrid = grid.map(arr => [...arr]);
        pattern.forEach((patternRow, i) => {
            patternRow.forEach((patternCell, j) => {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow < numRows && newCol < numCols) {
                    newGrid[newRow][newCol] = patternCell;
                }
            });
        });
        grid = newGrid;
        io.emit('updateGrid', grid); // Diffuser la grille mise à jour à tous les clients
    });
    socket.on('disconnect', () => {
        player_1.players;
        console.log('User disconnected:', socket.id);
    });
});
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Add error handling for connection errors
io.engine.on("connection_error", (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    // `context` might not exist on the `err` object, so let's check for its presence
    if ('context' in err) {
        console.log(err.context); // some additional error context
    }
});
