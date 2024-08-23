import React, { useState, useEffect } from 'react';
import { socket } from './GameGrid';
import { usePlayers } from './PlayersContext';

interface CursorGridProps {
    numRows: number;
    numCols: number;
}

const CursorGrid: React.FC<CursorGridProps> = ({ numRows, numCols }) => {
    const [cursorPosition, setCursorPosition] = useState<{ row: number, col: number }>({ row: 0, col: 0 });
    const { players } = usePlayers(); // Correct usage of hook

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setCursorPosition((prevPosition) => {
                let { row, col } = prevPosition;
                if (event.key === 'ArrowUp') {
                    row = Math.max(row - 1, 0);
                } else if (event.key === 'ArrowDown') {
                    row = Math.min(row + 1, numRows - 1);
                } else if (event.key === 'ArrowLeft') {
                    col = Math.max(col - 1, 0);
                } else if (event.key === 'ArrowRight') {
                    col = Math.min(col + 1, numCols - 1);
                }
                return { row, col };
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [numRows, numCols]);

    useEffect(() => {
        const player = players.find(player => player.socketId === socket.id);
        console.log('Found player:', player);
        const interval = setInterval(() => {
            console.log('ICI SA PASSE')
        }, 5000);

        return () => clearInterval(interval);
    }, [cursorPosition, players]); // Add `players` to the dependency array

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'grid',
                gridTemplateColumns: `repeat(${numCols}, 10px)`,
                pointerEvents: 'none', // Allow clicks to pass through
                zIndex: 1 // Ensure it's above the main grid
            }}
        >
            {Array.from({ length: numRows }).map((_, rowIndex) =>
                Array.from({ length: numCols }).map((_, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            width: 10,
                            height: 10,
                            border: '1px solid grey',
                            backgroundColor: rowIndex === cursorPosition.row && colIndex === cursorPosition.col ? 'rgba(255, 0, 0, 0.5)' : 'transparent'
                        }}
                    />
                ))
            )}
        </div>
    );
};

export default CursorGrid;
