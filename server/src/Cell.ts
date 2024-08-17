import { players } from "./player";

export interface CellProps {
    isAlive: boolean;
    socketId: string | null;
    color: string;
    activeGenerations: number;
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
        if (this.socketId !== null) {
            if (!players.find(player => player.id === this.socketId)) {
                this.socketId = null
                this.setColor()
            }
        }
        if (this.isAlive && cellProps.isAlive) {
            this.activeGenerations++
            this.checkOwner(cellProps)
            this.checkActiveGenerations()
            this.setColor()
            return
        } else if (this.isAlive !== cellProps.isAlive) {
            this.toggleState(cellProps)
            this.setColor()

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
        this.isAlive = !this.isAlive;
        !this.isAlive ? this.setVirginCell() : this.assimilateCell(cellProps)
    }
    checkActiveGenerations() {
        //Si la cellule est tout juste mature, la pousser dans le tableau de cellule mature du player
        if (this.activeGenerations === this.cellAgeToGold) {
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
        this.removeCellFromPlayerCollection()
        this.addCellToPlayerCollection(cellProps)
        this.isAlive = cellProps.isAlive;
        this.socketId = cellProps.socketId;
        this.color = cellProps.color;
        this.activeGenerations = 0;
    }
    getCellResume(): CellProps {
        const cellResume: CellProps = {
            isAlive: this.isAlive,
            socketId: this.socketId,
            color: this.color,
            activeGenerations: this.activeGenerations,
        }
        return cellResume
    }
    removeCellFromPlayerCollection() {
        if (this.socketId) {
            const player = players.find(player => player.id === this.socketId);
            if (player) {
                player.controledMatureCells = player.controledMatureCells.filter(cell => cell.socketId !== this.socketId);
                player.controledCells = player.controledCells.filter(cell => cell.socketId !== this.socketId);
            } else {
                this.setVirginCell()
            }
        }
    }
    addCellToPlayerCollection(cellProps: CellProps) {
        const player = players.find(player => player.id === cellProps.socketId);
        if (player) {
            player.controledCells.push(this.getCellResume())
        }
    }
    setColor() {

        if (!this.isAlive) { this.color = white; return }

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