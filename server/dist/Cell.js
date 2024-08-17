"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const player_1 = require("./player");
const white = "rgba(255, 255, 255, 1)";
const black = "rgba(0, 0, 0, 1)";
class Cell {
    constructor() {
        this.isAlive = false;
        this.socketId = null;
        this.color = white;
        this.activeGenerations = 0;
        this.cellAgeToGold = 50;
    }
    checkState(cellProps) {
        if (!this.isAlive && (this.isAlive === cellProps.isAlive)) {
            return;
        }
        else if (this.isAlive !== cellProps.isAlive) {
            this.toggleState(cellProps);
            return;
        }
        else if (this.isAlive && cellProps.isAlive) {
            this.activeGenerations++;
            this.checkActiveGenerations();
        }
    }
    // Example method to toggle cell state
    toggleState(cellProps) {
        this.isAlive = !this.isAlive;
        !this.isAlive ? this.setVirginCell() : this.assimilateCell(cellProps);
    }
    checkActiveGenerations() {
        //Si la cellule est tout juste mature, la pousser dans le tableau de cellule mature du player
        if (this.activeGenerations === this.cellAgeToGold) {
            const player = player_1.players.find(player => player.id === this.socketId);
            if (player) {
                player.controledMatureCells.push(this.getCellResume());
            }
        }
    }
    setVirginCell() {
        this.activeGenerations = 0;
        this.socketId = null;
        this.color = white;
        this.isAlive = false;
    }
    assimilateCell(cellProps) {
        this.removeCellFromPlayerCollection();
        this.addCellToPlayerCollection(cellProps);
        this.isAlive = true;
        this.socketId = cellProps.socketId;
        this.color = cellProps.color;
        this.activeGenerations = 0;
    }
    getCellResume() {
        const cellResume = {
            isAlive: this.isAlive,
            socketId: this.socketId,
            color: this.color,
            activeGenerations: this.activeGenerations,
        };
        return cellResume;
    }
    removeCellFromPlayerCollection() {
        const player = player_1.players.find(player => player.id === this.socketId);
        if (player) {
            player.controledMatureCells = player.controledMatureCells.filter(cell => cell.socketId !== this.socketId);
            player.controledCells = player.controledCells.filter(cell => cell.socketId !== this.socketId);
        }
        else {
            this.setVirginCell();
        }
    }
    addCellToPlayerCollection(cellProps) {
        const player = player_1.players.find(player => player.id === cellProps.socketId);
        if (player) {
            player.controledCells.push(this.getCellResume());
        }
    }
    setColor() {
        if (!this.isAlive) {
            this.color = white;
            return;
        }
        if (this.isAlive && (this.socketId === null)) {
            this.color = black;
            return;
        }
        else if (this.isAlive && this.socketId) {
            const player = player_1.players.find(player => player.id === this.socketId);
            if (player) {
                this.color = player.color;
                return;
            }
            else {
                this.color = black;
                return;
            }
        }
    }
}
exports.Cell = Cell;
