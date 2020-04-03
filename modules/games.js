import { Board } from "./board.js";
import { Player } from "./player.js";

export class Game {
  constructor() {
    this.TAB_SIZE = 9;
    this.board = new Board(this.TAB_SIZE);
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

  getPlayerByName(name) {
    if (name === "black") {
      return this.blackPlayer;
    }
    return this.whitePlayer;
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
      for (let index = value + 1; index < this.TAB_SIZE; index++) {
        const element = array[index];
        if (element.content !== null || element.isThrone === "true") {
          break;
        }
        after.push(element);
      }
      return after;
    };

    const validPos = [];

    const listSameLine = this.board.getSameLine(token.x);
    const listSameCol = this.board.getSameCol(token.y);

    const beforeLine = getBeforeToken(listSameLine, token.y);
    const afterLine = getAfterToken(listSameLine, token.y);
    const beforeCol = getBeforeToken(listSameCol, token.x);
    const afterCol = getAfterToken(listSameCol, token.x);

    validPos.push(...beforeLine, ...afterLine, ...beforeCol, ...afterCol);
    return validPos;
  }

  gameMove(token, finalPos, player) {
    if (player.name === this.playerTurn) {
      this.board.moveToken(token, finalPos);
      const capturedTokens = this.listCapturedTokensFromMovedToken(token);
      capturedTokens.forEach(tok => {
        if (tok.isKing) {
          console.log("white player loose");
          this.gameState = "end";
          this.winPlayer = this.blackPlayer;
        }
        this.deleteToken(tok);
      });

      this.computerGameEnd();
      this.changePlayer();

      console.log(this);

      return this;
    }
  }

  deleteToken(tok) {
    this.board.deleteToken(tok);
    const player = this.getPlayerByName(tok.color);
    player.numberOfToken--;
  }

  endGame(winner) {
    this.gameState = "end";
    this.winPlayer = winner;
  }

  computerGameEnd() {
    const edges = this.board.getEdge();

    // King reached an edge : White Win
    const edgesWithKing = edges
      .filter(sq => sq.content !== null)
      .filter(sq => sq.content.isKing);
    if (edgesWithKing.length === 1) {
      this.endGame(this.whitePlayer);
    }

    // black doesn't have any token left: white win
    if (this.blackPlayer.numberOfToken === 0) {
      this.endGame(this.whitePlayer);
    }

    // white doesn't have any token left: black win
    if (this.whitePlayer.numberOfToken === 0) {
      this.endGame(this.blackPlayer);
    }

    // if white doesn't have any valid move: black win
    const isNoValidWhiteMove =
      this.board.whiteToken.filter(tok => {
        this.getValidPosToMove(tok).length !== 0;
      }) === 0;

    if (isNoValidWhiteMove) {
      this.endGame(this.blackPlayer);
    }
  }

  listCapturedTokensFromMovedToken(token) {
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
          if (tok.y - token.y > 0) {
            // tok is after token, we must get the WEST square of tok
            otherToken = this.board.getWestSquare(tok.x, tok.y);
          } else {
            // tok is before token, we must get the EAST square of tok
            otherToken = this.board.getEastSquare(tok.x, tok.y);
          }
        }
        if (tok.y === token.y) {
          //same col
          if (tok.x - token.x > 0) {
            // tok is after token, we must get the SOUTH square of tok
            otherToken = this.board.getSouthSquare(tok.x, tok.y);
          } else {
            // tok is before token, we must get the NORTH square of tok
            otherToken = this.board.getNorthSquare(tok.x, tok.y);
          }
        }

        if (
          otherToken &&
          ((otherToken.content && otherToken.content.color === token.color) ||
            (otherToken.isThrone && otherToken.content === null))
        ) {
          // tok is between 2 tokens of the same player or 1 token and throne it is captured;
          capturedTokens.push(tok);
        }
      }
    }
    return capturedTokens;
  }

  getTokenDataFromId(id) {
    return this.board.getTokenDataFromId(id);
  }
}
