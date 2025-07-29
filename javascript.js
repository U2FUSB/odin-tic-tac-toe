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

Gameboard.setCell(8, "X");
Gameboard.setCell(-1, "X");
Gameboard.setCell(5, "0");
console.log(Gameboard.getGameboard());
