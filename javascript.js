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
        // console.clear();
        console.log(Gameboard.getBoard());
    }
    return { printGameboard };
})();

function createPlayer(name, mark) {
    let wins = 0;
    return {
        getName: function () {
            return name;
        },
        getMark: function () {
            return mark;
        },
        getWins: function () {
            return wins;
        },
        increaseWins: function () {
            wins++;
        },
    };
}

const Gameflow = (function () {
    // Let players choose names and marks
    const player1 = createPlayer("Josh", "X");
    const player2 = createPlayer("Joshephine", "Y");
    //TODO check if player2 has chosen the same symbol
    let currentPlayer = player1;
    function changeCurrentPlayer() {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        } else if (currentPlayer == player2) {
            currentPlayer = player1;
        }
    }
    function runGame() {
        do {
            Display.printGameboard();
            Gameboard.setCell(0, currentPlayer.getMark());
            changeCurrentPlayer();
            Gameboard.setCell(3, currentPlayer.getMark());
            changeCurrentPlayer();
            Gameboard.setCell(1, currentPlayer.getMark());
            Gameboard.setCell(2, currentPlayer.getMark());
            Display.printGameboard();
        } while (!Gameboard.isWinningMark(currentPlayer.getMark()));
        console.log("winner is " + currentPlayer.getName());
    }
    return { runGame };
})();

Gameflow.runGame();
