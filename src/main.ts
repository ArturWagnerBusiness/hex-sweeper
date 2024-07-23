"use strict";
import { Board } from "./board.ts";
import "./style.css";

const button = document.querySelector<HTMLButtonElement>("#new-game");
if (button)
  button.addEventListener("click", () => {
    const board = new Board();
    const boardDiv = document.querySelector<HTMLDivElement>("#board");
    const boardInput = document.querySelector<HTMLInputElement>("#board-size");

    if (boardDiv && boardInput)
      board.placeBoard(parseInt(boardInput.value), boardDiv);
  });
