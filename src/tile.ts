"use strict";

type TileSides =
  | "topLeft"
  | "topRight"
  | "left"
  | "right"
  | "bottomLeft"
  | "bottomRight";
type Coordinate = { x: number; y: number };
export class Tile {
  isExplored: boolean = false;
  isKnown: boolean = false;
  isFlag: boolean = false;
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
  element!: HTMLDivElement;
  position: Coordinate;
  constructor(options: {
    isExplored?: Tile["isExplored"];
    neighborsNamed?: Tile["neighborsNamed"];
    position?: Tile["position"];
    value?: number;
  }) {
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
  public onClick(event?: MouseEvent) {
    if (this.isFlag && event) return console.log("prevented Flag Click");
    if (this.isExplored) return console.log("Clicked on known node");
    this.isExplored = true;

    if (this.bombValue !== 0) {
      this.element.innerText = this.bombValue.toString();
      this.element.style.backgroundColor = "red";
    } else {
      const surroundingRisk = this.neighborsArray.reduce<number>(
        (total, tile) => total + tile.bombValue,
        0
      );
      if (surroundingRisk === 0) {
        this.neighborsArray.forEach((tile) => {
          if (!tile.isExplored && !tile.isKnown) tile.onEcho();
        });
        this.element.innerText = "";
        this.element.style.backgroundColor = "green";
      } else {
        this.element.innerText = surroundingRisk.toString();
        this.element.style.backgroundColor = "#4fc14f";
      }
    }
    // this.paintNeighbors();
    // this.tagNeighbors();
  }
  public onContext(event?: MouseEvent) {
    if (event) event.preventDefault();
    if (this.isKnown) return;
    this.isFlag = !this.isFlag;
    this.element.innerText = this.isFlag ? "P" : "";
  }
  public onEcho() {
    this.isKnown = true;
    const surroundingRisk = this.neighborsArray.reduce<number>(
      (total, tile) => total + tile.bombValue,
      0
    );
    if (surroundingRisk === 0) {
      this.onClick();
    } else {
      this.element.innerText = surroundingRisk.toString();
      this.element.style.backgroundColor = "#4fc14f";
    }
  }
  private paintNeighbors() {
    this.neighborsArray.forEach((tile) => {
      if (!tile.element) return;
      tile.element.style.background = "red";
    });
  }
  private tagNeighbors() {
    if (this.neighborsNamed.bottomLeft?.element)
      this.neighborsNamed.bottomLeft.element.innerText = "BL";
    if (this.neighborsNamed.bottomRight?.element)
      this.neighborsNamed.bottomRight.element.innerText = "BR";
    if (this.neighborsNamed.left?.element)
      this.neighborsNamed.left.element.innerText = "L";
    if (this.neighborsNamed.right?.element)
      this.neighborsNamed.right.element.innerText = "R";
    if (this.neighborsNamed.topLeft?.element)
      this.neighborsNamed.topLeft.element.innerText = "TL";
    if (this.neighborsNamed.topRight?.element)
      this.neighborsNamed.topRight.element.innerText = "TR";
  }
  public spawnNode(boardDiv: HTMLDivElement) {
    this.element = document.createElement("div");
    this.element.addEventListener("click", (event) => this.onClick(event));
    this.element.addEventListener("contextmenu", (event) =>
      this.onContext(event)
    );
    this.element.classList.add("tile");
    this.element.style.top = 40 * this.position.y + "px";
    this.element.style.left =
      20 * (this.position.y % 2) + 40 * this.position.x + "px";
    boardDiv.appendChild(this.element);
  }
}
