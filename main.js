import { Game } from "./modules/games.js";
import { Utils } from "./modules/utils.js";
import { OriginalRenderer } from "./modules/renderers/originalRenderer.js";
// import { MobileRenderer } from "./modules/renderers/mobileRenderer.js";
import { Player } from "./modules/player.js";
import { RandomIA } from "./modules/ia/randomIA.js";

let game;
init();

function init() {
  let whitePlayer = null;
  let blackPlayer = null;
  let ia = null;

  const rand = Utils.getRandomIntInclusive(1, 2);
  if (rand === 1) {
    whitePlayer = new Player("white");
    blackPlayer = new RandomIA("black");
    ia = blackPlayer;
  } else {
    blackPlayer = new Player("black");
    whitePlayer = new RandomIA("white");
    ia = whitePlayer;
  }
  game = new Game(whitePlayer, blackPlayer);
  ia.setGame(game);

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
  game.observer.push(ia);
  renderer.generateView(game);
  if (game.playerTurn === ia.name) {
    ia.play();
  }
}
