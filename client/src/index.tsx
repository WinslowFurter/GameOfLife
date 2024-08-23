import React from 'react';
import GameGrid, { numCols, numRows } from './GameGrid';
import ReactDOM from 'react-dom/client';
import Leaderboard from './Leaderboard';
import CursorGrid from './CursorGrid';
import { PlayersProvider } from './PlayersContext';

const App: React.FC = () => {
    return (
        <div>
            <GameGrid />
        </div>
    );
};

export default App;

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <PlayersProvider>
            <App />
        </PlayersProvider>
    );
}