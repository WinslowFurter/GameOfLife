import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Cell, { CellProps } from './Cell';
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
    socketId: string | null;
    color: string
}

const Grid: React.FC = () => {
    const [grid, setGrid] = useState<CellState[][]>(() => {
        return Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => ({ isAlive: false, activeGenerations: 0, socketId: null, color: "rgba(255,255,255,0)" }))
        );
    });

    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

    useEffect(() => {
        socket.on('updateGrid', (newGrid: CellProps[][]) => {
            const updatedGrid = newGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const newCell = newGrid[rowIndex][colIndex];

                    // If the cell is now alive, check neighbors to possibly update the socketId

                    return {
                        isAlive: newCell.isAlive,
                        activeGenerations: newCell.activeGenerations,
                        socketId: newCell.socketId,
                        color: newCell.color
                    };
                })
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
            console.log(selectedPattern)
            const pattern = patterns[selectedPattern];
            const socketId = socket.id
            console.log(socketId)
            socket.emit('placePattern', { row, col, pattern, socketId });
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
                            socketId={cell.socketId ? cell.socketId : null}
                            color={cell.color}
                            onClick={() => toggleCellState(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Grid;
