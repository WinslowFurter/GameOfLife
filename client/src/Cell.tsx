import React from 'react';

interface CellProps {
    isAlive: boolean;
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ isAlive, onClick }) => {
    const cellStyle = {
        width: '10px',
        height: '10px',
        backgroundColor: isAlive ? 'black' : 'white',
        border: '1px solid #ddd',
        display: 'inline-block'
    };

    return <div style={cellStyle} onClick={onClick}></div>;
};

export default Cell;
