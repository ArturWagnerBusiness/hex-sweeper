"use strict";
import { Board } from "./board.ts";
import "./style.css";

const button = document.querySelector<HTMLButtonElement>("#new-game");
if (button)
  button.addEventListener("click", () => {
    const board = new Board();
    const boardDiv = document.querySelector<HTMLDivElement>("#board");
    const seed = document.querySelector<HTMLInputElement>("#seed");
    const boardInputWidth =
      document.querySelector<HTMLInputElement>("#board-size-w");
    const boardInputHeight =
      document.querySelector<HTMLInputElement>("#board-size-h");
    const boardBombs = document.querySelector<HTMLDivElement>("#board-bombs");
    const boardEnergy = document.querySelector<HTMLDivElement>("#board-energy");

    if (
      seed &&
      boardDiv &&
      boardInputWidth &&
      boardInputHeight &&
      boardBombs &&
      boardEnergy
    )
      board.placeBoard(
        parseInt(boardInputWidth.value),
        parseInt(boardInputHeight.value),
        parseInt(seed.value),
        boardDiv,
        boardBombs,
        boardEnergy
      );
    else alert("Game failed to start! (DOM Element or Input is null)");
  });
