import { Tile } from "./tile";

export const tileSizeHeight = 44;
export const tileSizeWidth = 52;

export const secondRowOffset = 26;
export const generalPadding = 10;

export class Board {
  tiles: Tile[][] = [];
  bombs = [0, 0, 0];
  bombElement!: HTMLDivElement;
  constructor() {}
  renderBombDisplay() {
    this.bombElement.innerHTML = `<p>
<b>1:</b><span>${this.bombs[0]}</span>
<b>2:</b><span>${this.bombs[1]}</span>
<b>3:</b><span>${this.bombs[2]}</span>
</p>`;
  }
  checkWin() {
    let unInteracted = this.tiles.length ** 2;
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        const tile = this.tiles[x][y];
        if (tile.isExplored || tile.isKnown || tile.bombValue > 0)
          unInteracted--;
      }
    }
    if (unInteracted === 0) {
      let errors = 0;
      for (let x = 0; x < this.tiles.length; x++) {
        for (let y = 0; y < this.tiles[x].length; y++) {
          const tile = this.tiles[x][y];
          if (tile.bombValue > 0) {
            if (tile.triggeredBomb) {
              errors++;
            } else tile.triggerBomb();
          }
        }
      }
      this.bombElement.innerHTML += `<h1>You Won! ${
        errors === 0 ? "Perfect Score!" : `(but ${errors} exploded)`
      }</h1>`;
    }
  }
  placeBoard(
    size: number,
    boardDiv: HTMLDivElement,
    bombElement: HTMLDivElement
  ) {
    this.bombElement = bombElement;
    boardDiv.style.width =
      generalPadding * 3 + secondRowOffset + tileSizeWidth * size + "px";
    boardDiv.style.height = generalPadding * 4 + tileSizeHeight * size + "px";
    this.tiles = [];
    this.bombs = [0, 0, 0];
    for (let x = 0; x < size; x++) {
      let row: Tile[] = [];
      for (let y = 0; y < size; y++) {
        let random = Math.random();
        if (random < 0.85) {
          random = 0;
        } else if (random < 0.95) {
          random = 1;
          this.bombs[0]++;
        } else if (random < 0.985) {
          random = 2;
          this.bombs[1]++;
        } else {
          random = 3;
          this.bombs[2]++;
        }
        const tile = new Tile(this, {
          position: { x, y },
          value: random,
        });
        tile.spawnNode(boardDiv);
        // if (tile.bombValue !== 0) {
        //   tile.element.style.backgroundColor = "red";
        //   tile.element.innerText = tile.bombValue.toString();
        // }
        row.push(tile);
      }
      this.tiles.push(row);
    }
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const current = this.tiles[x][y];
        if (current.position.y > 0) {
          if (current.position.y % 2 === 1) {
            const topLeft = this.tiles[x][y - 1];
            current.neighborsNamed.topLeft = topLeft;
            current.neighborsArray.push(topLeft);
            if (current.position.x < size - 1) {
              const topRight = this.tiles[x + 1][y - 1];
              current.neighborsNamed.topRight = topRight;
              current.neighborsArray.push(topRight);
            }
          } else {
            const topRight = this.tiles[x][y - 1];
            current.neighborsNamed.topRight = topRight;
            current.neighborsArray.push(topRight);
            if (current.position.x > 0) {
              const topLeft = this.tiles[x - 1][y - 1];
              current.neighborsNamed.topLeft = topLeft;
              current.neighborsArray.push(topLeft);
            }
          }
        }
        if (current.position.x > 0) {
          const left = this.tiles[x - 1][y];
          current.neighborsNamed.left = left;
          current.neighborsArray.push(left);
        }
        if (current.position.x < size - 1) {
          const right = this.tiles[x + 1][y];
          current.neighborsNamed.right = right;
          current.neighborsArray.push(right);
        }
        if (current.position.y < size - 1) {
          if (current.position.y % 2 === 1) {
            const bottomLeft = this.tiles[x][y + 1];
            current.neighborsNamed.bottomLeft = bottomLeft;
            current.neighborsArray.push(bottomLeft);
            if (current.position.x < size - 1) {
              const bottomRight = this.tiles[x + 1][y + 1];
              current.neighborsNamed.bottomRight = bottomRight;
              current.neighborsArray.push(bottomRight);
            }
          } else {
            const bottomRight = this.tiles[x][y + 1];
            current.neighborsNamed.bottomRight = bottomRight;
            current.neighborsArray.push(bottomRight);
            if (current.position.x > 0) {
              const bottomLeft = this.tiles[x - 1][y + 1];
              current.neighborsNamed.bottomLeft = bottomLeft;
              current.neighborsArray.push(bottomLeft);
            }
          }
        }

        current.neighborsNamed;
      }
    }
    this.renderBombDisplay();
  }
}
