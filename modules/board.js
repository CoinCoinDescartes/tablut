import { Square } from "./square.js";
import { Token } from "./token.js";

export class Board {
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

  getSquare(x, y) {
    if (x > 8 || x < 0 || y > 8 || y < 0) {
      return;
    }
    return this.board[x][y];
  }

  getNorthSquare(x, y) {
    return this.getSquare(x - 1, y);
  }
  getSouthSquare(x, y) {
    return this.getSquare(x + 1, y);
  }
  getEastSquare(x, y) {
    return this.getSquare(x, y + 1);
  }
  getWestSquare(x, y) {
    return this.getSquare(x, y - 1);
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

  getSquareAround(token) {
    const x = token.x;
    const y = token.y;

    const squareAround = {
      north: undefined,
      south: undefined,
      east: undefined,
      west: undefined
    };

    squareAround.north = this.getNorthSquare(x, y);
    squareAround.south = this.getSouthSquare(x, y);
    squareAround.east = this.getEastSquare(x, y);
    squareAround.west = this.getWestSquare(x, y);

    return squareAround;
  }

  moveToken(token, finalPos) {
    const sqStart = this.getSquare(token.x, token.y);
    const sqEnd = this.getSquare(finalPos.x, finalPos.y);
    sqStart.setContent(null);
    sqEnd.setContent(token);
    token.setPos(finalPos.x, finalPos.y);
  }

  deleteToken(token) {
    const sqStart = this.getSquare(token.x, token.y);
    sqStart.setContent(null);
  }
}
