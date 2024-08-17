"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playersExpelled = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors")); // Import CORS
const player_1 = require("./player");
const Cell_1 = require("./Cell");
// Initialize constants and grid
const numRows = 50;
const numCols = 80;
let grid = Array.from({ length: numRows }, (_, rowIndex) => Array.from({ length: numCols }, (_, colIndex) => new Cell_1.Cell(`${rowIndex}-${colIndex}`)));
exports.playersExpelled = [];
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
    const newGrid = currentGrid.map(row => row.map(cell => cell.clone()));
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            for (let i = 0; i < exports.playersExpelled.length; i++) {
                if (newGrid[row][col].socketId === exports.playersExpelled[i]) {
                    newGrid[row][col].socketId = null;
                    newGrid[row][col].setColor();
                }
            }
            newGrid[row][col].setColor();
            const aliveNeighbors = getAliveNeighbors(currentGrid, row, col);
            const actualCell = newGrid[row][col];
            let isAlive = actualCell.isAlive;
            let socketId = actualCell.socketId;
            let color = actualCell.color;
            let activeGenerations = actualCell.activeGenerations;
            if (currentGrid[row][col].isAlive) {
                actualCell.isAlive = aliveNeighbors === 2 || aliveNeighbors === 3 ? isAlive = true : isAlive = false;
            }
            else {
                actualCell.isAlive = aliveNeighbors === 3 ? isAlive = true : isAlive = false;
            }
            let cellProps = {
                isAlive: false,
                socketId: null,
                color: "rgba(255,255,255,1)",
                activeGenerations: activeGenerations,
            };
            if (actualCell.isAlive) {
                const MostCellProps = getAliveNeighborsCellProps(currentGrid, row, col);
                cellProps = {
                    isAlive: isAlive,
                    socketId: MostCellProps.socketId,
                    color: MostCellProps.color,
                    activeGenerations: activeGenerations,
                };
            }
            actualCell.checkState(cellProps);
        }
    }
    exports.playersExpelled.length = 0;
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
            if (grid[newRow][newCol].isAlive) {
                count++;
            }
        }
        return count;
    }, 0);
};
const getAliveNeighborsCellProps = (grid, row, col) => {
    var _a, _b;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    const tab = [];
    directions.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            if (grid[newRow][newCol].isAlive) {
                count++;
                tab.push(grid[newRow][newCol]);
            }
        }
        return count;
    }, 0);
    const cellId = (_a = elementLePlusRepresente(tab)) === null || _a === void 0 ? void 0 : _a.id;
    let mostRepresentedCell;
    if (cellId) {
        mostRepresentedCell = findCellInGridById(grid, cellId);
    }
    console.log("CACA PROUT");
    console.log(mostRepresentedCell);
    if (mostRepresentedCell) {
        return mostRepresentedCell === null || mostRepresentedCell === void 0 ? void 0 : mostRepresentedCell.getCellResume();
    }
    else {
        return (_b = tab[0]) === null || _b === void 0 ? void 0 : _b.getCellResume();
    }
};
function findCellInGridById(tableaux, idRecherche) {
    for (const tableau of tableaux) {
        for (const objet of tableau) {
            if (objet.id === idRecherche) {
                return objet;
            }
        }
    }
    return null; // Retourne null si l'objet n'est pas trouvé
}
function elementLePlusRepresente(tableau) {
    const compteur = {};
    // Compter les occurrences de chaque élément
    for (const element of tableau) {
        const key = JSON.stringify(element); // Transformer l'élément en string pour l'utiliser comme clé
        compteur[key] = (compteur[key] || 0) + 1;
    }
    // Trouver l'élément avec le maximum d'occurrences
    let maxElement = null;
    let maxOccurrences = 0;
    for (const key in compteur) {
        if (compteur[key] > maxOccurrences) {
            maxOccurrences = compteur[key];
            maxElement = JSON.parse(key);
        }
    }
    return maxElement;
}
// Function to periodically update the grid state
const updateGridPeriodically = () => {
    setInterval(() => {
        grid = getNextState(grid);
        io.emit('updateGrid', grid); // Broadcast the updated grid to all clients
    }, 50); // Update every 0,05 second
};
// Start periodic grid updates
updateGridPeriodically();
// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    if (!player_1.players.find(player => player.id == socket.id)) {
        new player_1.Player(socket.id);
    }
    // Écouter les demandes pour la grille initiale
    socket.on('requestInitialGrid', () => {
        socket.emit('init', grid);
    });
    // Écouter les mises à jour de la grille par le client
    socket.on('placePattern', ({ row, col, pattern, socketId }) => {
        console.log("ICI SE FONT LES TESTS TA KPT");
        console.log(socketId);
        console.log(col + " " + row);
        const newGrid = grid.map(row => row.map(cell => cell.clone()));
        pattern.forEach((patternRow, i) => {
            patternRow.forEach((patternCell, j) => {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow < numRows && newCol < numCols) {
                    const player = player_1.players.find(player => player.id === socketId);
                    let playerColor = "rgba(1,1,1,1)";
                    if (player) {
                        playerColor = player.color;
                    }
                    const cellProps = {
                        isAlive: patternCell,
                        socketId: socketId,
                        color: playerColor,
                        activeGenerations: 0,
                    };
                    console.log(cellProps);
                    newGrid[newRow][newCol].checkState(cellProps);
                }
            });
        });
        grid = newGrid;
        io.emit('updateGrid', grid); // Diffuser la grille mise à jour à tous les clients
    });
    socket.on('disconnect', () => {
        const player = player_1.players.find(player => player.id == socket.id);
        if (player) {
            player.expell();
        }
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
