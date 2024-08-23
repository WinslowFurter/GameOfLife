import React, { useState, useEffect } from 'react';
import { socket } from './GameGrid';
import { getPlayerById, Player, usePlayers } from './PlayersContext';

interface CursorGridProps {
    numRows: number;
    numCols: number;
}
export interface cursorCoordinates {
    row: number;
    col: number;
}
const CursorGrid: React.FC<CursorGridProps> = ({ numRows, numCols }) => {
    const { players } = usePlayers(); // Correct usage of hook
    const player = socket.id ? getPlayerById(socket.id) : null; // Assure un appel inconditionnel

    const [cursorPosition, setCursorPosition] = useState<{ row: number, col: number }>({ row: 0, col: 0 });
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    // Handle key down and key up events to manage pressedKeys state
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setPressedKeys((prevKeys) => {
                const newKeys = new Set(prevKeys);
                newKeys.add(event.key);
                return newKeys;
            });
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            setPressedKeys((prevKeys) => {
                const newKeys = new Set(prevKeys);
                newKeys.delete(event.key);
                return newKeys;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Update cursor position based on pressed keys
    useEffect(() => {
        setCursorPosition((prevPosition) => {
            let { row, col } = prevPosition;

            // Determine movement direction based on pressed keys
            const moveUp = pressedKeys.has('ArrowUp');
            const moveDown = pressedKeys.has('ArrowDown');
            const moveLeft = pressedKeys.has('ArrowLeft');
            const moveRight = pressedKeys.has('ArrowRight');

            if (moveUp && moveLeft) {
                row = Math.max(row - 1, 0);
                col = Math.max(col - 1, 0);
            } else if (moveUp && moveRight) {
                row = Math.max(row - 1, 0);
                col = Math.min(col + 1, numCols - 1);
            } else if (moveDown && moveLeft) {
                row = Math.min(row + 1, numRows - 1);
                col = Math.max(col - 1, 0);
            } else if (moveDown && moveRight) {
                row = Math.min(row + 1, numRows - 1);
                col = Math.min(col + 1, numCols - 1);
            } else {
                if (moveUp) {
                    row = Math.max(row - 1, 0);
                }
                if (moveDown) {
                    row = Math.min(row + 1, numRows - 1);
                }
                if (moveLeft) {
                    col = Math.max(col - 1, 0);
                }
                if (moveRight) {
                    col = Math.min(col + 1, numCols - 1);
                }
            }
            return { row, col };
        });
    }, [pressedKeys, numRows, numCols]);

    // Emit cursor position to server when it changes
    useEffect(() => {
        if (player) {
            const socketId = player.socketId;
            socket.emit('updateCursor', { coordinates: { row: cursorPosition.row, col: cursorPosition.col }, socketId });
        }
    }, [cursorPosition, player]);

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
