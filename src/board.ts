import { Random } from "./mersenne-twister";
import { Tile } from "./tile";

export const tileSizeHeight = 44 + 3;
export const tileSizeWidth = 52 + 2;

export const secondRowOffset = 26;
export const generalPadding = 0;
function padZero(number: number): string {
  return `${number < 10 ? "0" : ""}${number}`;
}
function parseTimeDuration(timeInSeconds: number) {
  const h = Math.floor(timeInSeconds / 3600);
  const m = Math.floor((timeInSeconds % 3600) / 60);
  const s = timeInSeconds % 60;
  if (m + h === 0) return `0:${padZero(s)}`;
  if (h === 0) return `${m}:${padZero(s)}`;
  return `${h}:${padZero(m)}:${padZero(s)}`;
}
function bombColor(number: number) {
  if (number < 0) return "red";
  if (number === 0) return "green";
  if (number < 5) return "yellow";
  return "white";
}
export class Board {
  processingEchos = 0;
  tiles: Tile[][] = [];
  bombs = [0, 0, 0, 0, 0];
  hits = 0;
  seed = 0;
  bombElement!: HTMLDivElement;
  startTime: number = 0;
  won = false;
  constructor() {}
  renderBombDisplay() {
    this.bombElement.innerHTML = `<p>
    <span class='group' style="font-size: 14px;">
      <span>
        ${this.seed.toString()}
      </span>
    </span>
<span class='group'>
  <span class='header'>1</span>
  <span class='value' style="color: ${bombColor(this.bombs[0])}">
    ${this.bombs[0]}
  </span>
</span>
<span class='group'>
  <span class='header'>2</span>
  <span class='value' style="color: ${bombColor(this.bombs[1])}">
    ${this.bombs[1]}
  </span>
</span>
<span class='group'>
  <span class='header'>3</span>
  <span class='value' style="color: ${bombColor(this.bombs[2])}">
    ${this.bombs[2]}
  </span>
</span>
<span class='group'>
  <span class='header'>4</span>
  <span class='value' style="color: ${bombColor(this.bombs[3])}">
    ${this.bombs[3]}
  </span>
</span>
<span class='group'>
  <span class='header'>5</span>
  <span class='value' style="color: ${bombColor(this.bombs[4])}">
    ${this.bombs[4]}
  </span>
</span>
<span class='group'>
  <span class='header'>Hits</span>
  <span class='value' style="color: ${this.hits > 0 ? "red" : "white"}">
    ${this.hits}
  </span>
</span>
</p>`;
  }
  checkWin() {
    if (this.won) return;
    let unInteracted = this.tiles.length * this.tiles[0].length;
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        const tile = this.tiles[x][y];
        if (tile.isExplored || tile.isKnown || tile.bombValue > 0)
          unInteracted--;
      }
    }
    if (unInteracted === 0) {
      this.won = true;
      let errors = 0;
      for (let x = 0; x < this.tiles.length; x++) {
        for (let y = 0; y < this.tiles[x].length; y++) {
          const tile = this.tiles[x][y];
          if (tile.bombValue > 0) {
            if (tile.triggeredBomb) {
              errors++;
            } else tile.triggerBomb(true);
          }
        }
      }
      this.bombElement.innerHTML += `<p>You Won! ${
        errors === 0 ? "Perfect Score!" : `(but ${errors} exploded)`
      } | Time: ${parseTimeDuration(
        Math.floor((Date.now() - this.startTime) / 1000)
      )}</p>`;
    }
  }
  placeBoard(
    sizeWidth: number,
    sizeHeight: number,
    seedNAN: number,
    boardDiv: HTMLDivElement,
    bombElement: HTMLDivElement
  ) {
    this.processingEchos = 0;
    this.won = false;
    boardDiv.innerHTML = "";
    this.startTime = Date.now();
    this.bombElement = bombElement;
    boardDiv.style.width =
      generalPadding * 3 + secondRowOffset + tileSizeWidth * sizeWidth + "px";
    boardDiv.style.height =
      generalPadding * 4 + tileSizeHeight * sizeHeight + "px";
    this.tiles = [];
    this.bombs = [0, 0, 0, 0, 0];
    this.hits = 0;
    this.seed = Number.isNaN(seedNAN) ? new Date().getTime() : seedNAN;
    const randomIterator = new Random(this.seed);

    for (let x = 0; x < sizeWidth; x++) {
      let row: Tile[] = [];
      for (let y = 0; y < sizeHeight; y++) {
        let random = randomIterator.nextNumber();
        if (random < 0.8) random = 0; // 10%
        else if (random < 0.9) this.bombs[(random = 1) - 1]++; // 5%
        else if (random < 0.95) this.bombs[(random = 2) - 1]++; // 2.5%
        else if (random < 0.975) this.bombs[(random = 3) - 1]++; // 1.5%
        else if (random < 0.99) this.bombs[(random = 4) - 1]++; // 1%
        else this.bombs[(random = 5) - 1]++;
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
    for (let x = 0; x < sizeWidth; x++) {
      for (let y = 0; y < sizeHeight; y++) {
        const current = this.tiles[x][y];
        if (current.position.y > 0) {
          if (current.position.y % 2 === 1) {
            const topLeft = this.tiles[x][y - 1];
            current.neighborsNamed.topLeft = topLeft;
            current.neighborsArray.push(topLeft);
            if (current.position.x < sizeWidth - 1) {
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
        if (current.position.x < sizeWidth - 1) {
          const right = this.tiles[x + 1][y];
          current.neighborsNamed.right = right;
          current.neighborsArray.push(right);
        }
        if (current.position.y < sizeHeight - 1) {
          if (current.position.y % 2 === 1) {
            const bottomLeft = this.tiles[x][y + 1];
            current.neighborsNamed.bottomLeft = bottomLeft;
            current.neighborsArray.push(bottomLeft);
            if (current.position.x < sizeWidth - 1) {
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
