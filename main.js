import { Game } from "./modules/games.js";

let game;
let currentDraged = null;
init();

function init() {
  game = new Game();
  console.log(game.board);
  generateViewFromGame(game);
}

function generateViewFromGame(game) {
  function generateGrid(game) {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    let index = 0;
    for (const line of game.board.board) {
      for (const col of line) {
        const newGridItem = document.createElement("div");
        newGridItem.classList.add("grid-item");
        newGridItem.setAttribute("id", index);
        // newGridItem.innerHTML = "x " + col.x + " y " + col.y;

        if (col.isThrone) {
          newGridItem.classList.add("throne");
        }

        if (col.content) {
          const content = col.content;
          const token = createTokenView(content, game.playerTurn);
          newGridItem.appendChild(token);
        }

        gridContainer.appendChild(newGridItem);
        index++;
      }
    }

    const gameZone = document.getElementById("game-zone");
    gameZone.appendChild(gridContainer);
  }
  function updateInfo(game) {
    document.getElementById(
      "player-turn"
    ).innerHTML = `It's ${game.playerTurn} player turn`;
    if (game.gameState === "end") {
      document.getElementById(
        "winner"
      ).innerHTML = `Winner ${game.winPlayer.name}`;
      document.getElementById("player-turn").innerHTML = "";
    }
  }

  updateInfo(game);
  generateGrid(game);
}

function clearContent(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createTokenView(token, playerTurn) {
  const color = token.color;
  const isKing = token.isKing;
  const id = token.id;

  const tokenView = document.createElement("div");
  // tokenView.innerHTML = id;
  tokenView.classList.add("pion");
  tokenView.classList.add(color);
  tokenView.setAttribute("id", id);
  if (isKing) {
    tokenView.classList.add("king");
  }

  if (playerTurn === color) {
    tokenView.setAttribute("draggable", "true");
    tokenView.addEventListener("dragstart", drag);
  }

  return tokenView;
}

function getTokenDataFromId(id) {
  return game.getTokenDataFromId(id);
}

function drag(ev) {
  // recuperation des données du token
  const tokenData = getTokenDataFromId(ev.target.id);

  // clear des class
  if (currentDraged !== ev.target) {
    removeValidMoveClass();

    currentDraged = ev.target;
  }

  // set des donne a tranferer durant le transfert
  ev.dataTransfer.setData("text", ev.target.id);

  //recherche des position valide
  const validPos = game.getValidPosToMove(tokenData);
  // console.log(validPos);

  // ajout des class sur les cases possible de destination
  validPos.forEach(elem => {
    const sq = getCaseFromSquare(elem);
    sq.classList.add("validMove");
    sq.addEventListener("drop", drop);
    sq.addEventListener("dragover", dragover);
    sq.addEventListener("dragleave", dragleave);
  });

  function getCaseFromSquare(square) {
    const x = square.x;
    const y = square.y;

    const listCase = document.getElementsByClassName("grid-item");

    return listCase[y + x * game.TAB_SIZE];
  }

  function getSquareFromCaseId(id_input) {
    const id = parseInt(id_input, 10);

    const x = Math.trunc(id / game.TAB_SIZE);
    const y = id % game.TAB_SIZE;

    return game.board.board[x][y];
  }

  function dragover(ev) {
    ev.preventDefault();
    ev.target.classList.add("current");
  }

  function dragleave(ev) {
    ev.preventDefault();
    ev.target.classList.remove("current");
  }

  function drop(ev) {
    ev.preventDefault();
    removeValidMoveClass();
    const tokenId = ev.dataTransfer.getData("text");
    const token = game.getTokenDataFromId(tokenId);
    const caseId = ev.target.id;
    const caseData = getSquareFromCaseId(caseId);
    const newGameState = game.gameMove(
      token,
      { x: caseData.x, y: caseData.y },
      game.getPlayerByName(game.playerTurn)
    );

    const gameZone = document.getElementById("game-zone");
    clearContent(gameZone);
    generateViewFromGame(newGameState);

    console.log(game.board.board);

    // ev.target.appendChild(document.getElementById(tokenId));
  }
  function removeValidMoveClass() {
    const elements = [
      ...document.getElementsByClassName("grid-item validMove")
    ];
    elements.forEach(elem => {
      elem.classList.remove("validMove");
      elem.classList.remove("current");
      elem.removeEventListener("drop", drop);
      elem.removeEventListener("dragover", dragover);
      elem.removeEventListener("dragleave", dragleave);
    });
  }

  /* function updateViewFromGameState(newGame) {
    game.whitePlayer = newGame.whitePlayer;
    game.blackPlayer = newGame.blackPlayer;
    game.playerTurn = newGame.playerTurn;
    game.winPlayer = newGame.winPlayer;
    game.gameState = newGame.gameState;

    generateViewFromGame(newGame);
  } */
}
