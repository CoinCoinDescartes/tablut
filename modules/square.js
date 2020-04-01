export class Square {
  constructor(x, y) {
    this.content = null;
    this.x = x;
    this.y = y;
  }

  setContent(content) {
    this.content = content;
  }

  setIsThrone(isThrone) {
    this.isThrone = isThrone;
  }
}
