import React from 'react';

export interface CellProps {
    isAlive: boolean;
    activeGenerations: number;
    color: string;
    socketId: string | null; // Add socketId to track the user
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ activeGenerations, color, onClick }) => {

    const cellStyle = {
        width: '10px',
        height: '10px',
        backgroundColor: color,
        border: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    if (activeGenerations < 50) {
        return <div style={cellStyle} onClick={onClick}></div>;
    } else {
        const matureStyle = {
            width: '5px',
            height: '5px',
            backgroundColor: 'rgba(255,255,255,1)',
        };

        return <div style={cellStyle} onClick={onClick}><div style={matureStyle}></div></div>;
    }
};

export default Cell;
