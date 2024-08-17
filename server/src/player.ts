import { CellProps } from "./Cell";
import { playersExpelled } from "./server";
import { getRandomContrastingColor } from "./Utils";

export interface PlayerProps {
    socketId: string;
    color: string;
    gold: number;
}

export const players: Player[] = []

const grey = "rgba(113, 113, 113, 1)"

export class Player {
    id: string;
    color: string = grey;
    controledMatureCells: CellProps[] = [];
    controledCells: CellProps[] = [];
    gold: number = 0

    constructor(id: string) {
        this.id = id
        this.color = getRandomContrastingColor()
        this.build()
    }

    checkGoldGeneration() {
        if (this.controledMatureCells.length > 0) {
            this.gold = this.gold + this.controledMatureCells.length
        }
    }

    getPlayerResume(): PlayerProps {
        const playerResume: PlayerProps = {
            socketId: this.id,
            color: this.color,
            gold: this.gold,
        }
        return playerResume
    }
    expell() {
        playersExpelled.push(this.id)
        const index = players.findIndex(player => player.id === this.id);
        if (index !== -1) {
            players.splice(index, 1);
        }
    }
    build() {
        players.push(this)
    }
}