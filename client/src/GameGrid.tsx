import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import Cell, { CellProps } from './Cell';
import { patterns } from './patterns';
import Leaderboard from './Leaderboard';
import CursorGrid from './CursorGrid';
import { Player, updatePlayersGlobally } from './PlayersContext';

const ENDPOINT = "http://localhost:3001";
export const socket: Socket = io(ENDPOINT, {
    transports: ['websocket']
});

export const numRows = 50;
export const numCols = 80;

interface CellState {
    isAlive: boolean;
    activeGenerations: number;
    socketId: string | null;
    color: string;
}

const GameGrid: React.FC = () => {
    const [grid, setGrid] = useState<CellState[][]>(() => {
        return Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => ({ isAlive: false, activeGenerations: 0, socketId: null, color: "rgba(255,255,255,0)" }))
        );
    });

    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

    // Déclaration de useRef dans le composant
    const playersListRef = useRef<{ update: (newPlayers: Player[]) => void }>(null);

    useEffect(() => {
        socket.on('updateGrid', (newGrid: CellProps[][]) => {
            const updatedGrid = newGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const newCell = newGrid[rowIndex][colIndex];
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

        socket.on('updateLeaderboard', (players: Player[]) => {
            updatePlayersGlobally(players)
            handleLeaderboardUpdate(players);

        });

        socket.emit('requestInitialGrid');

        return () => {
            socket.off('updateGrid');
        };
    }, [grid]);

    const toggleCellState = (row: number, col: number) => {
        if (selectedPattern) {
            const pattern = patterns[selectedPattern];
            const socketId = socket.id;
            socket.emit('placePattern', { row, col, pattern, socketId });
        }
    };

    const handleLeaderboardUpdate = (players: Player[]) => {
        if (playersListRef.current) {
            playersListRef.current.update(players);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '95vh'
        }}>
            <div>
                <Leaderboard ref={playersListRef} />
            </div>
            <div style={{ position: 'absolute', display: 'grid', gridTemplateColumns: `repeat(${numCols}, 10px)` }}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        return (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                isAlive={cell.isAlive}
                                activeGenerations={cell.activeGenerations}
                                socketId={cell.socketId ? cell.socketId : null}
                                color={cell.color}
                                onClick={() => toggleCellState(rowIndex, colIndex)}
                            />
                        );
                    })
                )}
                <CursorGrid numRows={numRows} numCols={numCols} />
            </div>
        </div>
    );
};

export default GameGrid;
