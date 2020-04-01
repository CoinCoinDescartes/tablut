import { Square } from "./square.js";
import { Token } from "./token.js";

export class Game {
  // static TAB_SIZE = 9;
  TAB_SIZE = 9;

  constructor() {
    const initTokenPos = () => {
      const tokenArr = [];
      tokenArr.push(new Token("black", 0, 3, "black0"));
      tokenArr.push(new Token("black", 0, 4, "black1"));
      tokenArr.push(new Token("black", 0, 5, "black2"));
      tokenArr.push(new Token("black", 1, 4, "black3"));
      tokenArr.push(new Token("black", 3, 0, "black4"));
      tokenArr.push(new Token("black", 3, 8, "black5"));
      tokenArr.push(new Token("black", 4, 0, "black6"));
      tokenArr.push(new Token("black", 4, 1, "black7"));
      tokenArr.push(new Token("black", 4, 7, "black8"));
      tokenArr.push(new Token("black", 4, 8, "black9"));
      tokenArr.push(new Token("black", 5, 0, "black10"));
      tokenArr.push(new Token("black", 5, 8, "black11"));
      tokenArr.push(new Token("black", 7, 4, "black12"));
      tokenArr.push(new Token("black", 8, 3, "black13"));
      tokenArr.push(new Token("black", 8, 4, "black14"));
      tokenArr.push(new Token("black", 8, 5, "black15"));

      tokenArr.push(new Token("white", 2, 4, "white0"));
      tokenArr.push(new Token("white", 3, 4, "white1"));
      tokenArr.push(new Token("white", 4, 2, "white2"));
      tokenArr.push(new Token("white", 4, 3, "white3"));
      tokenArr.push(new Token("white", 4, 4, "white4", true));
      tokenArr.push(new Token("white", 4, 5, "white5"));
      tokenArr.push(new Token("white", 4, 6, "white6"));
      tokenArr.push(new Token("white", 5, 4, "white7"));
      tokenArr.push(new Token("white", 6, 4, "white8"));

      for (const tok of tokenArr) {
        const sq = this.getSquare(tok.x, tok.y);
        sq.setContent(tok);
      }
      const sq = this.getSquare(4, 4);
      sq.setIsThrone(true);
    };
    this.playerTurn = "black";
    this.board = [];
    for (let x = 0; x < TAB_SIZE; x++) {
      const tab = [];
      for (let y = 0; y < TAB_SIZE; y++) {
        const sq = new Square(x, y);
        tab.push(sq);
      }
      this.board.push(tab);
    }

    initTokenPos();
  }

  changePlayer() {
    if (this.playerTurn === "black") {
      this.playerTurn = "white";
    } else if (this.playerTurn === "white") {
      this.playerTurn = "black";
    }
  }

  getSquare(x, y) {
    return this.board[x][y];
  }

  getSameCol(y) {
    const tab = [];
    this.board.forEach(elem => {
      tab.push(elem[y]);
    });
    return tab;
  }

  getSameLine(x) {
    return this.board[x];
  }

  moveToken(token, finalPos) {
    if (this.playerTurn === token.color) {
      const sqStart = this.getSquare(token.x, token.y);
      const sqEnd = this.getSquare(finalPos.x, finalPos.y);
      sqStart.setContent(null);
      sqEnd.setContent(token);
      token.setPos(finalPos.x, finalPos.y);

      // this.changePlayer();
    }
  }

  deleteToken(token) {
    const sqStart = this.getSquare(token.x, token.y);
    sqStart.setContent(null);
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
      this.captureToken();

      this.changePlayer();
    }
  }

  captureToken() {
    
  }
}
