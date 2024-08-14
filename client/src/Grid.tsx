import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Cell from './Cell';
import { patterns } from './patterns';

const ENDPOINT = "http://localhost:3001"

const socket: Socket = io(ENDPOINT, {
    transports: ['websocket']
});

const numRows = 50;
const numCols = 80;

const Grid: React.FC = () => {
    const [grid, setGrid] = useState<number[][]>(() => {
        return Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => 0)
        );
    });

    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

    useEffect(() => {
        socket.on('updateGrid', (newGrid: number[][]) => {
            setGrid(newGrid);
        });

        socket.emit('requestInitialGrid');

        return () => {
            socket.off('updateGrid');
        };
    }, []);

    const toggleCellState = (row: number, col: number) => {
        if (selectedPattern) {
            const pattern = patterns[selectedPattern];
            socket.emit('placePattern', { row, col, pattern });
        } else {
            const newGrid = grid.map((gridRow, i) =>
                gridRow.map((cell, j) => (i === row && j === col ? 1 - cell : cell))
            );
            setGrid(newGrid);

            socket.emit('placePattern', {
                row,
                col,
                pattern: [[newGrid[row][col]]]
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '95vh'  // Facultatif, pour centrer verticalement sur toute la page
        }}>
            <div style={{ marginBottom: 10 }}>
                {Object.keys(patterns).map((patternKey) => (
                    <button key={patternKey} onClick={() => setSelectedPattern(patternKey)}>
                        {patternKey.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                ))}
                <button onClick={() => setSelectedPattern(null)}>Clear</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 10px)` }}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            isAlive={cell === 1}
                            onClick={() => toggleCellState(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Grid;
