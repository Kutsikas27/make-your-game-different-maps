//@ts-nocheck

// draw the board based on the values in the tempBoard array
const drawBoard = (val) => {
  const div = document.createElement("div");
  const img = document.createElement("img");
  div.classList.add("box");
  // wall
  if (val === 1) {
    img.src = "img/tile-bush.png";
    img.classList.add("wall");
    div.appendChild(img);
  }
  // dot / path
  if (val === 2) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    div.append(dot);
  }
  // superdot
  if (val === 3) {
    const dot = document.createElement("div");
    dot.classList.add("superdot");
    div.append(dot);
  }
  // ghost hideout
  if (val === 4) {
    div.classList.add("hideout");

    game.startGhost.push(myBoard.length);
  }
  // extra time
  if (val === 5) {
    const dot = document.createElement("div");
    dot.classList.add("extraTime");
    div.append(dot);
  }
  // exit ladder
  if (val === 26) {
    img.src = "img/ladder.png";
    img.classList.add("ladder");
    div.appendChild(img);
  }
  game.grid.append(div);
  myBoard.push(div);
  div.t = val;
  div.idVal = myBoard.length;
};
