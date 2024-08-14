import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'; // Import CORS

// Define types for exchanged data
interface PatternCell {
    row: number;
    col: number;
    pattern: number[][];
}

// Initialize constants and grid
const numRows = 50;
const numCols = 80;
let grid: number[][] = Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => 0)
);

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
const getNextState = (currentGrid: number[][]): number[][] => {
    const newGrid = currentGrid.map(arr => [...arr]);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const aliveNeighbors = getAliveNeighbors(currentGrid, row, col);
            if (currentGrid[row][col] === 1) {
                newGrid[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3 ? 1 : 0;
            } else {
                newGrid[row][col] = aliveNeighbors === 3 ? 1 : 0;
            }
        }
    }

    return newGrid;
};

// Helper function to count alive neighbors of a cell
const getAliveNeighbors = (grid: number[][], row: number, col: number): number => {
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
    }, 50); // Update every 0,05 second
};

// Start periodic grid updates
updateGridPeriodically();

// Handle socket.io connections
io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Send initial grid state to client
    socket.emit('init', grid);

    // Listen for grid updates
    socket.on('placePattern', ({ row, col, pattern }: PatternCell) => {
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
        io.emit('updateGrid', grid); // Broadcast updated grid to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('POUET POUET POUET EHEHEHEH');
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
