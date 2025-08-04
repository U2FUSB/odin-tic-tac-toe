const Gameboard = (function () {
    const gameboard = [];
    for (let index = 0; index < 9; index++) {
        gameboard.push(undefined);
    }
    function getBoard() {
        return Array.from(gameboard);
    }
    function setCell(cell, mark) {
        if (
            cell >= 0 &&
            cell <= gameboard.length - 1 &&
            typeof gameboard[cell] == "undefined"
        ) {
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
        console.clear();
        console.log(Gameboard.getBoard().slice(0, 3));
        console.log(Gameboard.getBoard().slice(3, 6));
        console.log(Gameboard.getBoard().slice(6, 9));
        console.log("");
    }
    function getInput(text) {
        return prompt(text);
    }
    function printMessage(message) {
        console.log(message);
    }
    return { printGameboard, getInput, printMessage };
})();

const Gameflow = (function () {
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
    let player1, player2, isMarkEqual;
    let currentPlayer, notCurrentPlayer;
    function changeCurrentPlayer() {
        let buffer = currentPlayer;
        currentPlayer = notCurrentPlayer;
        notCurrentPlayer = buffer;
    }
    function prepareGame() {
        do {
            player1 = createPlayer(
                Display.getInput("player1 Name"),
                Display.getInput("player1 Mark")
                // "Josh",
                // "X"
            );
            player2 = createPlayer(
                Display.getInput("player2 Name"),
                Display.getInput("player2 Mark")
                // "Janniece",
                // "Y"
            );
            currentPlayer = player1;
            notCurrentPlayer = player2;
            if (player1.getMark() === player2.getMark()) {
                isMarkEqual = true;
                Display.printMessage("Marks are equal. Choose different ones");
            } else {
                isMarkEqual = false;
            }
        } while (isMarkEqual);
    }
    function runGame() {
        while (!Gameboard.isWinningMark(notCurrentPlayer.getMark())) {
            Display.printGameboard();
            // Gameboard.setCell(0, player1.getMark());
            // Gameboard.setCell(1, player1.getMark());
            // Gameboard.setCell(2, player1.getMark());
            // changeCurrentPlayer();
            // Gameboard.setCell(2, player1.getMark());
            // changeCurrentPlayer();
            Gameboard.setCell(
                Display.getInput("Choose number of Cell to set Mark to"),
                currentPlayer.getMark()
            );
            changeCurrentPlayer();
        }
        Display.printGameboard();
        Display.printMessage("winner is " + notCurrentPlayer.getName());
    }
    return { runGame, prepareGame };
})();
Gameflow.prepareGame();
// Gameflow.runGame();
