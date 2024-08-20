import { CellProps } from "./Cell";
import { playersExpelled } from "./server";
import { colorsForPlayers, getRandomContrastingColor } from "./Utils";

export interface PlayerProps {
    socketId: string;
    cells: number;
    golds: number;
    color: string;
    nickname: string
}
interface cursorCoordinates {
    x: number;
    y: number;
}

export const players: Player[] = []

const grey = "rgba(113, 113, 113, 1)"

export class Player {
    cursorPosition: cursorCoordinates = {
        x: 1,
        y: 1
    };
    id: string;
    color: string = grey;
    controledMatureCells: CellProps[] = [];
    gold: number = 0
    nickname: string = getRandomSurname()

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
        this.checkGoldGeneration()
        const playerResume: PlayerProps = {
            socketId: this.id,
            color: this.color,
            golds: this.gold,
            cells: this.controledMatureCells.length,
            nickname: this.nickname
        }
        this.controledMatureCells.length = 0
        return playerResume
    }
    expell() {
        playersExpelled.push(this.id)
        colorsForPlayers.push(this.color)
        medievalFrenchSurnames.push(this.nickname)
        const index = players.findIndex(player => player.id === this.id);
        if (index !== -1) {
            players.splice(index, 1);
        }
    }
    build() {
        players.push(this)
    }
}
const medievalFrenchSurnames: string[] = [
    "Louis",
    "Lethullier",
    "Watelet",
    "Fournier",
    "Dupont",
    "Dufresne",
    "Lemoine",
    "Beauchamp",
    "Morel",
    "Lefèvre",
    "Garnier",
    "Durand",
    "Marchand",
    "Renard",
    "Barbier",
    "Chevalier",
    "Gaillard",
    "Aubry",
    "Boucher",
    "Caron",
    "Girard",
    "Poulain",
    "Leclerc",
    "Lefebvre",
    "Bertrand",
    "Charpentier",
    "Perrin",
    "Blanchard",
    "Lacroix",
    "Moreau",
    "Petit",
    "Gauthier",
    "Rousseau",
    "Moulin",
    "Dubois",
    "Renaud",
    "Vigneron",
    "Boivin",
    "Lefort",
    "Paquet",
    "Dufour",
    "Masson",
    "Collet",
    "Bernier",
    "Delacroix",
    "Montagne",
    "Granger",
    "Lamy",
    "Maurin",
    "Prévost",
    "Regnier",
    "Sauvage",
    "Toussaint",
    "Vasseur",
    "Chauvin",
    "Noël",
    "Desmarais",
    "Dubreuil",
    "Besson",
    "Bouvier",
    "Guerin",
    "Mallet",
    "Valois",
    "Perron",
    "Lambert",
    "Olivier",
    "Brunet",
    "Royer",
    "Fabre",
    "Briand",
    "Lemoine",
    "Michaud",
    "Gros",
    "Guillet",
    "Jacquet",
    "Bernard",
    "Cousin",
    "Blondel",
    "Chapelain",
    "Baudry",
    "Faucheux",
    "Groulx",
    "Hamelin",
    "Mallet",
    "Pichon",
    "Rivière",
    "Tailleur"
];
function getRandomSurname(): string {

    const randomIndex = Math.floor(Math.random() * medievalFrenchSurnames.length);
    const res = medievalFrenchSurnames[randomIndex]
    medievalFrenchSurnames.splice(randomIndex, 1);
    return medievalFrenchSurnames[randomIndex];
}
