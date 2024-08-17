import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'; // Import CORS
import { Player, players } from './player';
import { getRandomContrastingColor } from "./Utils"
import { Cell, CellProps } from './Cell';

// Define types for exchanged data
interface PatternCell {
    row: number;
    col: number;
    pattern: boolean[][];
    socketId: string;
}

// Initialize constants and grid
const numRows = 50;
const numCols = 80;
let grid: Cell[][] = Array.from({ length: numRows }, (_, rowIndex) =>
    Array.from({ length: numCols }, (_, colIndex) => new Cell(`${rowIndex}-${colIndex}`))
);

export const playersExpelled: string[] = []
const PORT = process.env.PORT || 3001;

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Apply CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Function to get the next state of the grid based on Game of Life rules
const getNextState = (currentGrid: Cell[][]): Cell[][] => {
    const newGrid = currentGrid.map(row => row.map(cell => cell.clone()));

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            for (let i = 0; i < playersExpelled.length; i++) {
                if (newGrid[row][col].socketId === playersExpelled[i]) {
                    newGrid[row][col].socketId = null;
                    newGrid[row][col].setColor()
                }
            }
            newGrid[row][col].setColor()
            const aliveNeighbors = getAliveNeighbors(currentGrid, row, col);

            const actualCell = newGrid[row][col]
            let isAlive = actualCell.isAlive
            let socketId = actualCell.socketId
            let color = actualCell.color
            let activeGenerations = actualCell.activeGenerations;

            if (currentGrid[row][col].isAlive) {
                actualCell.isAlive = aliveNeighbors === 2 || aliveNeighbors === 3 ? isAlive = true : isAlive = false;
            } else {
                actualCell.isAlive = aliveNeighbors === 3 ? isAlive = true : isAlive = false;
            }

            let cellProps: CellProps = {
                isAlive: false,
                socketId: null,
                color: "rgba(255,255,255,1)",
                activeGenerations: activeGenerations,
            }
            if (actualCell.isAlive) {
                const MostCellProps = getAliveNeighborsCellProps(currentGrid, row, col)
                cellProps = {
                    isAlive: isAlive,
                    socketId: MostCellProps.socketId,
                    color: MostCellProps.color,
                    activeGenerations: activeGenerations,
                }
            }
            actualCell.checkState(cellProps)
        }
    }
    playersExpelled.length = 0;
    return newGrid;
};

// Helper function to count alive neighbors of a cell
const getAliveNeighbors = (grid: Cell[][], row: number, col: number): number => {
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
                count++
            }
        }
        return count;
    }, 0);
};

const getAliveNeighborsCellProps = (grid: Cell[][], row: number, col: number): CellProps => {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    const tab: Cell[] = []
    directions.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            if (grid[newRow][newCol].isAlive) {
                count++
                tab.push(grid[newRow][newCol])
            }
        }
        return count;
    }, 0);
    const cellId = elementLePlusRepresente(tab)?.id
    let mostRepresentedCell
    if (cellId) {
        mostRepresentedCell = findCellInGridById(grid, cellId)
    }
    console.log("CACA PROUT")
    console.log(mostRepresentedCell)
    if (mostRepresentedCell) {
        return mostRepresentedCell?.getCellResume()
    } else {
        return tab[0]?.getCellResume()
    }
};


function findCellInGridById(tableaux: Cell[][], idRecherche: number | string): Cell | null {
    for (const tableau of tableaux) {
        for (const objet of tableau) {
            if (objet.id === idRecherche) {
                return objet;
            }
        }
    }
    return null; // Retourne null si l'objet n'est pas trouvé
}

function elementLePlusRepresente<T>(tableau: T[]): T | null {
    const compteur: { [key: string]: number } = {};

    // Compter les occurrences de chaque élément
    for (const element of tableau) {
        const key = JSON.stringify(element); // Transformer l'élément en string pour l'utiliser comme clé
        compteur[key] = (compteur[key] || 0) + 1;
    }

    // Trouver l'élément avec le maximum d'occurrences
    let maxElement: T | null = null;
    let maxOccurrences = 0;

    for (const key in compteur) {
        if (compteur[key] > maxOccurrences) {
            maxOccurrences = compteur[key];
            maxElement = JSON.parse(key) as T;
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
io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);
    if (!players.find(player => player.id == socket.id)) {
        new Player(socket.id)
    }

    // Écouter les demandes pour la grille initiale
    socket.on('requestInitialGrid', () => {
        socket.emit('init', grid);
    });

    // Écouter les mises à jour de la grille par le client
    socket.on('placePattern', ({ row, col, pattern, socketId }: PatternCell) => {

        console.log("ICI SE FONT LES TESTS TA KPT")
        console.log(socketId)
        console.log(col + " " + row)
        const newGrid = grid.map(row => row.map(cell => cell.clone()));
        pattern.forEach((patternRow, i) => {
            patternRow.forEach((patternCell, j) => {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow < numRows && newCol < numCols) {

                    const player = players.find(player => player.id === socketId)
                    let playerColor = "rgba(1,1,1,1)"
                    if (player) {
                        playerColor = player.color
                    }

                    const cellProps: CellProps = {
                        isAlive: patternCell,
                        socketId: socketId,
                        color: playerColor,
                        activeGenerations: 0,
                    }
                    console.log(cellProps)
                    newGrid[newRow][newCol].checkState(cellProps);
                }
            });
        });
        grid = newGrid;
        io.emit('updateGrid', grid); // Diffuser la grille mise à jour à tous les clients
    });

    socket.on('disconnect', () => {
        const player = players.find(player => player.id == socket.id)
        if (player) {
            player.expell()
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
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    // `context` might not exist on the `err` object, so let's check for its presence
    if ('context' in err) {
        console.log(err.context);  // some additional error context
    }
});
