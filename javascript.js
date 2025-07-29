const Gameboard = (function () {
    const gameboard = [];
    for (let index = 0; index < 9; index++) {
        gameboard.push(null);
    }
    function getBoard() {
        return Array.from(gameboard);
    }
    function setCell(cell, mark) {
        if (cell >= 0 && cell <= gameboard.length - 1) {
            gameboard[cell] = mark;
        }
    }
    function isWinningState(mark) {
        const markedCells = [];

        // as much as it hurts, get rid of this "smart" logic, as you did not consider additional entries );
        let winningState = false;
        gameboard.forEach((cell, index) => {
            if (cell == mark) {
                markedCells.push(index);
            }
        });
        if (Math.sqrt(gameboard.length) == markedCells.length) {
            const initialDifference =
                markedCells[markedCells.length - 1] -
                markedCells[markedCells.length - 2];
            winningState = markedCells.reduceRight((prevCell, cell) => {
                if (prevCell - initialDifference == cell) {
                    return cell;
                } else {
                    return false;
                }
            }, markedCells[markedCells.length - 1] + initialDifference);
        }
        return winningState !== false ? true : false;
    }
    return { getBoard, setCell, isWinningState };
})();

const Display = (function () {
    function printGameboard() {
        console.log(Gameboard.getBoard());
    }
    return { printGameboard };
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

const Gameflow = (function () {
    const player1 = createPlayer("Josh");
    const player2 = createPlayer("Joshephine");
})();

Gameboard.setCell(2, "Y");
Gameboard.setCell(0, "Y");
Gameboard.setCell(1, "Y");
console.log(Gameboard.isWinningState("Y"));
Gameboard.getBoard()[3] = 1;
Display.printGameboard();
