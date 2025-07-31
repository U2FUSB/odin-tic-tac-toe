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
    function isWinningMark(mark) {
        let isWinning = false;
        const winningStates = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        winningStates.forEach((winningState) => {
            const winningCount = 3;
            let currentCount = 0;
            winningState.forEach((winningStateElement) => {
                if (getBoard().at(winningStateElement) == mark) {
                    currentCount++;
                }
            });
            if (currentCount == winningCount) {
                isWinning = true;
            }
        });
        return isWinning;
    }
    return { getBoard, setCell, isWinningMark };
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
console.log(Gameboard.isWinningMark("Y"));
Gameboard.getBoard()[3] = 1;
Display.printGameboard();
