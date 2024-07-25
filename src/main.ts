"use strict";
import { Board } from "./board.ts";
import "./style.css";

const button = document.querySelector<HTMLButtonElement>("#new-game");
if (button)
  button.addEventListener("click", () => {
    const board = new Board();
    const boardDiv = document.querySelector<HTMLDivElement>("#board");
    const boardInputWidth =
      document.querySelector<HTMLInputElement>("#board-size-w");
    const boardInputHeight =
      document.querySelector<HTMLInputElement>("#board-size-h");
    const boardBombs = document.querySelector<HTMLDivElement>("#board-bombs");

    if (boardDiv && boardInputWidth && boardInputHeight && boardBombs)
      board.placeBoard(
        parseInt(boardInputWidth.value),
        parseInt(boardInputHeight.value),
        boardDiv,
        boardBombs
      );
  });
