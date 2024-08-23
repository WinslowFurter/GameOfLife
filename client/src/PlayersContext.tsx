import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Player {
    socketId: string;
    cells: number;
    golds: number;
    color: string;
    nickname: string;
    patternPool: string[]
}

interface PlayersContextType {
    players: Player[];
    setPlayers: (players: Player[]) => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

// Exporter une variable globale pour accéder à `setPlayers`
let setPlayersGlobal: ((players: Player[]) => void) | undefined;

export const PlayersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [players, setPlayers] = useState<Player[]>([]);

    // Mettre à jour la variable globale
    setPlayersGlobal = setPlayers;

    return (
        <PlayersContext.Provider value={{ players, setPlayers }}>
            {children}
        </PlayersContext.Provider>
    );
};

export const usePlayers = (): PlayersContextType => {
    const context = useContext(PlayersContext);
    if (!context) {
        throw new Error('usePlayers must be used within a PlayersProvider');
    }
    return context;
};

// Fonction d'exportation pour mettre à jour les joueurs
export const updatePlayersGlobally = (players: Player[]) => {
    if (setPlayersGlobal) {
        setPlayersGlobal(players);
    } else {
        console.error('PlayersProvider is not initialized.');
    }
};
