import { Board } from "./board.js";

export class Game {
  // static TAB_SIZE = 9;
  TAB_SIZE = 9;

  constructor() {
    this.playerTurn = "black";
    this.board = new Board();
  }

  changePlayer() {
    if (this.playerTurn === "black") {
      this.playerTurn = "white";
    } else if (this.playerTurn === "white") {
      this.playerTurn = "black";
    }
  }

  /* 
    @deprecated ?
  */
  moveToken(token, finalPos) {
    if (this.playerTurn === token.color) {
      this.board.moveToken(token, finalPos);

      // this.changePlayer();
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
      


      this.changePlayer();
    }
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
            otherToken = this.board.getWestSquare(tok.x, tok.y).content;
          } else {
            // tok is before token, we must get the EAST square of tok
            otherToken = this.board.getEastSquare(tok.x, tok.y).content;
          }
        }
        if (tok.y === token.y) {
          //same col
          if (tok.y - token.y < 0) {
            // tok is after token, we must get the SOUTH square of tok
            otherToken = this.board.getSouthSquare(tok.x, tok.y).content;
          } else {
            // tok is before token, we must get the NORTH square of tok
            otherToken = this.board.getNorthSquare(tok.x, tok.y).content;
          }
        }

        if (otherToken && otherToken.color === token.color) {
          // tok is between 2 token of the same player, it is captured;
          capturedTokens.push(tok);
        }
      }
    }
    return capturedTokens;
  }
}
