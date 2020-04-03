import { Game } from "./modules/games.js";
import { OriginalRenderer } from "./modules/originalRenderer.js";

let game;
init();

function init() {
  game = new Game();
  const gameZoneElement = document.getElementById("game-zone");
  const playerTurnElement = document.getElementById("player-turn");
  const winnerElement = document.getElementById("winner");
  const renderer = new OriginalRenderer(
    gameZoneElement,
    playerTurnElement,
    winnerElement
  );
  renderer.generateView(game);
}
