import { Tile } from "./tile";

export class Board {
  tiles: Tile[][] = [];
  constructor() {}
  placeBoard(size: number, boardDiv: HTMLDivElement) {
    boardDiv.style.width = 20 + 40 * size + "px";
    boardDiv.style.height = 40 * size + "px";
    this.tiles = [];
    for (let x = 0; x < size; x++) {
      let row: Tile[] = [];
      for (let y = 0; y < size; y++) {
        let random = Math.random();
        if (random < 0.85) {
          random = 0;
        } else if (random < 0.95) {
          random = 1;
        } else if (random < 0.985) {
          random = 2;
        } else {
          random = 3;
        }
        const tile = new Tile({
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
  }
}
