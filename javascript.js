const Gameboard = (function () {
    const gameboard = [];
    let choosableCells;
    populateBoard();
    populateChoosableCells();

    function populateBoard() {
        for (let index = 0; index < 9; index++) {
            gameboard.push(undefined);
        }
    }
    function populateChoosableCells() {
        choosableCells = getBoard().map((cell, index) => index.toString());
    }
    function getBoard() {
        return Array.from(gameboard);
    }
    function resetBoard() {
        gameboard.splice(0, getBoard().length);
        populateBoard();
        populateChoosableCells();
    }
    function getChoosableCells() {
        return Array.from(choosableCells);
    }
    function removeChoosableCell(chosenCell) {
        choosableCells.splice(
            choosableCells.findIndex((cell) => cell == chosenCell),
            1
        );
    }
    function setCell(cell, mark) {
        if (
            cell >= 0 &&
            cell <= gameboard.length - 1 &&
            typeof gameboard[cell] == "undefined"
        ) {
            gameboard[cell] = mark;
            removeChoosableCell(cell);
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
    return {
        getBoard,
        resetBoard,
        setCell,
        isWinningMark,
        getChoosableCells,
    };
})();

const Display = (function () {
    const startGameButton = document.querySelector("button.start-game");
    const player1NameButton = document.querySelector("#player1-name");
    const player1MarkButton = document.querySelector("#player1-mark");
    const player2NameButton = document.querySelector("#player2-name");
    const player2MarkButton = document.querySelector("#player2-mark");
    const gameGrid = document.querySelector(".game-grid");

    Array.from(gameGrid.children).forEach((element, index) => {
        element.dataset.cell = index;
    });

    function prepareEventListeners(params) {
        startGameButton.addEventListener("click", Gameflow.prepareGame);
        gameGrid.addEventListener("click", Gameflow.playRound);
    }

    function printGameboard() {
        console.clear();
        console.log(Gameboard.getBoard().slice(0, 3));
        console.log(Gameboard.getBoard().slice(3, 6));
        console.log(Gameboard.getBoard().slice(6, 9));
        console.log("");
    }
    function getCellFromEvent(event) {
        return event.target.dataset.cell;
    }
    function printMessage(message) {
        console.log(message);
    }
    return {
        printGameboard,
        getCellFromEvent,
        printMessage,
        prepareEventListeners,
    };
})();

const Gameflow = (function () {
    let player1, player2;
    let currentPlayer, notCurrentPlayer;
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
    function changeCurrentPlayer() {
        let buffer = currentPlayer;
        currentPlayer = notCurrentPlayer;
        notCurrentPlayer = buffer;
    }
    function preparePlayers() {
        let isMarkEqual;
        do {
            player1 = createPlayer(
                // Display.getInput("player1 Name"),
                // Display.getInput("player1 Mark")
                "Josh",
                "X"
            );
            player2 = createPlayer(
                // Display.getInput("player2 Name"),
                // Display.getInput("player2 Mark")
                "Janniece",
                "Y"
            );
            if (player1.getMark() === player2.getMark()) {
                isMarkEqual = true;
                Display.printMessage("Marks are equal. Choose different ones");
            } else {
                isMarkEqual = false;
            }
        } while (isMarkEqual);
    }
    function prepareGame() {
        currentPlayer = player1;
        notCurrentPlayer = player2;
        Gameboard.resetBoard();
        Display.printMessage(`${currentPlayer.getName()}, make your choice`);
    }
    function playRound(event) {
        const chosenCell = Display.getCellFromEvent(event);
        let gamestate;

        const cellIsNotIncluded =
            !Gameboard.getChoosableCells().includes(chosenCell);
        if (cellIsNotIncluded) {
            Display.printMessage(
                `Cell ${chosenCell} cannot be chosen. Please choose a different one.`
            );
        } else {
            Gameboard.setCell(chosenCell, currentPlayer.getMark());
            gamestate = getGameState();
            changeCurrentPlayer();
            if (gamestate[1] === 0) {
                Display.printGameboard();
                Display.printMessage(
                    `${currentPlayer.getName()}, it's you turn now. Make your choice`
                );
                Display.printMessage(`${endState}`); //for some weird reason this does not display. If run before the prior Display.printMessage, that one does not display either.
            }
            if (gamestate[1] === 1) {
                notCurrentPlayer.increaseWins();
                Display.printGameboard();
                Display.printMessage(
                    `${notCurrentPlayer.getName()} wins this round`
                );
            }
        }

        // to test for winning scenario
        // Gameboard.setCell(0, player1.getMark());
        // Gameboard.setCell(1, player1.getMark());
        // Gameboard.setCell(2, player1.getMark());

        // To test for stalemate scenario
        // Gameboard.setCell(0, player1.getMark());
        // Gameboard.setCell(1, player1.getMark());
        // Gameboard.setCell(5, player1.getMark());
        // Gameboard.setCell(6, player1.getMark());
        // Gameboard.setCell(2, player2.getMark());
        // Gameboard.setCell(3, player2.getMark());
        // Gameboard.setCell(4, player2.getMark());
        // Gameboard.setCell(7, player2.getMark());
        // Gameboard.setCell(8, player2.getMark());
    }
    function getGameState() {
        let endState = [false, 0];
        if (Gameboard.isWinningMark(notCurrentPlayer.getMark())) {
            endState = [true, 1];
        } else if (!Gameboard.getBoard().some((cell) => cell == undefined)) {
            endState = [true, 2];
        }
        return endState;
    }
    return { preparePlayers, playRound, prepareGame };
})();
Gameflow.preparePlayers();
Display.prepareEventListeners();
