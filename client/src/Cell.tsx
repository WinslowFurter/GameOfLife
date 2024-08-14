import React from 'react';

interface CellProps {
    isAlive: boolean;
    activeGenerations: number;
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ isAlive, activeGenerations, onClick }) => {
    const checkColor = (): string => {
        if (!isAlive) {
            return 'white';
        } else if (activeGenerations > 50) {
            return 'red';
        } else {
            console.log(activeGenerations)
            return 'black';
        }
    };

    const cellStyle = {
        width: '10px',
        height: '10px',
        backgroundColor: checkColor(),
        border: '1px solid #ddd',
        display: 'inline-block',
        transition: 'background-color 0.3s ease'
    };

    return <div style={cellStyle} onClick={onClick}></div>;
};

export default Cell;
