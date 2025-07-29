const Gameboard = (function () {
    const gameboard = [];
    for (let index = 0; index < 9; index++) {
        gameboard.push(null);
    }
    function getGameboard() {
        return gameboard;
    }
    function setCell(cell, mark) {
        if (cell >= 0 && cell <= gameboard.length - 1) {
            gameboard[cell] = mark;
        }
    }
    return { getGameboard, setCell };
})();

const Display = (function () {
    function printToConsole() {
        console.log(Gameboard.getGameboard());
    }
    return { printToConsole };
})();

function createPlayer(name) {
    let wins = 0;
    return {
        name,
        getWins: function () {
            return wins;
        },
        increaseWins: function () {
            wins++;
        },
    };
}
const player1 = createPlayer("Josh");
const player2 = createPlayer("Joshephine");

Gameboard.setCell(8, "X");
Gameboard.setCell(-1, "X");
Gameboard.setCell(5, "0");
Display.printToConsole();
