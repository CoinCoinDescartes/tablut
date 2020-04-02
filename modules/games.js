import { Board } from "./board.js";
import { Player } from "./player.js";

export class Game {
  TAB_SIZE = 9;

  constructor() {
    this.board = new Board(TAB_SIZE);
    this.whitePlayer = new Player("white", this.board.whiteToken.length);
    this.blackPlayer = new Player("black", this.board.blackToken.length);
    this.playerTurn = "black";
    this.winPlayer = null;
    this.gameState = "running";
  }

  changePlayer() {
    if (this.playerTurn === "black") {
      this.playerTurn = "white";
    } else if (this.playerTurn === "white") {
      this.playerTurn = "black";
    }
  }

  getValidPosToMove(token) {
    const getBeforeToken = (array, value) => {
      let before = [];
      for (let index = value - 1; index >= 0; index--) {
        const element = array[index];
        if (element.content !== null || element.isThrone === "true") {
          break;
        }
        before.push(element);
      }
      return before;
    };

    const getAfterToken = (array, value) => {
      let after = [];
      for (let index = value + 1; index < TAB_SIZE; index++) {
        const element = array[index];
        if (element.content !== null || element.isThrone === "true") {
          break;
        }
        after.push(element);
      }
      return after;
    };

    const validPos = [];

    const listSameLine = this.getSameLine(token.x);
    const listSameCol = this.getSameCol(token.y);

    const beforeLine = getBeforeToken(listSameLine, token.y);
    const afterLine = getAfterToken(listSameLine, token.y);
    const beforeCol = getBeforeToken(listSameCol, token.x);
    const afterCol = getAfterToken(listSameCol, token.x);

    validPos.push(...beforeLine, ...afterLine, ...beforeCol, ...afterCol);
    return validPos;
  }

  gameMove(token, finalPos, player) {
    if (player === this.playerTurn) {
      this.moveToken(token, finalPos);
      const capturedToken = this.listCapturedTokens(token);
      capturedToken.forEach(tok => {
        if (tok.isKing) {
          console.log("white player loose");
          this.gameState = "end";
          this.winPlayer = this.blackPlayer;
        }
        this.board.deleteToken(tok);
      });

      this.computeGameEnd();

      this.changePlayer();
    }
  }

  computerGameEnd() {
    const edges = this.board.getEdge();

    // King reached an edge : White Win
    const edgesWithKing = edges
      .filter(sq => sq.content !== null)
      .filter(sq => sq.content.isKing);
    if (edgesWithKing.length === 1) {
      this.gameState = "end";
      this.winPlayer = this.whitePlayer;
    }

    // black doesn't have any token left: white win
    if (this.blackPlayer.numberOfToken === 0) {
      this.gameState = "end";
      this.winPlayer = this.whitePlayer;
    }

    // white doesn't have any token left: black win
    if (this.whitePlayer.numberOfToken === 0) {
      this.gameState = "end";
      this.winPlayer = this.blackPlayer;
    }

    // if white doesn't have any valid move: black win
    // filter tout ceux avec des position de deplacement valide
    this.board.whiteToken.forEach(tok => {
      this.getValidPosToMove(tok).length === 0
    });
  }

  listCapturedTokens(token) {
    const capturedTokens = [];
    const aroundSquares = this.board.getSquareAround(token);
    console.log(aroundSquares);

    for (const aroundSquare in aroundSquares) {
      const tok = aroundSquares[aroundSquare].content;
      console.log(tok);

      if (tok) {
        let otherToken;
        if (tok.x === token.x) {
          // same line
          if (tok.x - token.x < 0) {
            // tok is after token, we must get the WEST square of tok
            otherToken = this.board.getWestSquare(tok.x, tok.y);
          } else {
            // tok is before token, we must get the EAST square of tok
            otherToken = this.board.getEastSquare(tok.x, tok.y);
          }
        }
        if (tok.y === token.y) {
          //same col
          if (tok.y - token.y < 0) {
            // tok is after token, we must get the SOUTH square of tok
            otherToken = this.board.getSouthSquare(tok.x, tok.y);
          } else {
            // tok is before token, we must get the NORTH square of tok
            otherToken = this.board.getNorthSquare(tok.x, tok.y);
          }
        }

        if (
          otherToken &&
          (otherToken.content.color === token.color || otherToken.isThrone)
        ) {
          // tok is between 2 tokens of the same player or 1 token and throne it is captured;
          capturedTokens.push(tok);
        }
      }
    }
    return capturedTokens;
  }
}
