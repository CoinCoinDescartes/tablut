import { Game } from "./modules/games.js";

const game = new Game();
console.log(game.board);
const tok = game.board[1][4].content;
// game.moveToken(tok, { x: 1, y: 3 });

// console.log(game.gameState);
const pos = game.getValidPosToMove(tok);
// console.log(pos);

const t = game.captureToken(tok);
console.log(t);

