# Multi bomb Hex Minesweeper

**Minesweeper** is a great game. The thought process that you go through when debating where the bomb could be when given little information is _exciting_. What about bumping the difficulty while still keeping it within a sane difficulty level?<br>
This is where the multi strength bomb factor comes in. Can you play Minesweeper with the additional challenge of maths? (I believe you can!)

[Play Now!](https://arturwagner.co.uk/hex-sweeper/release/index.html)

## Play in browser

Available on<br>
\> [arturwagner.co.uk/hex-sweeper/release/index.html](https://arturwagner.co.uk/hex-sweeper/release/index.html)

<img src="https://i.imgur.com/YxSdwXi.png" width=100%>

### How to Play

The main principle is the same as minesweeper. Numbers show the total of mines around the tile. The difference is that mines can have a value of more than 1. You can place numbered flags for assistance or destroy the flag with the mine underneath. The mines are shown at the top. Get them all to 0 and uncover all of the land. Aim for 0 hits if possible!

### Features

- Hex Grid instead of a normal square grid.
- Bombs can be of different strength.
- Pick board width and height.
- Destroy mines using energy.
- See mines by making the seed negative.

> [!TIP]
> Right click flag clicked to increase the predicted bomb strength.
>
> If mine counters show -1, you got something wrong!
>
> You can still play event after hitting a bomb, but you wont get a perfect score.
>
> Right click flag to destroy the mine underneath. (Uses equal energy)
>
> Use a flag of rate 5 to guarantee no hits (At highest energy cost)

### Development run instructions:

> repo> git clone [URL OF THIS PAGE] <br>
> repo> npm i <br>
> repo> npm run dev

> [!CAUTION]
> npm run build creates broken builds that require CORS to run. Required manual intervention.
