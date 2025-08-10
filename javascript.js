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
    const body = document.querySelector("body");
    const prepareGameSection = document.querySelector("section.prepare-game");
    const playGameSection = document.querySelector("section.play-game");
    const endGameSection = document.querySelector("section.end-game");
    const playerForm = document.querySelector("form.player-form");
    const player1NameInput = document.querySelector("#player1-name");
    const player1MarkInput = document.querySelector("#player1-mark");
    const player2NameInput = document.querySelector("#player2-name");
    const player2MarkInput = document.querySelector("#player2-mark");
    const startGameButton = document.querySelector("button.start-game");
    const gameGrid = document.querySelector(".game-grid");

    Array.from(gameGrid.children).forEach((element, index) => {
        element.dataset.cell = index;
    });

    // So I don't have to set the players every time
    player1NameInput.value = "Josh";
    player1MarkInput.value = "X";
    player2NameInput.value = "Jannice";
    player2MarkInput.value = "Y";

    const setPage = (function () {
        return {
            prepareGame: function () {
                body.innerHTML = "";
                body.appendChild(prepareGameSection);
            },
            playGame: function () {
                body.innerHTML = "";
                body.appendChild(playGameSection);
            },
            endGame: function () {
                body.innerHTML = "";
                body.appendChild(endGameSection);
            },
        };
    })();

    function prepareEventListeners() {
        playerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            Gameflow.preparePlayers(
                player1NameInput.value,
                player1MarkInput.value,
                player2NameInput.value,
                player2MarkInput.value
            );
        });
        gameGrid.addEventListener("click", Gameflow.playRound);
        startGameButton.addEventListener("click", Gameflow.prepareGame);
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
        setPage,
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
    function preparePlayers(
        player1Name,
        player1Mark,
        player2Name,
        player2Mark
    ) {
        if (
            player1Name === "" ||
            player1Mark === "" ||
            player2Name === "" ||
            player2Mark === ""
        ) {
            Display.printMessage(
                "Can't let names or marks empty. Please choose something."
            );
        } else if (player1Name === player2Name || player1Mark === player2Mark) {
            Display.printMessage(
                "Can't choose the same name or mark. Please set different ones."
            );
        } else {
            player1 = createPlayer(player1Name, player1Mark);
            player2 = createPlayer(player2Name, player2Mark);
            Display.printMessage(
                `Players "${player1.getName()}" and "${player2.getName()}" are created`
            );
            prepareGame();
        }
    }
    function prepareGame() {
        currentPlayer = player1;
        notCurrentPlayer = player2;
        Gameboard.resetBoard();
        Display.setPage.playGame();
        Display.printMessage(`${currentPlayer.getName()}, make your choice`);
    }
    function playRound(event) {
        const chosenCell = Display.getCellFromEvent(event);
        const cellIsNotIncluded =
            !Gameboard.getChoosableCells().includes(chosenCell);
        if (cellIsNotIncluded) {
            Display.printMessage(
                `Cell ${chosenCell} cannot be chosen. Please choose a different one.`
            );
        } else {
            Gameboard.setCell(chosenCell, currentPlayer.getMark());
            const gamestate = getGameState();
            changeCurrentPlayer();
            if (gamestate[1] === 0) {
                Display.printGameboard();
                Display.printMessage(
                    `${currentPlayer.getName()}, it's your turn now. Make your choice`
                );
            }
            if (gamestate[1] === 1) {
                notCurrentPlayer.increaseWins();
                Display.printGameboard();
                Display.printMessage(
                    `${notCurrentPlayer.getName()} wins this round`
                );
                Display.printMessage(
                    `${player1.getName()}: ${player1.getWins()} Points`
                );
                Display.printMessage(
                    `${player2.getName()}: ${player2.getWins()} Points`
                );
                Display.setPage.endGame();
            }
            if (gamestate[1] === 2) {
                Display.printGameboard();
                Display.printMessage("This round is a stalemate");
                Display.printMessage(
                    `${player1.getName()}: ${player1.getWins()} Points`
                );
                Display.printMessage(
                    `${player2.getName()}: ${player2.getWins()} Points`
                );
                Display.setPage.endGame();
            }
        }
    }
    function getGameState() {
        let endState = [false, 0];
        if (Gameboard.isWinningMark(currentPlayer.getMark())) {
            endState = [true, 1];
        } else if (!Gameboard.getBoard().some((cell) => cell == undefined)) {
            endState = [true, 2];
        }
        return endState;
    }
    return { preparePlayers, playRound, prepareGame };
})();
Display.prepareEventListeners();
Display.setPage.prepareGame();
