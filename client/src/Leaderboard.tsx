import React, { useState, useImperativeHandle, forwardRef, CSSProperties } from 'react';

// Définition du type Player
export interface Player {
    id: string;
    cells: number;
    golds: number;
    color: string;
    nickname: string
}

// Composant Leaderboard
const Leaderboard = forwardRef<{ update: (newPlayers: Player[]) => void }, {}>(
    (_, ref) => {
        const [players, setPlayers] = useState<Player[]>([]);

        // Fonction update exposée via ref
        useImperativeHandle(ref, () => ({
            update(newPlayers: Player[]) {
                setPlayers(newPlayers);
            }
        }));

        // Tri des joueurs par nombre de golds décroissant
        const sortedPlayers = players.sort((a, b) => b.golds - a.golds);

        const leaderboardStyle: CSSProperties = {
            width: '12.5%',
            height: '800px',
            border: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
        }

        return (
            <div style={leaderboardStyle}>
                <ul>
                    {sortedPlayers.map((player) => (
                        <li key={player.id}>
                            <span style={{ color: player.color, fontWeight: 'bolder' }}>{player.nickname}</span> -
                            <span> Cells: {player.cells}</span> -
                            <span> Golds: {player.golds}</span>
                        </li>
                    ))}
                </ul>
                <div></div>
            </div>
        );
    }
);

export default Leaderboard;
