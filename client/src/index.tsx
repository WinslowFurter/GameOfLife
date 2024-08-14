import React from 'react';
import Grid from './Grid';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
    return (
        <Grid />
    );
};

export default App;

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}