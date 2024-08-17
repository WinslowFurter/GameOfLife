"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.players = void 0;
const server_1 = require("./server");
const Utils_1 = require("./Utils");
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
        server_1.playersExpelled.push(this.id);
        const index = exports.players.findIndex(player => player.id === this.id);
        if (index !== -1) {
            exports.players.splice(index, 1);
        }
    }
    build() {
        exports.players.push(this);
    }
}
exports.Player = Player;
