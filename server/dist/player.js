"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.players = void 0;
const Utils_1 = require("./Utils");
const server_1 = require("./server");
exports.players = [];
const grey = "rgba(113, 113, 113, 1)";
class Player {
    constructor(id) {
        this.color = grey;
        this.controledMatureCells = [];
        this.controledCells = [];
        this.gold = 0;
        this.id = id;
        this.color = (0, Utils_1.getRandomContrastingColor)();
        this.build();
    }
    checkGoldGeneration() {
        if (this.controledMatureCells.length > 0) {
            this.gold = this.gold + this.controledMatureCells.length;
        }
    }
    getPlayerResume() {
        const playerResume = {
            socketId: this.id,
            color: this.color,
            gold: this.gold,
        };
        return playerResume;
    }
    expell() {
        const playerCells = server_1.cells.filter(cell => cell.socketId === this.id);
        playerCells.map(cell => {
            cell.socketId = null;
            cell.setColor();
        });
    }
    build() {
        exports.players.push(this);
    }
}
exports.Player = Player;
