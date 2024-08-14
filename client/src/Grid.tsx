import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Cell from './Cell';
import { patterns } from './patterns';

const ENDPOINT = "http://localhost:3001";
const socket: Socket = io(ENDPOINT, {
    transports: ['websocket']
});

const numRows = 50;
const numCols = 80;

interface CellState {
    isAlive: boolean;
    activeGenerations: number;
}

const Grid: React.FC = () => {
    const [grid, setGrid] = useState<CellState[][]>(() => {
        return Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => ({ isAlive: false, activeGenerations: 0 }))
        );
    });

    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

    useEffect(() => {
        socket.on('updateGrid', (newGrid: number[][]) => {
            const updatedGrid = newGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => ({
                    isAlive: cell === 1,
                    activeGenerations: grid[rowIndex][colIndex].isAlive
                        ? grid[rowIndex][colIndex].activeGenerations + 1
                        : 0
                }))
            );
            setGrid(updatedGrid);
        });

        socket.emit('requestInitialGrid');

        return () => {
            socket.off('updateGrid');
        };
    }, [grid]);

    const toggleCellState = (row: number, col: number) => {
        if (selectedPattern) {
            const pattern = patterns[selectedPattern];
            socket.emit('placePattern', { row, col, pattern });
        } else {
            const newGrid = grid.map((gridRow, i) =>
                gridRow.map((cell, j) => {
                    if (i === row && j === col) {
                        const newIsAlive = !cell.isAlive;
                        return {
                            isAlive: newIsAlive,
                            activeGenerations: newIsAlive ? cell.activeGenerations + 1 : 0
                        };
                    }
                    return cell;
                })
            );
            setGrid(newGrid);

            socket.emit('placePattern', {
                row,
                col,
                pattern: [[newGrid[row][col].isAlive ? 1 : 0]]
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '95vh'  // Optional, to center vertically on the entire page
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
                            isAlive={cell.isAlive}
                            activeGenerations={cell.activeGenerations}
                            onClick={() => toggleCellState(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Grid;
