import { Game } from "./modules/games.js";
import { Utils } from "./modules/Utils.js";
import { OriginalRenderer } from "./modules/renderers/originalRenderer.js";
import { MobileRenderer } from "./modules/renderers/mobileRenderer.js";
import { Player } from "./modules/player.js";
import { RandomIA } from "./modules/ia/randomIA.js";

let game;
init();

function init() {
  let firstPlayer = null;
  let secondPlayer = null;

  const rand = Utils.getRandomIntInclusive(1, 2);
  if (rand === 1) {
    firstPlayer = new Player("white");
    secondPlayer = new RandomIA("black");
  } else {
    firstPlayer = new Player("black");
    secondPlayer = new RandomIA("white");
  }
  game = new Game(firstPlayer, secondPlayer);
  secondPlayer.setGame(game);
  const gameZoneElement = document.getElementById("game-zone");
  const playerTurnElement = document.getElementById("player-turn");
  const winnerElement = document.getElementById("winner");
  const bip = document.getElementById("sound-bip");
  const boup = document.getElementById("sound-boup");
  const renderer = new OriginalRenderer(
    gameZoneElement,
    playerTurnElement,
    winnerElement,
    bip,
    boup
  );
  game.observer.push(renderer);
  game.observer.push(secondPlayer);
  if(game.playerTurn === secondPlayer.name) {
    secondPlayer.play();
  }
  renderer.generateView(game);
}
