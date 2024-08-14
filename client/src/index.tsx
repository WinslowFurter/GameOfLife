import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { io, Socket } from 'socket.io-client';
import { patterns } from './patterns';

// Establish socket connection
const ENDPOINT = "http://localhost:3001"

const socket: Socket = io(ENDPOINT, {
    transports: ['websocket']
});

const numCols = 80;

const GameOfLife: React.FC = () => {
    const [grid, setGrid] = useState<number[][]>([]);
    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

    useEffect(() => {
        // Handle socket connection errors
        socket.on('connect_error', (err) => {
            console.log('Connection Error:', err.message);
            // The `description` property is not guaranteed to be present
            if ((err as any).description) {
                console.log('Description:', (err as any).description);
            }
        });

        // Handle connection success
        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        // Receive initial grid state from server
        socket.on('init', (initialGrid: number[][]) => {
            setGrid(initialGrid);
        });

        // Listen for grid updates from server
        socket.on('updateGrid', (updatedGrid: number[][]) => {
            setGrid(updatedGrid);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('connect_error');
            socket.off('connect');
            socket.off('init');
            socket.off('updateGrid');
        };
    }, []);

    const handleCellClick = (row: number, col: number) => {
        if (selectedPattern) {
            const pattern = patterns[selectedPattern];
            socket.emit('placePattern', { row, col, pattern });
        } else {
            const newGrid = grid.map(arr => [...arr]);
            newGrid[row][col] = grid[row][col] ? 0 : 1;
            setGrid(newGrid);
            socket.emit('placePattern', { row, col, pattern: [[newGrid[row][col]]] });
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                {Object.keys(patterns).map((patternKey) => (
                    <button key={patternKey} onClick={() => setSelectedPattern(patternKey)}>
                        {patternKey.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                ))}
                <button onClick={() => setSelectedPattern(null)}>Clear</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 10px)` }}>
                {grid.map((rows, i) =>
                    rows.map((col, j) => (
                        <div
                            key={`${i}-${j}`}
                            onClick={() => handleCellClick(i, j)}
                            style={{
                                width: 10,
                                height: 10,
                                backgroundColor: grid[i][j] ? 'black' : 'white',
                                border: 'solid 1px gray',
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<GameOfLife />);
}
