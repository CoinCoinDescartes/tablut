import { Game } from "./modules/games.js";

const game = new Game();
console.log(game.board);
const tok = game.board[1][4].content;
const tok2 = game.board[2][4].content;
// game.moveToken(tok, { x: 1, y: 3 });

// console.log(game.gameState);
// const pos = game.getValidPosToMove(tok);
// console.log(pos);

console.log(tok);
console.log(tok2);

game.moveToken(tok, { x: 2, y: 5 });
game.changePlayer();
game.moveToken(tok2, { x: 1, y: 5 });
console.log(game.board);
const t = game.listCapturedTokens(tok);
console.log(t);
