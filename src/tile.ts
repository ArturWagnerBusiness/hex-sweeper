"use strict";

import {
  Board,
  generalPadding,
  secondRowOffset,
  tileSizeHeight,
  tileSizeWidth,
} from "./board";

async function wait(durationMS: number) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, durationMS);
  });
}
type TileSides =
  | "topLeft"
  | "topRight"
  | "left"
  | "right"
  | "bottomLeft"
  | "bottomRight";
type Coordinate = { x: number; y: number };
const bombString = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];
export class Tile {
  board: Board;
  isExplored: boolean = false;
  isKnown: boolean = false;
  triggeredBomb = false;
  isFlag = 0;
  neighborsNamed: {
    [key in TileSides]: Tile | null;
  } = {
    topLeft: null,
    topRight: null,
    left: null,
    right: null,
    bottomLeft: null,
    bottomRight: null,
  };
  neighborsArray: Tile[] = [];
  bombValue: number = 0;
  tileElement!: HTMLDivElement;
  hexElement!: HTMLDivElement;
  position: Coordinate;
  constructor(
    board: Board,
    options: {
      isExplored?: Tile["isExplored"];
      neighborsNamed?: Tile["neighborsNamed"];
      position?: Tile["position"];
      value?: number;
    }
  ) {
    this.board = board;
    if (options?.isExplored) this.isExplored = options.isExplored;
    if (options?.neighborsNamed) this.neighborsNamed = options.neighborsNamed;
    if (options?.value) this.bombValue = options.value;

    if (options?.neighborsNamed) {
      for (const tile of Object.values(options.neighborsNamed)) {
        if (tile !== null) this.neighborsArray.push(tile);
      }
    }

    if (!options?.position) throw new Error(`Position must be defined on Tile`);
    this.position = options.position;
  }
  public triggerBomb(preventRegisteringHit = false) {
    if (this.triggeredBomb) return;
    this.triggeredBomb = true;
    if (this.isFlag !== 0) {
      this.board.bombs[this.isFlag - 1]++;
      this.board.renderBombDisplay();
      this.isFlag = 0;
    }
    this.hexElement.innerText = bombString[this.bombValue - 1];
    this.hexElement.className = "hex bomb";
    this.board.bombs[this.bombValue - 1]--;
    if (!preventRegisteringHit) this.board.hits++;
    this.board.renderBombDisplay();
  }
  public async onClick(event?: MouseEvent) {
    if (this.isFlag !== 0 && event) return console.log("prevented Flag Click");
    if (this.isExplored) return console.log("Clicked on known node");
    if (event && this.board.processingEchos > 0) return;

    this.isExplored = true;
    if (this.bombValue !== 0) {
      this.triggerBomb();
    } else {
      const surroundingRisk = this.neighborsArray.reduce<number>(
        (total, tile) => total + tile.bombValue,
        0
      );
      if (surroundingRisk === 0) {
        for (const tile of this.neighborsArray) {
          if (!tile.isExplored && !tile.isKnown) {
            this.board.processingEchos++;
            tile.onEcho();
          }
        }
        this.hexElement.innerText = "";
        this.hexElement.className = "hex explored";
      } else {
        this.hexElement.innerText = surroundingRisk.toString();
        this.hexElement.className = "hex risky";
      }
    }
    this.board.checkWin();

    // this.paintNeighbors();
    // this.tagNeighbors();
  }
  public onContext(event?: MouseEvent) {
    event?.preventDefault();
    if (event && this.board.processingEchos > 0) return;

    if (this.isKnown || this.isExplored) return;
    this.isFlag = this.isFlag === this.board.bombs.length ? 0 : this.isFlag + 1;
    if (this.isFlag === 0) {
      this.board.bombs[this.board.bombs.length - 1]++;
    } else if (this.isFlag === 1) {
      this.board.bombs[0]--;
    } else {
      this.board.bombs[this.isFlag - 2]++;
      this.board.bombs[this.isFlag - 1]--;
    }
    this.board.renderBombDisplay();
    this.hexElement.innerText = this.isFlag === 0 ? "" : `${this.isFlag} ᖰ`;
  }
  public async onEcho() {
    await wait(50);
    this.isKnown = true;
    const surroundingRisk = this.neighborsArray.reduce<number>(
      (total, tile) => total + tile.bombValue,
      0
    );
    if (surroundingRisk === 0) {
      await this.onClick();
    } else {
      this.hexElement.innerText = surroundingRisk.toString();
      this.hexElement.className = "hex risky";
    }
    this.board.processingEchos--;
  }
  public paintNeighbors() {
    this.neighborsArray.forEach((tile) => {
      if (!tile.tileElement) return;
      tile.tileElement.style.background = "red";
    });
  }
  public tagNeighbors() {
    if (this.neighborsNamed.bottomLeft?.tileElement)
      this.neighborsNamed.bottomLeft.tileElement.innerText = "BL";
    if (this.neighborsNamed.bottomRight?.tileElement)
      this.neighborsNamed.bottomRight.tileElement.innerText = "BR";
    if (this.neighborsNamed.left?.tileElement)
      this.neighborsNamed.left.tileElement.innerText = "L";
    if (this.neighborsNamed.right?.tileElement)
      this.neighborsNamed.right.tileElement.innerText = "R";
    if (this.neighborsNamed.topLeft?.tileElement)
      this.neighborsNamed.topLeft.tileElement.innerText = "TL";
    if (this.neighborsNamed.topRight?.tileElement)
      this.neighborsNamed.topRight.tileElement.innerText = "TR";
  }
  public spawnNode(boardDiv: HTMLDivElement) {
    this.tileElement = document.createElement("div");
    this.tileElement.addEventListener("click", (event) => this.onClick(event));
    this.tileElement.addEventListener("contextmenu", (event) =>
      this.onContext(event)
    );
    this.hexElement = document.createElement("div");
    this.hexElement.className = "hex unknown";
    this.tileElement.appendChild(this.hexElement);
    this.tileElement.classList.add("tile");
    this.tileElement.style.top =
      generalPadding + tileSizeHeight * this.position.y + "px";
    this.tileElement.style.left =
      generalPadding +
      secondRowOffset * (this.position.y % 2) +
      tileSizeWidth * this.position.x +
      "px";
    boardDiv.appendChild(this.tileElement);
  }
}
