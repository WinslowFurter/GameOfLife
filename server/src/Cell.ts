import { players } from "./player";

export interface CellProps {
    isAlive: boolean;
    socketId: string | null;
    color: string;
    activeGenerations: number;
    id: string
}

const white = "rgba(255, 255, 255, 1)"
const black = "rgba(0, 0, 0, 1)"

export class Cell {
    isAlive: boolean = false;
    socketId: string | null = null;
    color: string = white;
    activeGenerations: number = 0;
    cellAgeToGold: number = 50;
    id: string

    constructor(id: string) {
        this.id = id
    }

    checkState(cellProps: CellProps) {
        this.activeGenerations = cellProps.activeGenerations
        if ((this.isAlive === true && cellProps.isAlive === false) || (this.isAlive === false && cellProps.isAlive === true)) {
            this.toggleState(cellProps)
            this.setColor()
            return
        }
        if (this.isAlive && cellProps.isAlive === true) {
            this.activeGenerations++
            this.checkOwner(cellProps)
            this.checkActiveGenerations()
            return
        } else if (this.isAlive && cellProps.isAlive) {
            this.setColor()
            return
        }
    }
    checkOwner(cellProps: CellProps) {
        if (cellProps.socketId === this.socketId) {
            return
        } else {
            this.assimilateCell(cellProps)
        }
    }
    toggleState(cellProps: CellProps) {
        this.isAlive ? this.isAlive = false : this.isAlive = true;
        this.isAlive ? this.assimilateCell(cellProps) : this.setVirginCell()
    }
    checkActiveGenerations() {
        //Si la cellule est tout juste mature, la pousser dans le tableau de cellule mature du player
        if (this.activeGenerations >= this.cellAgeToGold) {
            const player = players.find(player => player.id === this.socketId);
            if (player) {
                player.controledMatureCells.push(this.getCellResume())
            }
        }
    }
    setVirginCell() {
        this.activeGenerations = 0;
        this.socketId = null;
        this.color = white;
        this.isAlive = false;
    }
    assimilateCell(cellProps: CellProps) {
        this.activeGenerations = 0;
        this.isAlive = cellProps.isAlive;
        this.socketId = cellProps.socketId;
        this.color = cellProps.color;
    }
    getCellResume(): CellProps {
        const cellResume: CellProps = {
            isAlive: this.isAlive,
            socketId: this.socketId,
            color: this.color,
            activeGenerations: this.activeGenerations,
            id: this.id
        }
        return cellResume
    }

    setColor() {

        if (!this.isAlive) {
            this.color = white; return
        }

        if (this.isAlive && (this.socketId === null)) { this.color = black; return }

        else if (this.isAlive && this.socketId) {
            const player = players.find(player => player.id === this.socketId);
            if (player) { this.color = player.color; return }
            else { this.color = black; return }
        }
    }
    clone(): Cell {
        const newCell = new Cell(this.id);
        newCell.isAlive = this.isAlive;
        newCell.socketId = this.socketId;
        newCell.color = this.color;
        newCell.activeGenerations = this.activeGenerations;
        newCell.cellAgeToGold = this.cellAgeToGold;
        return newCell;
    }
}