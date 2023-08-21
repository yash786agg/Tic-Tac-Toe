window.addEventListener("DOMContentLoaded", () => {
  const errorMsg = document.querySelector("#errorMsg");
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const resetButton = document.querySelector("#reset");
  const announcer = document.querySelector(".announcer");
  const boardElement = document.querySelector(".container");

  const baseUrl = "http://127.0.0.1:5000/api/v1"; // Base url of backend server
  let gameId = "";
  let gameState = { board: ["", "", "", "", "", "", "", "", ""] }; // Initialize gameState as an object
  let currentPlayer = "x";
  let isGameActive = true;

  const X_WON = "X_WON";
  const O_WON = "O_WON";
  const DRAW = "DRAW";

  function handleResultValidation(status) {
    if (["X_WON", "O_WON", "DRAW"].includes(status)) {
      announce(status);
      isGameActive = false;
      return;
    }
  }

  const announce = (type) => {
    switch (type) {
      case O_WON:
        announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
        break;
      case X_WON:
        announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
        break;
      case DRAW:
        announcer.innerText = "Tie";
    }
    announcer.classList.remove("hide");
  };

  const isValidAction = (tile) => {
    if (tile.innerText === "x" || tile.innerText === "o") {
      return false;
    }
    return true;
  };

  // Function to start a new game using POST request
  function startGame(board) {
    apiHandler
      .post(`${baseUrl}/games`, { board })
      .then((data) => {
        gameId = data.id;
        gameState = data;
        if (typeof gameState.board === "string") {
          gameState.board = gameState.board.split(""); // Convert string to array
        }
        updateBoard(gameState);
      })
      .catch((error) => {
        console.error("GET Error:", error);
        errorMsg.innerHTML = "Error Occured" + error;
      });
  }

  const updateBoard = (gameState) => {
    gameState.board.forEach((cellValue, index) => {
      const tile = boardElement.querySelector(`.tile:nth-child(${index + 1})`);
      tile.textContent = cellValue === "-" ? "" : cellValue;

      // Add a class 'player-o' to the tile if the current player is 'O'
      if (cellValue === "o") {
        tile.classList.add("playerO");
      }
    });
  };

  const userAction = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      gameState.board[index] = currentPlayer;

      if (!gameId) {
        startGame(gameState.board.join("-"));
      } else {
        makeMove(gameId, gameState.board);
      }
    }
  };

  // Function to make a move using PUT request
  function makeMove(id, board) {
    apiHandler
      .put(`${baseUrl}/games/${id}`, { board })
      .then((updatedState) => {
        gameState = updatedState;
        if (typeof gameState.board === "string") {
          gameState.board = gameState.board.split(""); // Convert string to array
        }
        updateBoard(gameState);
        handleResultValidation(updatedState.status);
      })
      .catch((error) => {
        console.error("GET Error:", error);
        errorMsg.innerHTML = "Error Occured" + error;
      });
  }

  const resetBoard = () => {
    apiHandler
      .del(`${baseUrl}/games/${gameId}`)
      .then((_) => {
        gameId = "";
        gameState = { board: ["", "", "", "", "", "", "", "", ""] };
        isGameActive = true;
        announcer.classList.add("hide");

        tiles.forEach((tile) => {
          tile.innerText = "";
          tile.classList.remove("playerX");
          tile.classList.remove("playerO");
        });
      })
      .catch((error) => {
        console.error("GET Error:", error);
        errorMsg.innerHTML = "Error Occured" + error;
      });
  };

  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => userAction(tile, index));
  });

  resetButton.addEventListener("click", resetBoard);
});
