import React from 'react';

export interface CellProps {
    isAlive: boolean;
    activeGenerations: number;
    color: string;
    socketId: string | null; // Add socketId to track the user
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ color, onClick }) => {


    const cellStyle = {
        width: '10px',
        height: '10px',
        backgroundColor: color,
        border: '1px solid #ddd',
        display: 'inline-block',
        transition: 'background-color 0.3s ease'
    };

    return <div style={cellStyle} onClick={onClick}></div>;
};

export default Cell;
